#!/bin/bash

# NASA Exoplanet Detector Setup Script
echo "🚀 Setting up NASA Exoplanet Detector..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/uploads
mkdir -p backend/models
mkdir -p frontend/public

# Setup Python backend
echo "🐍 Setting up Python backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup React frontend
echo "⚛️ Setting up React frontend..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo "1. Start the backend: cd backend && python run.py"
echo "2. Start the frontend: cd frontend && npm start"
echo ""
echo "The application will be available at http://localhost:3000"
