import lightkurve as lk
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
from matplotlib import pyplot as plt
import pandas as pd
import os
import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

class LightcurveGenerator:
    def __init__(self, dataset_path: str = '../Assets/clean_kepler_dataset.csv'):
        """
        Initialize the lightcurve generator with the Kepler dataset.
        
        Args:
            dataset_path: Path to the clean Kepler dataset CSV file
        """
        self.dataset_path = dataset_path
        self.df = None
        self.load_dataset()
    
    def load_dataset(self):
        """Load the Kepler dataset for kepid mapping."""
        try:
            self.df = pd.read_csv(self.dataset_path)
            logger.info(f"Loaded Kepler dataset with {len(self.df)} rows")
        except Exception as e:
            logger.error(f"Error loading dataset: {str(e)}")
            raise
    
    def get_kepid_from_kepoi_name(self, kepoi_name: str) -> Optional[int]:
        """
        Get kepid from kepoi_name.
        
        Args:
            kepoi_name: The Kepler Object of Interest name (e.g., 'K00752.01')
            
        Returns:
            kepid if found, None otherwise
        """
        try:
            matching_rows = self.df[self.df['kepoi_name'] == kepoi_name]
            if matching_rows.empty:
                logger.warning(f"No matching row found for kepoi_name: {kepoi_name}")
                return None
            
            kepid = matching_rows['kepid'].iloc[0]
            logger.info(f"Found kepid {kepid} for kepoi_name {kepoi_name}")
            return int(kepid)
        except Exception as e:
            logger.error(f"Error getting kepid for {kepoi_name}: {str(e)}")
            return None
    
    def retrieve_lc(self, kepid: int, output_dir: str = 'lightcurves') -> Tuple[bool, str]:
        """
        Retrieve and generate lightcurve for a given kepid.
        
        Args:
            kepid: The Kepler ID
            output_dir: Directory to save the lightcurve image
            
        Returns:
            Tuple of (success, file_path)
        """
        try:
            # Create output directory if it doesn't exist
            os.makedirs(output_dir, exist_ok=True)
            
            kepler_id = 'KIC ' + str(kepid)
            file_name = f'{kepid}.png'
            file_path = os.path.join(output_dir, file_name)
            
            logger.info(f"Generating lightcurve for kepid: {kepid}")
            
            # Download all short exposures
            lcs = lk.search_lightcurve(kepler_id, exptime='long', author='Kepler', limit=3).download_all()
            
            if not lcs:
                logger.warning(f"No lightcurve data found for {kepler_id}")
                return False, None
            
            # Stitch light curves together
            lcRaw = lcs.stitch()
            
            # Remove outliers with sigma clipping
            lcClean = lcRaw.remove_outliers()
            
            # Fill gaps with randomly distributed Gaussian noise
            lcClean = lcClean.fill_gaps()
            
            # Flatten curve with a Savitzky-Golay filter
            lcClean = lcClean.flatten()
            lcClean = lcClean.bin()
            
            # Plot using matplotlib
            plt.figure(figsize=(6, 4))
            plt.title(f"Light Curve for KIC {kepid}", fontsize=14, fontweight='bold')
            plt.xlabel("Time (days)", fontsize=12)
            plt.ylabel("Normalized Flux", fontsize=12)
            plt.plot(lcClean.time.value, lcClean.flux, lw=1, color='#4a9eff', alpha=0.8)
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
            
            # Save the plot
            plt.savefig(file_path, dpi=300, bbox_inches='tight', facecolor='white')
            plt.close()  # Close the figure to free memory
            
            logger.info(f"Lightcurve saved to: {file_path}")
            return True, file_path
            
        except Exception as e:
            logger.error(f"Error generating lightcurve for kepid {kepid}: {str(e)}")
            return False, None
    
    def generate_lightcurve_for_kepoi(self, kepoi_name: str, output_dir: str = 'lightcurves') -> Tuple[bool, str]:
        """
        Generate lightcurve for a given kepoi_name.
        
        Args:
            kepoi_name: The Kepler Object of Interest name
            output_dir: Directory to save the lightcurve image
            
        Returns:
            Tuple of (success, file_path)
        """
        try:
            # Get kepid from kepoi_name
            kepid = self.get_kepid_from_kepoi_name(kepoi_name)
            if kepid is None:
                return False, None
            
            # Generate lightcurve
            success, file_path = self.retrieve_lc(kepid, output_dir)
            return success, file_path
            
        except Exception as e:
            logger.error(f"Error generating lightcurve for {kepoi_name}: {str(e)}")
            return False, None

# Create a global instance
lightcurve_generator = LightcurveGenerator()

def generate_lightcurve(kepoi_name: str) -> Tuple[bool, str]:
    """
    Convenience function to generate lightcurve for a kepoi_name.
    
    Args:
        kepoi_name: The Kepler Object of Interest name
        
    Returns:
        Tuple of (success, file_path)
    """
    return lightcurve_generator.generate_lightcurve_for_kepoi(kepoi_name)
