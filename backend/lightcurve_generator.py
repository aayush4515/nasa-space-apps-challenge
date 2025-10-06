import lightkurve as lk
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
from matplotlib import pyplot as plt
import pandas as pd
import os
import logging
import io
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
    
    def retrieve_lc(self, kepid: int) -> Tuple[bool, bytes, str]:
        """
        Retrieve and generate lightcurve for a given kepid.
        OPTIMIZED for production deployment with memory constraints.
        
        Args:
            kepid: The Kepler ID
            
        Returns:
            Tuple of (success, image_data, filename)
        """
        try:
            kepler_id = 'KIC ' + str(kepid)
            file_name = f'{kepid}.png'
            
            logger.info(f"Generating lightcurve for kepid: {kepid}")
            
            # OPTIMIZATION: Limit data download and processing
            lcs = lk.search_lightcurve(kepler_id, exptime='long', author='Kepler', limit=1).download_all()
            
            if not lcs:
                logger.warning(f"No lightcurve data found for {kepler_id}")
                return False, None, None
            
            # OPTIMIZATION: Simplified processing
            lcRaw = lcs.stitch()
            
            # OPTIMIZATION: Skip heavy processing steps that cause timeouts
            # Just use basic cleaning
            lcClean = lcRaw.remove_outliers()
            
            # OPTIMIZATION: Skip gap filling and flattening to reduce processing time
            # lcClean = lcClean.fill_gaps()
            # lcClean = lcClean.flatten()
            # lcClean = lcClean.bin()
            
            # OPTIMIZATION: Smaller figure size and lower DPI
            plt.figure(figsize=(4, 3), dpi=100)  # Reduced size and DPI
            plt.title(f"Light Curve for KIC {kepid}", fontsize=10, fontweight='bold')
            plt.xlabel("Time (days)", fontsize=8)
            plt.ylabel("Normalized Flux", fontsize=8)
            
            # OPTIMIZATION: Plot fewer points to reduce memory usage
            time_values = lcClean.time.value
            flux_values = lcClean.flux
            
            # Downsample if too many points
            if len(time_values) > 1000:
                step = len(time_values) // 1000
                time_values = time_values[::step]
                flux_values = flux_values[::step]
            
            plt.plot(time_values, flux_values, lw=0.5, color='#4a9eff', alpha=0.8)
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
            
            # OPTIMIZATION: Lower DPI and smaller buffer
            buffer = io.BytesIO()
            plt.savefig(buffer, dpi=150, bbox_inches='tight', facecolor='white', format='png')
            plt.close()  # Close the figure to free memory
            
            # Get the image data
            image_data = buffer.getvalue()
            buffer.close()
            
            # OPTIMIZATION: Clear variables to free memory
            del lcs, lcRaw, lcClean, time_values, flux_values
            
            logger.info(f"Lightcurve generated for kepid: {kepid}")
            return True, image_data, file_name
            
        except Exception as e:
            logger.error(f"Error generating lightcurve for kepid {kepid}: {str(e)}")
            return False, None, None
    
    def generate_lightcurve_for_kepoi(self, kepoi_name: str) -> Tuple[bool, bytes, str, int]:
        """
        Generate lightcurve for a given kepoi_name.
        Uses fallback simple generator if full generation fails.
        
        Args:
            kepoi_name: The Kepler Object of Interest name
            
        Returns:
            Tuple of (success, image_data, filename, kepid)
        """
        try:
            # Get kepid from kepoi_name
            kepid = self.get_kepid_from_kepoi_name(kepoi_name)
            if kepid is None:
                return False, None, None, None
            
            # Try full lightcurve generation first
            try:
                success, image_data, filename = self.retrieve_lc(kepid)
                if success and image_data:
                    return success, image_data, filename, kepid
            except Exception as e:
                logger.warning(f"Full lightcurve generation failed for {kepoi_name}: {str(e)}")
            
            # Fallback to simple lightcurve generation
            logger.info(f"Using fallback simple lightcurve for {kepoi_name}")
            from simple_lightcurve import generate_simple_lightcurve
            success, image_data, filename = generate_simple_lightcurve(kepid)
            return success, image_data, filename, kepid
            
        except Exception as e:
            logger.error(f"Error generating lightcurve for {kepoi_name}: {str(e)}")
            return False, None, None, None

# Create a global instance
lightcurve_generator = LightcurveGenerator()

def generate_lightcurve(kepoi_name: str) -> Tuple[bool, bytes, str, int]:
    """
    Convenience function to generate lightcurve for a kepoi_name.
    
    Args:
        kepoi_name: The Kepler Object of Interest name
        
    Returns:
        Tuple of (success, image_data, filename, kepid)
    """
    return lightcurve_generator.generate_lightcurve_for_kepoi(kepoi_name)
