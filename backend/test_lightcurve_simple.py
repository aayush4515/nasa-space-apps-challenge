#!/usr/bin/env python3
"""
Simple test for lightcurve generation
"""

import os
import sys
import logging

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from lightcurve_generator import generate_lightcurve

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_lightcurve():
    """Test lightcurve generation"""
    try:
        # Test with a known KOI
        test_koi = "K00752.01"
        logger.info(f"Testing lightcurve generation for {test_koi}")
        
        success, file_path = generate_lightcurve(test_koi)
        
        if success:
            logger.info(f"✅ Lightcurve generated successfully: {file_path}")
            if os.path.exists(file_path):
                logger.info(f"✅ File exists: {file_path}")
                return True
            else:
                logger.error(f"❌ File not found: {file_path}")
                return False
        else:
            logger.error(f"❌ Lightcurve generation failed for {test_koi}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error testing lightcurve: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_lightcurve()
    if success:
        print("✅ Lightcurve test passed!")
        sys.exit(0)
    else:
        print("❌ Lightcurve test failed!")
        sys.exit(1)
