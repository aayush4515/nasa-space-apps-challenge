#!/usr/bin/env python3
"""
Debug script for lightcurve generation issues
"""

import os
import sys
import logging

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_dependencies():
    """Check if all required dependencies are available"""
    try:
        import lightkurve
        print(f"✅ lightkurve version: {lightkurve.__version__}")
    except ImportError as e:
        print(f"❌ lightkurve not available: {e}")
        return False
    
    try:
        import matplotlib
        print(f"✅ matplotlib version: {matplotlib.__version__}")
    except ImportError as e:
        print(f"❌ matplotlib not available: {e}")
        return False
    
    try:
        import pandas
        print(f"✅ pandas version: {pandas.__version__}")
    except ImportError as e:
        print(f"❌ pandas not available: {e}")
        return False
    
    return True

def check_dataset():
    """Check if dataset is available"""
    possible_paths = [
        '../Assets/clean_kepler_dataset.csv',
        'Assets/clean_kepler_dataset.csv',
        './Assets/clean_kepler_dataset.csv',
        os.path.join(os.path.dirname(__file__), '..', 'Assets', 'clean_kepler_dataset.csv'),
        os.path.join(os.path.dirname(__file__), 'Assets', 'clean_kepler_dataset.csv')
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            print(f"✅ Dataset found: {path}")
            return True
    
    print("❌ Dataset not found in any expected location")
    return False

def test_lightcurve_simple():
    """Test simple lightcurve generation"""
    try:
        from lightcurve_fallback import generate_lightcurve_fallback
        
        test_koi = "K00752.01"
        print(f"Testing lightcurve generation for {test_koi}")
        
        success, file_path = generate_lightcurve_fallback(test_koi)
        
        if success:
            print(f"✅ Lightcurve generated: {file_path}")
            if os.path.exists(file_path):
                print(f"✅ File exists: {file_path}")
                return True
            else:
                print(f"❌ File not found: {file_path}")
                return False
        else:
            print(f"❌ Lightcurve generation failed")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Main debug function"""
    print("🔍 Debugging lightcurve generation...")
    print("=" * 50)
    
    # Check dependencies
    print("\n1. Checking dependencies:")
    deps_ok = check_dependencies()
    
    # Check dataset
    print("\n2. Checking dataset:")
    dataset_ok = check_dataset()
    
    # Test lightcurve generation
    print("\n3. Testing lightcurve generation:")
    if deps_ok:
        test_ok = test_lightcurve_simple()
    else:
        print("❌ Skipping lightcurve test due to missing dependencies")
        test_ok = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Summary:")
    print(f"Dependencies: {'✅' if deps_ok else '❌'}")
    print(f"Dataset: {'✅' if dataset_ok else '❌'}")
    print(f"Lightcurve: {'✅' if test_ok else '❌'}")
    
    if deps_ok and test_ok:
        print("\n🎉 All tests passed! Lightcurve generation should work.")
    else:
        print("\n⚠️  Some issues found. Check the errors above.")

if __name__ == "__main__":
    main()
