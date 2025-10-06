"""
Backup version of Flask API that works with existing production setup
This version saves lightcurves to files but serves them through API
"""

from flask import Flask, request, jsonify, send_file, Response
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
        
        # Skip first three columns (kepoi_name, koi_disposition, and kepid) and use the rest for prediction
        data_point = matching_row.drop(['kepoi_name', 'koi_disposition', 'kepid'], axis=1)
        
        # Use ml_models module for prediction
        result = predict_datapoint('kepler', data_point)
        
        if result['status'] == 'success':
            response_data = {
                'message': 'Kepler prediction completed',
                'prediction': {
                    'is_exoplanet': result['is_exoplanet'],
                    'confidence': result['confidence'],
                    'koi_name': koi_name,
                    'model_version': result['model_version']
                },
                'nasa_classification': nasa_classification
            }
            
            return jsonify(response_data)
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

@app.route('/api/lightcurve/generate', methods=['POST'])
def generate_lightcurve_endpoint():
    """Generate lightcurve for a specific KOI name - TEMPORARY FILE-BASED VERSION"""
    try:
        data = request.get_json()
        koi_name = data.get('koi_name')

        if not koi_name:
            return jsonify({'error': 'KOI name is required'}), 400

        # Create lightcurves directory if it doesn't exist
        lightcurves_dir = 'lightcurves'
        os.makedirs(lightcurves_dir, exist_ok=True)

        # Check if lightcurve already exists
        filename = f"{koi_name.replace('.', '_')}.png"
        file_path = os.path.join(lightcurves_dir, filename)
        
        if os.path.exists(file_path):
            return jsonify({
                'success': True,
                'message': 'Lightcurve already exists',
                'filename': filename,
                'title': f"Lightcurve for {koi_name}",
                'url': f"/api/lightcurve/{filename}"
            })

        # Generate lightcurve using the old method (save to file)
        try:
            # Import the old lightcurve generator
            from lightcurve_generator import lightcurve_generator
            
            # Get kepid
            kepid = lightcurve_generator.get_kepid_from_kepoi_name(koi_name)
            if kepid is None:
                return jsonify({'error': f'Could not find kepid for {koi_name}'}), 400
            
            # Generate using the old method
            success, image_data, filename, kepid = generate_lightcurve(koi_name)
            
            if success and image_data:
                # Save to file (temporary solution)
                with open(file_path, 'wb') as f:
                    f.write(image_data)
                
                return jsonify({
                    'success': True,
                    'filename': filename,
                    'title': f"Lightcurve for {koi_name}",
                    'url': f"/api/lightcurve/{filename}"
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to generate lightcurve'
                }), 500
                
        except Exception as e:
            logger.error(f"Error in lightcurve generation: {str(e)}")
            return jsonify({
                'success': False,
                'error': f'Lightcurve generation failed: {str(e)}'
            }), 500
            
    except Exception as e:
        logger.error(f"Error generating lightcurve: {str(e)}")
        return jsonify({'error': f'Lightcurve generation failed: {str(e)}'}), 500

@app.route('/api/lightcurve/<filename>', methods=['GET'])
def get_lightcurve(filename):
    """Serve lightcurve images from files"""
    try:
        lightcurve_path = os.path.join('lightcurves', filename)
        if os.path.exists(lightcurve_path):
            return send_file(lightcurve_path, mimetype='image/png')
        else:
            return jsonify({'error': 'Lightcurve not found'}), 404
    except Exception as e:
        logger.error(f"Error serving lightcurve {filename}: {str(e)}")
        return jsonify({'error': 'Failed to serve lightcurve'}), 500

if __name__ == '__main__':
    print("🚀 Kepler Exoplanet Detection API starting...")
    print("📊 Endpoints: /api/autocomplete/kepler, /api/predict/kepler")
    print("💾 Database endpoints: /api/predictions, /api/predictions/stats, /api/predictions/save")
    print("✨ Kepler-only mode with database persistence enabled!")
    app.run(debug=True, host='0.0.0.0', port=5002)
