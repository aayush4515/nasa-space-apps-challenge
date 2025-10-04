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

# Global variables to store models and training history
models = {
    'pretrained': None,  # Fixed pre-trained model
    'trainable': None    # Model that can be trained from frontend
}

training_history = []

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

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle CSV file upload"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to make filename unique
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"
            
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Standardize the dataset
            try:
                standardized_df = standardize_dataset(filepath)
                standardized_path = filepath.replace('.csv', '_standardized.csv')
                standardized_df.to_csv(standardized_path, index=False)
                
                return jsonify({
                    'message': 'File uploaded and standardized successfully',
                    'filename': filename,
                    'standardized_path': standardized_path,
                    'rows': len(standardized_df),
                    'columns': list(standardized_df.columns)
                })
            except Exception as e:
                return jsonify({'error': f'Error standardizing dataset: {str(e)}'}), 500
        else:
            return jsonify({'error': 'Invalid file type. Only CSV files are allowed'}), 400
            
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return jsonify({'error': 'Upload failed'}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get available models"""
    return jsonify({
        'models': list(models.keys()),
        'pretrained_available': models['pretrained'] is not None,
        'trainable_available': models['trainable'] is not None
    })

@app.route('/api/models/switch', methods=['POST'])
def switch_model():
    """Switch between models"""
    try:
        data = request.get_json()
        model_type = data.get('model_type')
        
        if model_type not in models:
            return jsonify({'error': 'Invalid model type'}), 400
        
        # FIXME: Implement actual model switching logic
        return jsonify({
            'message': f'Switched to {model_type} model',
            'current_model': model_type
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train_model():
    """Train the trainable model with uploaded data"""
    try:
        data = request.get_json()
        file_path = data.get('file_path')
        model_name = data.get('model_name', 'trainable')
        
        if not file_path:
            return jsonify({'error': 'No file path provided'}), 400
        
        # Load and prepare data
        df = pd.read_csv(file_path)
        
        # FIXME: Add proper feature selection and preprocessing
        # For now, using placeholder features
        feature_columns = [col for col in df.columns if col != 'label']
        X = df[feature_columns].fillna(0)  # Simple fill for missing values
        y = df['label'] if 'label' in df.columns else np.random.randint(0, 2, len(df))
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        # FIXME: Replace with your actual ML model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Save model
        model_path = os.path.join(MODELS_FOLDER, f'{model_name}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pkl')
        joblib.dump(model, model_path)
        
        # Store model and training history
        models[model_name] = model
        training_record = {
            'timestamp': datetime.now().isoformat(),
            'model_name': model_name,
            'accuracy': accuracy,
            'training_samples': len(X_train),
            'test_samples': len(X_test),
            'features': len(feature_columns)
        }
        training_history.append(training_record)
        
        return jsonify({
            'message': 'Model trained successfully',
            'accuracy': accuracy,
            'training_record': training_record
        })
        
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        return jsonify({'error': f'Training failed: {str(e)}'}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make predictions using the current model"""
    try:
        data = request.get_json()
        file_path = data.get('file_path')
        model_type = data.get('model_type', 'pretrained')
        
        if not file_path:
            return jsonify({'error': 'No file path provided'}), 400
        
        if models[model_type] is None:
            return jsonify({'error': f'{model_type} model not available'}), 400
        
        # Load data
        df = pd.read_csv(file_path)
        feature_columns = [col for col in df.columns if col != 'label']
        X = df[feature_columns].fillna(0)
        
        # Make predictions
        predictions = models[model_type].predict(X)
        probabilities = models[model_type].predict_proba(X) if hasattr(models[model_type], 'predict_proba') else None
        
        # Add predictions to dataframe
        df['prediction'] = predictions
        if probabilities is not None:
            df['confidence'] = np.max(probabilities, axis=1)
        
        # Save results
        results_path = os.path.join(UPLOAD_FOLDER, f'predictions_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv')
        df.to_csv(results_path, index=False)
        
        return jsonify({
            'message': 'Predictions completed',
            'predictions': predictions.tolist(),
            'results_path': results_path,
            'exoplanet_count': int(np.sum(predictions))
        })
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/training-history', methods=['GET'])
def get_training_history():
    """Get training history for visualization"""
    return jsonify({
        'history': training_history,
        'total_training_runs': len(training_history)
    })

@app.route('/api/models/compare', methods=['GET'])
def compare_models():
    """Compare model performance"""
    try:
        # FIXME: Implement actual model comparison logic
        comparison_data = {
            'models': ['pretrained', 'trainable'],
            'accuracies': [0.85, 0.78],  # Placeholder data
            'training_samples': [1000, 500],
            'last_updated': [datetime.now().isoformat(), datetime.now().isoformat()]
        }
        
        return jsonify(comparison_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # FIXME: Load pre-trained model on startup
    # models['pretrained'] = joblib.load('path_to_pretrained_model.pkl')
    
    app.run(debug=True, host='0.0.0.0', port=5001)
