"""
Minimal Flask API for NASA Exoplanet Detection
Only essential endpoints - no complex routing
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os
import logging
from ml_models import predict_datapoint
from database import db
from lightcurve_generator import generate_lightcurve

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
        
        with open(options_file, 'r') as f:
            suggestions = [line.strip() for line in f.readlines() if line.strip()]
        
        return jsonify({'suggestions': suggestions})
        
    except Exception as e:
        logger.error(f"Error loading autocomplete suggestions: {str(e)}")
        return jsonify({'error': 'Failed to load suggestions'}), 500

@app.route('/api/predict/kepler', methods=['POST'])
def predict_kepler():
    """Make prediction for Kepler candidate"""
    try:
        data = request.get_json()
        koi_name = data.get('koi_name')
        
        if not koi_name:
            return jsonify({'error': 'KOI name is required'}), 400
        
        # Make prediction
        prediction_result = predict_datapoint(koi_name)
        
        if prediction_result['status'] == 'success':
            return jsonify({
                'prediction': prediction_result['prediction'],
                'nasa_classification': prediction_result.get('nasa_classification', 'UNKNOWN'),
                'message': f"Prediction completed for {koi_name}"
            })
        else:
            return jsonify({'error': prediction_result['message']}), 500
            
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

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

@app.route('/api/lightcurve/generate', methods=['POST'])
def generate_lightcurve_endpoint():
    """Generate lightcurve for a specific KOI name"""
    try:
        data = request.get_json()
        koi_name = data.get('koi_name')

        if not koi_name:
            return jsonify({'error': 'KOI name is required'}), 400

        logger.info(f"Generating lightcurve for: {koi_name}")
        
        # Generate lightcurve
        lightcurve_success, lightcurve_path = generate_lightcurve(koi_name)
        
        if lightcurve_success and lightcurve_path:
            logger.info(f"Lightcurve generated successfully: {lightcurve_path}")
            return jsonify({
                'success': True,
                'filename': os.path.basename(lightcurve_path),
                'title': f"Lightcurve for {koi_name}",
                'url': f"/api/lightcurve/{os.path.basename(lightcurve_path)}"
            })
        else:
            logger.error(f"Failed to generate lightcurve for {koi_name}")
            return jsonify({
                'success': False,
                'error': 'Failed to generate lightcurve - no data available for this candidate'
            }), 500
            
    except Exception as e:
        logger.error(f"Error generating lightcurve: {str(e)}")
        return jsonify({'error': f'Lightcurve generation failed: {str(e)}'}), 500

@app.route('/api/lightcurve/<filename>', methods=['GET'])
def get_lightcurve(filename):
    """Serve lightcurve images"""
    try:
        lightcurve_path = os.path.join('lightcurves', filename)
        
        if not os.path.exists(lightcurve_path):
            return jsonify({'error': 'Lightcurve file not found'}), 404
        
        return send_file(lightcurve_path, mimetype='image/png')
        
    except Exception as e:
        logger.error(f"Error serving lightcurve: {str(e)}")
        return jsonify({'error': 'Failed to serve lightcurve'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'NASA Exoplanet Detector API is running'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5002)))