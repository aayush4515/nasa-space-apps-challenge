"""
Database models and connection for NASA Exoplanet Detector
Uses SQLite for persistent storage of predictions
"""

import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self, db_path: str = "predictions.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Create predictions table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS predictions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        candidate_id TEXT NOT NULL,
                        dataset TEXT NOT NULL,
                        confidence REAL NOT NULL,
                        is_exoplanet BOOLEAN NOT NULL,
                        model_version TEXT NOT NULL,
                        timestamp DATETIME NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                # Create index for faster queries
                cursor.execute('''
                    CREATE INDEX IF NOT EXISTS idx_candidate_id 
                    ON predictions(candidate_id)
                ''')
                
                cursor.execute('''
                    CREATE INDEX IF NOT EXISTS idx_dataset 
                    ON predictions(dataset)
                ''')
                
                cursor.execute('''
                    CREATE INDEX IF NOT EXISTS idx_timestamp 
                    ON predictions(timestamp)
                ''')
                
                conn.commit()
                logger.info("Database initialized successfully")
                
        except Exception as e:
            logger.error(f"Error initializing database: {str(e)}")
            raise
    
    def save_prediction(self, prediction_data: Dict[str, Any]) -> bool:
        """Save a prediction to the database"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute('''
                    INSERT INTO predictions 
                    (candidate_id, dataset, confidence, is_exoplanet, model_version, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    prediction_data['exoplanet_id'],
                    prediction_data['dataset'],
                    prediction_data['prediction']['confidence'],
                    prediction_data['prediction']['is_exoplanet'],
                    prediction_data['prediction']['model_version'],
                    prediction_data['timestamp']
                ))
                
                conn.commit()
                logger.info(f"Prediction saved for {prediction_data['exoplanet_id']}")
                return True
                
        except Exception as e:
            logger.error(f"Error saving prediction: {str(e)}")
            return False
    
    def get_all_predictions(self) -> List[Dict[str, Any]]:
        """Get all predictions from the database"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute('''
                    SELECT candidate_id, dataset, confidence, is_exoplanet, 
                           model_version, timestamp, created_at
                    FROM predictions 
                    ORDER BY timestamp DESC
                ''')
                
                rows = cursor.fetchall()
                predictions = []
                
                for row in rows:
                    predictions.append({
                        'exoplanet_id': row[0],
                        'dataset': row[1],
                        'timestamp': row[5],
                        'prediction': {
                            'confidence': row[2],
                            'is_exoplanet': bool(row[3]),
                            'model_version': row[4]
                        }
                    })
                
                logger.info(f"Retrieved {len(predictions)} predictions from database")
                return predictions
                
        except Exception as e:
            logger.error(f"Error retrieving predictions: {str(e)}")
            return []
    
    def get_predictions_by_dataset(self, dataset: str) -> List[Dict[str, Any]]:
        """Get predictions filtered by dataset"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                cursor.execute('''
                    SELECT candidate_id, dataset, confidence, is_exoplanet, 
                           model_version, timestamp, created_at
                    FROM predictions 
                    WHERE dataset = ?
                    ORDER BY timestamp DESC
                ''', (dataset,))
                
                rows = cursor.fetchall()
                predictions = []
                
                for row in rows:
                    predictions.append({
                        'exoplanet_id': row[0],
                        'dataset': row[1],
                        'timestamp': row[5],
                        'prediction': {
                            'confidence': row[2],
                            'is_exoplanet': bool(row[3]),
                            'model_version': row[4]
                        }
                    })
                
                return predictions
                
        except Exception as e:
            logger.error(f"Error retrieving predictions for dataset {dataset}: {str(e)}")
            return []
    
    def get_prediction_stats(self) -> Dict[str, Any]:
        """Get statistics about predictions"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Total predictions
                cursor.execute('SELECT COUNT(*) FROM predictions')
                total_predictions = cursor.fetchone()[0]
                
                # Exoplanets found
                cursor.execute('SELECT COUNT(*) FROM predictions WHERE is_exoplanet = 1')
                exoplanets_found = cursor.fetchone()[0]
                
                # Average confidence
                cursor.execute('SELECT AVG(confidence) FROM predictions')
                avg_confidence = cursor.fetchone()[0] or 0
                
                # Dataset breakdown
                cursor.execute('''
                    SELECT dataset, COUNT(*) 
                    FROM predictions 
                    GROUP BY dataset
                ''')
                dataset_breakdown = dict(cursor.fetchall())
                
                return {
                    'total_predictions': total_predictions,
                    'exoplanets_found': exoplanets_found,
                    'average_confidence': round(avg_confidence, 2),
                    'dataset_breakdown': dataset_breakdown,
                    'success_rate': round((exoplanets_found / total_predictions * 100), 2) if total_predictions > 0 else 0
                }
                
        except Exception as e:
            logger.error(f"Error getting prediction stats: {str(e)}")
            return {
                'total_predictions': 0,
                'exoplanets_found': 0,
                'average_confidence': 0,
                'dataset_breakdown': {},
                'success_rate': 0
            }
    
    def clear_all_predictions(self) -> bool:
        """Clear all predictions from the database"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('DELETE FROM predictions')
                conn.commit()
                logger.info("All predictions cleared from database")
                return True
                
        except Exception as e:
            logger.error(f"Error clearing predictions: {str(e)}")
            return False

# Global database instance
db = Database()
