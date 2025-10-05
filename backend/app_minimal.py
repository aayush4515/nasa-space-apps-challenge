"""
Minimal Flask API for NASA Exoplanet Detection
Only essential endpoints - no complex routing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import logging
from ml_models import predict_datapoint

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

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
        
        # Since CSV doesn't have ID column, we'll use the first row for now
        # In a real implementation, you'd need to map KOI names to row indices
        # For now, let's use the first row as a sample
        data_point = df.iloc[[0]]  # Get first row as sample
        
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
        
        # Since CSV doesn't have ID column, we'll use the first row for now
        # In a real implementation, you'd need to map TOI names to row indices
        # For now, let's use the first row as a sample
        data_point = df.iloc[[0]]  # Get first row as sample
        
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

if __name__ == '__main__':
    print("🚀 Minimal API server starting...")
    print("📊 Only 3 endpoints: /api/autocomplete/<dataset>, /api/predict/kepler, /api/predict/tess")
    print("✨ Much simpler than the original app.py!")
    app.run(debug=True, host='0.0.0.0', port=5002)
