#!/usr/bin/env python3
"""
Test script to verify lightcurve database storage functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db
from lightcurve_generator import generate_lightcurve
import requests
import json

def test_lightcurve_generation():
    """Test lightcurve generation and database storage"""
    print("🧪 Testing lightcurve generation and database storage...")
    
    # Test with a known KOI name
    test_koi = "K00752.01"
    
    try:
        # Generate lightcurve
        print(f"📊 Generating lightcurve for {test_koi}...")
        success, image_data, filename, kepid = generate_lightcurve(test_koi)
        
        if success and image_data:
            print(f"✅ Lightcurve generated successfully!")
            print(f"   - Filename: {filename}")
            print(f"   - KEPID: {kepid}")
            print(f"   - Image data size: {len(image_data)} bytes")
            
            # Save to database
            print(f"💾 Saving to database...")
            db_success = db.save_lightcurve(test_koi, kepid, image_data, filename)
            
            if db_success:
                print("✅ Lightcurve saved to database successfully!")
                
                # Test retrieval
                print("🔍 Testing database retrieval...")
                retrieved_data = db.get_lightcurve_by_candidate(test_koi)
                
                if retrieved_data:
                    print("✅ Lightcurve retrieved from database successfully!")
                    print(f"   - Filename: {retrieved_data['filename']}")
                    print(f"   - Created at: {retrieved_data['created_at']}")
                    print(f"   - Data size: {len(retrieved_data['image_data'])} bytes")
                    
                    # Verify data integrity
                    if retrieved_data['image_data'] == image_data:
                        print("✅ Data integrity verified!")
                    else:
                        print("❌ Data integrity check failed!")
                        return False
                else:
                    print("❌ Failed to retrieve lightcurve from database!")
                    return False
            else:
                print("❌ Failed to save lightcurve to database!")
                return False
        else:
            print("❌ Failed to generate lightcurve!")
            return False
            
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        return False
    
    return True

def test_api_endpoints():
    """Test API endpoints for lightcurve functionality"""
    print("\n🌐 Testing API endpoints...")
    
    base_url = "http://localhost:5002"
    test_koi = "K00752.01"
    
    try:
        # Test lightcurve generation endpoint
        print(f"📡 Testing lightcurve generation endpoint...")
        response = requests.post(f"{base_url}/api/lightcurve/generate", 
                               json={"koi_name": test_koi},
                               timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Generation endpoint successful!")
            print(f"   - Success: {data.get('success')}")
            print(f"   - Filename: {data.get('filename')}")
            print(f"   - URL: {data.get('url')}")
            
            # Test lightcurve retrieval endpoint
            print(f"📡 Testing lightcurve retrieval endpoint...")
            image_response = requests.get(f"{base_url}/api/lightcurve/{test_koi}")
            
            if image_response.status_code == 200:
                print(f"✅ Lightcurve retrieval successful!")
                print(f"   - Content-Type: {image_response.headers.get('Content-Type')}")
                print(f"   - Content-Length: {len(image_response.content)} bytes")
            else:
                print(f"❌ Lightcurve retrieval failed: {image_response.status_code}")
                return False
                
            # Test lightcurve info endpoint
            print(f"📡 Testing lightcurve info endpoint...")
            info_response = requests.get(f"{base_url}/api/lightcurve/{test_koi}/info")
            
            if info_response.status_code == 200:
                info_data = info_response.json()
                print(f"✅ Lightcurve info retrieval successful!")
                print(f"   - Candidate ID: {info_data.get('candidate_id')}")
                print(f"   - Filename: {info_data.get('filename')}")
                print(f"   - Created at: {info_data.get('created_at')}")
            else:
                print(f"❌ Lightcurve info retrieval failed: {info_response.status_code}")
                return False
                
        else:
            print(f"❌ Generation endpoint failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server. Make sure the server is running on localhost:5002")
        return False
    except Exception as e:
        print(f"❌ Error testing API endpoints: {str(e)}")
        return False
    
    return True

def main():
    """Main test function"""
    print("🚀 Starting lightcurve database storage tests...\n")
    
    # Test database functionality
    db_test_passed = test_lightcurve_generation()
    
    # Test API endpoints (only if server is running)
    api_test_passed = test_api_endpoints()
    
    print("\n" + "="*50)
    print("📋 TEST RESULTS:")
    print(f"   Database functionality: {'✅ PASSED' if db_test_passed else '❌ FAILED'}")
    print(f"   API endpoints: {'✅ PASSED' if api_test_passed else '❌ FAILED'}")
    
    if db_test_passed and api_test_passed:
        print("\n🎉 All tests passed! Lightcurve database storage is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
    
    return db_test_passed and api_test_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
