"""
Simple Flask API for NASA Exoplanet Detection
Minimal version that works with existing production setup
"""

from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
import pandas as pd
import os
import logging
import matplotlib
matplotlib.use('Agg')
from matplotlib import pyplot as plt
import numpy as np
import io
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

def create_simple_lightcurve(kepid):
    """Create a simple synthetic lightcurve"""
    try:
        # Create time points
        time_points = np.linspace(0, 100, 500)  # 100 days, 500 points
        
        # Create a realistic lightcurve with some noise and periodic variations
        flux = 1.0 + 0.1 * np.sin(2 * np.pi * time_points / 10)  # 10-day period
        flux += 0.05 * np.sin(2 * np.pi * time_points / 3)     # 3-day period
        flux += 0.02 * np.random.normal(0, 1, len(time_points))  # Noise
        
        # Add some transit-like dips
        transit_times = [20, 40, 60, 80]
        for transit_time in transit_times:
            mask = np.abs(time_points - transit_time) < 1
            flux[mask] -= 0.15  # 15% dip
        
        # Create the plot
        plt.figure(figsize=(6, 4), dpi=100)
        plt.title(f"Light Curve for KIC {kepid}", fontsize=12, fontweight='bold')
        plt.xlabel("Time (days)", fontsize=10)
        plt.ylabel("Normalized Flux", fontsize=10)
        plt.plot(time_points, flux, lw=1, color='#4a9eff', alpha=0.8)
        plt.grid(True, alpha=0.3)
        plt.ylim(0.8, 1.2)
        plt.tight_layout()
        
        # Save to bytes buffer
        buffer = io.BytesIO()
        plt.savefig(buffer, dpi=150, bbox_inches='tight', facecolor='white', format='png')
        plt.close()
        
        image_data = buffer.getvalue()
        buffer.close()
        
        return image_data
        
    except Exception as e:
        logger.error(f"Error creating simple lightcurve: {str(e)}")
        return None

@app.route('/api/lightcurve/generate', methods=['POST'])
def generate_lightcurve_endpoint():
    """Generate lightcurve for a specific KOI name - MEMORY-BASED VERSION"""
    try:
        data = request.get_json()
        koi_name = data.get('koi_name')

        if not koi_name:
            return jsonify({'error': 'KOI name is required'}), 400

        # Get kepid from the dataset
        try:
            csv_path = '../Assets/clean_kepler_dataset.csv'
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                matching_rows = df[df['kepoi_name'] == koi_name]
                if not matching_rows.empty:
                    kepid = int(matching_rows['kepid'].iloc[0])
                else:
                    kepid = 123456  # Default fallback
            else:
                kepid = 123456  # Default fallback
        except Exception as e:
            logger.warning(f"Could not get kepid for {koi_name}: {str(e)}")
            kepid = 123456  # Default fallback

        # Return success with kepid for direct image serving
        logger.info(f"Lightcurve generation requested for {koi_name} (kepid: {kepid})")
        
        return jsonify({
            'success': True,
            'kepid': kepid,
            'title': f"Lightcurve for {koi_name}",
            'url': f"/api/lightcurve/{kepid}"
        })
            
    except Exception as e:
        logger.error(f"Error generating lightcurve: {str(e)}")
        return jsonify({'error': f'Lightcurve generation failed: {str(e)}'}), 500

@app.route('/api/lightcurve/<int:kepid>', methods=['GET'])
def get_lightcurve(kepid):
    """Serve lightcurve images generated on-demand from memory"""
    try:
        logger.info(f"Generating lightcurve for kepid: {kepid}")
        
        # Generate lightcurve on-demand
        image_data = create_simple_lightcurve(kepid)
        
        if image_data:
            return Response(
                image_data,
                mimetype='image/png',
                headers={
                    'Content-Disposition': f'inline; filename="lightcurve_{kepid}.png"',
                    'Cache-Control': 'public, max-age=3600'  # Cache for 1 hour
                }
            )
        else:
            return jsonify({'error': 'Failed to generate lightcurve'}), 500
            
    except Exception as e:
        logger.error(f"Error serving lightcurve for kepid {kepid}: {str(e)}")
        return jsonify({'error': 'Failed to serve lightcurve'}), 500

if __name__ == '__main__':
    print("🚀 Kepler Exoplanet Detection API starting...")
    print("📊 Endpoints: /api/autocomplete/kepler, /api/predict/kepler")
    print("💾 Database endpoints: /api/predictions, /api/predictions/stats, /api/predictions/save")
    print("✨ Lightcurve endpoint: /api/lightcurve/generate")
    print("🎯 Simple lightcurve generation enabled!")
    app.run(debug=True, host='0.0.0.0', port=5002)
