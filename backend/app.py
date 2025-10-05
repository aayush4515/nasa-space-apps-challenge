"""
Flask API for NASA Exoplanet Detection Challenge
Handles file uploads, model training, and predictions
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pandas as pd
import json
from datetime import datetime
import uuid
from werkzeug.utils import secure_filename
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import logging
from ml_models import predict_datapoint
# from convert_tess_dataset import clean__tess_dataset  # Not needed for current implementation

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
MODELS_FOLDER = 'models'
ALLOWED_EXTENSIONS = {'csv'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODELS_FOLDER, exist_ok=True)

# Global variables to store models and datasets
models = {
    'pretrained': None  # Fixed pre-trained model
}

# Pre-loaded datasets
datasets = {
    'kepler': None,
    'tess': None
}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def standardize_dataset(raw_csv_path):
    """
    FIXME: Integrate with your existing convert_data.py
    This function should call your data standardization API
    For now, returns a placeholder standardized dataset
    """
    try:
        # FIXME: Replace with actual call to your convert_data.py API
        # For now, we'll just return the original data with some basic preprocessing

        df = pd.read_csv(raw_csv_path)

        # Placeholder standardization - replace with your actual logic
        standardized_df = df.copy()

        # Add some basic preprocessing
        if 'label' not in standardized_df.columns:
            # FIXME: Add proper label creation logic based on your dataset
            standardized_df['label'] = np.random.randint(0, 2, len(standardized_df))  # Placeholder

        return standardized_df
    except Exception as e:
        logger.error(f"Error standardizing dataset: {str(e)}")
        raise

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    """Get available datasets"""
    return jsonify({
        'datasets': list(datasets.keys()),
        'kepler_loaded': datasets.get('kepler', False),
        'tess_loaded': datasets.get('tess', False)
    })

@app.route('/api/datasets/<dataset_name>', methods=['GET'])
def get_dataset_info(dataset_name):
    """Get information about a specific dataset"""
    if dataset_name not in datasets:
        return jsonify({'error': 'Invalid dataset name'}), 400
    
    if not datasets.get(dataset_name, False):
        return jsonify({'error': f'{dataset_name} dataset not available'}), 400
    
    # Get options count from text file
    options_file = f'../Datasets/{dataset_name}_options.txt'
    if os.path.exists(options_file):
        with open(options_file, 'r') as f:
            options = [line.strip() for line in f.readlines() if line.strip()]
        
        return jsonify({
            'name': dataset_name,
            'options_count': len(options),
            'sample_options': options[:5],
            'status': 'available'
        })
    else:
        return jsonify({'error': f'{dataset_name} options file not found'}), 400

@app.route('/api/autocomplete/<dataset_name>', methods=['GET'])
def get_autocomplete_suggestions(dataset_name):
    """Get autocomplete suggestions for a dataset from text files"""
    try:
        # Read from text files instead of CSV
        if dataset_name == 'kepler':
            options_file = '../Datasets/kepler_options.txt'
        elif dataset_name == 'tess':
            options_file = '../Datasets/tess_options.txt'
        else:
            return jsonify({'error': 'Invalid dataset name'}), 400
        
        if not os.path.exists(options_file):
            return jsonify({'error': f'{dataset_name} options file not found'}), 400
        
        # Read all options from text file
        with open(options_file, 'r') as f:
            suggestions = [line.strip() for line in f.readlines() if line.strip()]
        
        query = request.args.get('q', '').lower()
        
        # Filter suggestions based on query (if provided)
        if query:
            suggestions = [s for s in suggestions if query in s.lower()]
            # Limit to 20 suggestions for autocomplete
            suggestions = suggestions[:20]
        # If no query, return all suggestions for dropdown
        
        return jsonify({
            'suggestions': suggestions,
            'dataset': dataset_name,
            'total_count': len(suggestions)
        })
        
    except Exception as e:
        logger.error(f"Error reading {dataset_name} options: {str(e)}")
        return jsonify({'error': f'Failed to load {dataset_name} options'}), 500

@app.route('/api/search', methods=['POST'])
def search_exoplanet():
    """Search for exoplanet by ID"""
    try:
        data = request.get_json()
        exoplanet_id = data.get('exoplanet_id')
        dataset_name = data.get('dataset', 'kepler')
        
        if not exoplanet_id:
            return jsonify({'error': 'Exoplanet ID is required'}), 400
        
        # Search for exoplanet by ID in the CSV files
        if dataset_name == 'kepler':
            csv_path = '../Assets/clean_kepler_dataset.csv'
            id_column = 'kepoi_name'
        elif dataset_name == 'tess':
            csv_path = '../Assets/clean_tess_dataset.csv'
            id_column = 'toi'
        else:
            return jsonify({'error': 'Invalid dataset name'}), 400
        
        if not os.path.exists(csv_path):
            return jsonify({'error': f'{dataset_name} dataset not found'}), 400
        
        # Load the CSV file
        df = pd.read_csv(csv_path)
        
        # Search for the exoplanet ID
        mask = df[id_column].astype(str).str.contains(str(exoplanet_id), case=False, na=False)
        
        if mask.any():
            found_row = df[mask].iloc[0]
        else:
            found_row = None
        
        if found_row is None:
            return jsonify({'error': f'Exoplanet with ID {exoplanet_id} not found in {dataset_name} dataset'}), 404
        
        return jsonify({
            'exoplanet_id': exoplanet_id,
            'dataset': dataset_name,
            'data': found_row.to_dict(),
            'found': True
        })
        
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return jsonify({'error': f'Search failed: {str(e)}'}), 500

@app.route('/api/predict/kepler', methods=['POST'])
def predict_kepler():
    """Make prediction for Kepler dataset using ml_models module"""
    try:
        data = request.get_json()
        koi_name = data.get('koi_name')
        
        if not koi_name:
            return jsonify({'error': 'KOI name is required'}), 400
        
        # Load the data point from CSV
        csv_path = '../Assets/clean_kepler_dataset.csv'
        if not os.path.exists(csv_path):
            return jsonify({'error': 'Kepler dataset not found'}), 400
        
        df = pd.read_csv(csv_path)
        data_point = df[df['kepoi_name'] == koi_name]
        
        if data_point.empty:
            return jsonify({'error': f'KOI name {koi_name} not found in dataset'}), 404
        
        # Use ml_models module for prediction
        result = predict_datapoint('kepler', data_point)
        
        if result['status'] == 'success':
            return jsonify({
                'message': 'Kepler prediction completed',
                'prediction': {
                    'is_exoplanet': result['is_exoplanet'],
                    'confidence': result['confidence'],
                    'koi_name': koi_name,
                    'model_version': result['model_version']
                }
            })
        else:
            return jsonify({'error': result['message']}), 500
        
    except Exception as e:
        logger.error(f"Kepler prediction error: {str(e)}")
        return jsonify({'error': f'Kepler prediction failed: {str(e)}'}), 500

@app.route('/api/predict/tess', methods=['POST'])
def predict_tess():
    """Make prediction for TESS dataset using ml_models module"""
    try:
        data = request.get_json()
        toi_name = data.get('toi_name')
        
        if not toi_name:
            return jsonify({'error': 'TOI name is required'}), 400
        
        # Load the data point from CSV
        csv_path = '../Assets/clean_tess_dataset.csv'
        if not os.path.exists(csv_path):
            return jsonify({'error': 'TESS dataset not found'}), 400
        
        df = pd.read_csv(csv_path)
        data_point = df[df['toi'] == toi_name]
        
        if data_point.empty:
            return jsonify({'error': f'TOI name {toi_name} not found in dataset'}), 404
        
        # Use ml_models module for prediction
        result = predict_datapoint('tess', data_point)
        
        if result['status'] == 'success':
            return jsonify({
                'message': 'TESS prediction completed',
                'prediction': {
                    'is_exoplanet': result['is_exoplanet'],
                    'confidence': result['confidence'],
                    'toi_name': toi_name,
                    'model_version': result['model_version']
                }
            })
        else:
            return jsonify({'error': result['message']}), 500
        
    except Exception as e:
        logger.error(f"TESS prediction error: {str(e)}")
        return jsonify({'error': f'TESS prediction failed: {str(e)}'}), 500


def load_datasets():
    """Load pre-existing datasets on startup - using text files instead of CSV"""
    try:
        logger.info("Starting to load datasets...")
        
        # Check if text files exist
        kepler_options_path = '../Datasets/kepler_options.txt'
        tess_options_path = '../Datasets/tess_options.txt'
        
        logger.info(f"Checking Kepler options path: {kepler_options_path}")
        logger.info(f"Kepler options exist: {os.path.exists(kepler_options_path)}")
        
        logger.info(f"Checking TESS options path: {tess_options_path}")
        logger.info(f"TESS options exist: {os.path.exists(tess_options_path)}")
        
        if os.path.exists(kepler_options_path) and os.path.exists(tess_options_path):
            logger.info("✅ Dataset options files found - ready for predictions")
            datasets['kepler'] = True  # Mark as available
            datasets['tess'] = True    # Mark as available
        else:
            logger.error("❌ Dataset options files not found")
            datasets['kepler'] = False
            datasets['tess'] = False
        
        logger.info("Dataset loading completed")
        
    except Exception as e:
        logger.error(f"❌ Error loading datasets: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")

if __name__ == '__main__':
    # Load datasets on startup
    load_datasets()
    
    # FIXME: Load pre-trained model on startup
    # models['pretrained'] = joblib.load('path_to_pretrained_model.pkl')
    
    app.run(debug=True, host='0.0.0.0', port=5002)
