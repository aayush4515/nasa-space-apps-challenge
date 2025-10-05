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
from database import db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/autocomplete/kepler', methods=['GET'])
def get_autocomplete_suggestions():
    """Get autocomplete suggestions for Kepler dataset from text files"""
    try:
        options_file = '../Datasets/kepler_options.txt'
        
        if not os.path.exists(options_file):
            return jsonify({'error': 'Kepler options file not found'}), 400
        
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
            'dataset': 'kepler',
            'total_count': len(suggestions)
        })
        
    except Exception as e:
        logger.error(f"Error reading Kepler options: {str(e)}")
        return jsonify({'error': 'Failed to load Kepler options'}), 500

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
        
        # Find the specific row with the matching kepoi_name
        matching_rows = df[df['kepoi_name'] == koi_name]
        
        if matching_rows.empty:
            return jsonify({'error': f'KOI name {koi_name} not found in dataset'}), 404
        
        # Get the first matching row
        matching_row = matching_rows.iloc[[0]]
        
        # Extract NASA classification
        nasa_classification = matching_row['koi_disposition'].iloc[0]
        
        # Skip first two columns (kepoi_name and koi_disposition) and use the rest for prediction
        data_point = matching_row.drop(['kepoi_name', 'koi_disposition'], axis=1)
        
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
                },
                'nasa_classification': nasa_classification
            })
        else:
            return jsonify({'error': result['message']}), 500
        
    except Exception as e:
        logger.error(f"Kepler prediction error: {str(e)}")
        return jsonify({'error': f'Kepler prediction failed: {str(e)}'}), 500


@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """Get all predictions from database"""
    try:
        predictions = db.get_all_predictions()
        return jsonify({
            'predictions': predictions,
            'count': len(predictions)
        })
    except Exception as e:
        logger.error(f"Error getting predictions: {str(e)}")
        return jsonify({'error': 'Failed to get predictions'}), 500

@app.route('/api/predictions/stats', methods=['GET'])
def get_prediction_stats():
    """Get prediction statistics"""
    try:
        stats = db.get_prediction_stats()
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        return jsonify({'error': 'Failed to get stats'}), 500

@app.route('/api/predictions/save', methods=['POST'])
def save_prediction():
    """Save a prediction to database"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['exoplanet_id', 'dataset', 'prediction', 'timestamp']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Save to database
        success = db.save_prediction(data)
        
        if success:
            return jsonify({'message': 'Prediction saved successfully'})
        else:
            return jsonify({'error': 'Failed to save prediction'}), 500
            
    except Exception as e:
        logger.error(f"Error saving prediction: {str(e)}")
        return jsonify({'error': 'Failed to save prediction'}), 500

if __name__ == '__main__':
    print("🚀 Kepler Exoplanet Detection API starting...")
    print("📊 Endpoints: /api/autocomplete/kepler, /api/predict/kepler")
    print("💾 Database endpoints: /api/predictions, /api/predictions/stats, /api/predictions/save")
    print("✨ Kepler-only mode with database persistence enabled!")
    app.run(debug=True, host='0.0.0.0', port=5002)
