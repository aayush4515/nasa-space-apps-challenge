"""
Fallback lightcurve generation without dataset dependency
"""

import lightkurve as lk
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
from matplotlib import pyplot as plt
import os
import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

def generate_lightcurve_fallback(koi_name: str, output_dir: str = 'lightcurves') -> Tuple[bool, str]:
    """
    Generate lightcurve without dataset dependency.
    This is a fallback method that tries to extract kepid from koi_name directly.
    
    Args:
        koi_name: The Kepler Object of Interest name (e.g., 'K00752.01')
        output_dir: Directory to save the lightcurve image
        
    Returns:
        Tuple of (success, file_path)
    """
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Try to extract kepid from koi_name
        # Format: K00752.01 -> 752
        if koi_name.startswith('K') and '.' in koi_name:
            try:
                # Extract the number part
                kepid_str = koi_name[1:].split('.')[0]
                kepid = int(kepid_str)
                logger.info(f"Extracted kepid {kepid} from {koi_name}")
            except (ValueError, IndexError):
                logger.error(f"Could not extract kepid from {koi_name}")
                return False, None
        else:
            logger.error(f"Invalid koi_name format: {koi_name}")
            return False, None
        
        kepler_id = 'KIC ' + str(kepid)
        file_name = f'{kepid}.png'
        file_path = os.path.join(output_dir, file_name)
        
        logger.info(f"Generating lightcurve for {kepler_id}")
        
        # Download lightcurve data
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
        plt.title(f"Light Curve for {koi_name} (KIC {kepid})", fontsize=14, fontweight='bold')
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
        logger.error(f"Error generating lightcurve for {koi_name}: {str(e)}")
        return False, None
