#!/usr/bin/env python3
"""
Run script for the Flask backend
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # FIXME: Set up proper environment configuration
    # Create necessary directories
    os.makedirs('uploads', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5002)
