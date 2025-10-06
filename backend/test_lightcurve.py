#!/usr/bin/env python3
"""
Test script for lightcurve generator
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from lightcurve_generator import generate_lightcurve

def test_lightcurve():
    """Test lightcurve generation for a sample kepoi_name"""
    try:
        print("Testing lightcurve generation...")
        
        # Test with a sample kepoi_name
        kepoi_name = "K00752.02"
        success, file_path = generate_lightcurve(kepoi_name)
        
        if success:
            print(f"✅ Lightcurve generated successfully!")
            print(f"📁 File saved to: {file_path}")
            print(f"🖼️  Image title: Lightcurve for {kepoi_name}")
        else:
            print(f"❌ Failed to generate lightcurve for {kepoi_name}")
            
    except Exception as e:
        print(f"❌ Error testing lightcurve: {str(e)}")

if __name__ == "__main__":
    test_lightcurve()
