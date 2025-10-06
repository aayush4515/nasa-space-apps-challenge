"""
Data loader for Kepler dataset
Handles loading actual data for predictions
"""

import pandas as pd
import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class KeplerDataLoader:
    def __init__(self, dataset_path: str = None):
        """
        Initialize the Kepler data loader.
        
        Args:
            dataset_path: Path to the clean Kepler dataset CSV file
        """
        # Try multiple possible paths for the dataset
        possible_paths = [
            dataset_path,
            '../Assets/clean_kepler_dataset.csv',
            'Assets/clean_kepler_dataset.csv',
            './Assets/clean_kepler_dataset.csv',
            os.path.join(os.path.dirname(__file__), '..', 'Assets', 'clean_kepler_dataset.csv'),
            os.path.join(os.path.dirname(__file__), 'Assets', 'clean_kepler_dataset.csv')
        ]
        
        self.dataset_path = None
        for path in possible_paths:
            if path and os.path.exists(path):
                self.dataset_path = path
                break
        
        self.df = None
        if self.dataset_path:
            self.load_dataset()
        else:
            logger.warning("Kepler dataset not found. Predictions will use fallback data.")
    
    def load_dataset(self):
        """Load the Kepler dataset."""
        try:
            self.df = pd.read_csv(self.dataset_path)
            logger.info(f"Loaded Kepler dataset with {len(self.df)} rows from {self.dataset_path}")
        except Exception as e:
            logger.error(f"Error loading dataset: {str(e)}")
            self.df = None
    
    def get_data_for_koi(self, koi_name: str) -> Optional[pd.DataFrame]:
        """
        Get actual data for a specific KOI name.
        
        Args:
            koi_name: The Kepler Object of Interest name (e.g., 'K00752.01')
            
        Returns:
            DataFrame with the actual data for the KOI, or None if not found
        """
        if self.df is None:
            logger.warning("Dataset not loaded, cannot get data for KOI")
            return None
            
        try:
            # Find the row for this KOI
            matching_rows = self.df[self.df['kepoi_name'] == koi_name]
            if matching_rows.empty:
                logger.warning(f"No data found for KOI: {koi_name}")
                return None
            
            # Get the first matching row
            row = matching_rows.iloc[0]
            
            # Extract the 15 features needed for the model
            features = [
                'koi_period', 'koi_time0bk', 'koi_impact', 'koi_duration', 'koi_depth',
                'koi_prad', 'koi_teq', 'koi_insol', 'koi_dor', 'koi_count',
                'koi_numtransits', 'koi_tranflag', 'koi_model_snr', 'koi_steff', 'koi_slogg'
            ]
            
            # Create DataFrame with the actual data
            data_point = pd.DataFrame([row[features].values], columns=features)
            
            logger.info(f"Found actual data for {koi_name}: {len(features)} features")
            logger.info(f"Data point: {data_point.iloc[0].to_dict()}")
            
            return data_point
            
        except Exception as e:
            logger.error(f"Error getting data for {koi_name}: {str(e)}")
            return None
    
    def get_fallback_data(self, koi_name: str) -> pd.DataFrame:
        """
        Get fallback data when actual data is not available.
        
        Args:
            koi_name: The Kepler Object of Interest name
            
        Returns:
            DataFrame with fallback data
        """
        logger.info(f"Using fallback data for {koi_name}")
        
        # Create fallback data based on typical Kepler values
        fallback_data = pd.DataFrame({
            'koi_period': [365.25],
            'koi_time0bk': [0.0],
            'koi_impact': [0.1],
            'koi_duration': [0.5],
            'koi_depth': [0.001],
            'koi_prad': [1.0],
            'koi_teq': [300.0],
            'koi_insol': [1.0],
            'koi_dor': [1.0],
            'koi_count': [1],
            'koi_numtransits': [1],
            'koi_tranflag': [1],
            'koi_model_snr': [10.0],
            'koi_steff': [6000.0],
            'koi_slogg': [4.5]
        })
        
        return fallback_data

# Create a global instance
kepler_data_loader = KeplerDataLoader()

def get_kepler_data_for_prediction(koi_name: str) -> pd.DataFrame:
    """
    Get Kepler data for prediction, using actual data if available, fallback otherwise.
    
    Args:
        koi_name: The Kepler Object of Interest name
        
    Returns:
        DataFrame with data for prediction
    """
    # Try to get actual data first
    actual_data = kepler_data_loader.get_data_for_koi(koi_name)
    
    if actual_data is not None:
        return actual_data
    else:
        # Use fallback data
        return kepler_data_loader.get_fallback_data(koi_name)
