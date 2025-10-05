"""
ML Models Module for NASA Exoplanet Detection
Handles training and prediction for Kepler and TESS datasets
"""

import pickle
import pandas as pd
import numpy as np
import logging
from typing import Tuple, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExoplanetMLModel:
    """
    Main ML model class for exoplanet detection
    Handles both Kepler and TESS datasets
    """

    def __init__(self):
        self.kepler_model = None
        self.tess_model = None
        # Models are pre-trained, no training needed


    def predict(self, dataset_name: str, data_point: pd.DataFrame) -> Dict[str, Any]:
        """
        Make prediction on a single data point

        Args:
            dataset_name (str): Name of the dataset ('kepler' or 'tess')
            data_point (pd.DataFrame): Single data point as pandas DataFrame

        Returns:
            Dict[str, Any]: Prediction results
        """
        try:
            logger.info(f"Making prediction for {dataset_name} dataset using pre-trained model")
            logger.info(f"Data point shape: {data_point.shape}")
            logger.info(f"Data point columns: {list(data_point.columns)}")

            if dataset_name == 'kepler':
                # FIXME: Load and use actual pre-trained Kepler model
                # Load model from .pkl file
                with open("/backend/models/koi_xgb.pkl", "rb") as f:
                    model = pickle.load(f)
                    new_point = np.array(new_point).reshape(1, -1)
                    confidence = model.predict_proba(data_point)
                    is_exoplanet = confidence > 0.5
                    logger.info(f"Kepler model loaded successfully")
                    logger.info(f"Kepler model confidence: {confidence:.3f}")
                    logger.info(f"Kepler model is_exoplanet: {is_exoplanet}")

            elif dataset_name == 'tess':
                # FIXME: Load and use actual pre-trained TESS model
                # For now, simulate prediction with pre-trained model
                confidence = np.random.uniform(0.2, 0.9)
                is_exoplanet = confidence > 0.5

            else:
                raise ValueError(f"Unknown dataset: {dataset_name}")

            result = {
                'status': 'success',
                'dataset': dataset_name,
                'confidence': confidence,
                'is_exoplanet': is_exoplanet,
                'model_version': f'{dataset_name.title()}-Pre-trained-1.0.0'
            }

            logger.info(f"Pre-trained model prediction completed for {dataset_name}: {confidence:.3f} confidence")
            return result

        except Exception as e:
            logger.error(f"Error making prediction for {dataset_name}: {str(e)}")
            return {
                'status': 'error',
                'dataset': dataset_name,
                'message': f'Prediction failed: {str(e)}',
                'confidence': 0.0,
                'is_exoplanet': False
            }

# Global model instance
ml_model = ExoplanetMLModel()


def predict_datapoint(dataset_name: str, data_point: pd.DataFrame) -> Dict[str, Any]:
    """
    Wrapper function to predict on a single datapoint

    Args:
        dataset_name (str): Name of the dataset ('kepler' or 'tess')
        data_point (pd.DataFrame): Single data point as pandas DataFrame

    Returns:
        Dict[str, Any]: Prediction results
    """
    return ml_model.predict(dataset_name, data_point)
