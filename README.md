# NASA Exoplanet Detector 🚀

A comprehensive AI/ML application for detecting exoplanets using NASA space mission data. Built for the NASA Space Apps Challenge.

## 🌟 Features

- **File Upload**: Upload CSV datasets from NASA missions (Kepler, K2, TESS)
- **Model Training**: Train custom ML models with your own datasets
- **Predictions**: Use pre-trained or custom models to identify exoplanets
- **Analytics**: Comprehensive performance analysis and visualization
- **Interactive UI**: Beautiful NASA-themed interface with space aesthetics

## 🏗️ Architecture

### Backend (Flask)
- RESTful API for file handling and ML operations
- Integration with your existing `convert_data.py` script
- Model management and training endpoints
- Prediction and analytics APIs

### Frontend (React)
- Modern React application with NASA space theme
- Interactive dashboards and visualizations
- File upload with drag-and-drop
- Real-time model training progress
- Comprehensive analytics with charts

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone and setup**:
   ```bash
   git clone <your-repo-url>
   cd nasa-space-apps-challenge
   ./setup.sh
   ```

2. **Start the backend**:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python run.py
   ```

3. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
nasa-space-apps-challenge/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   ├── run.py             # Run script
│   ├── uploads/           # Uploaded files
│   └── models/            # Trained models
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Node dependencies
│   └── public/           # Static assets
├── convert_data.py        # Your existing data converter
├── Assets/               # NASA datasets
└── setup.sh             # Setup script
```

## 🔧 Configuration

### Backend Configuration
- **API Endpoints**: All endpoints are prefixed with `/api/`
- **File Upload**: Supports CSV files up to 16MB
- **Model Storage**: Models are saved in `backend/models/`
- **CORS**: Enabled for frontend communication

### Frontend Configuration
- **Theme**: NASA space theme with dark background
- **Charts**: Using Recharts for visualizations
- **Styling**: Styled-components with space aesthetics
- **Responsive**: Mobile-friendly design

## 📊 API Endpoints

### File Management
- `POST /api/upload` - Upload CSV files
- `GET /api/health` - Health check

### Model Management
- `GET /api/models` - Get available models
- `POST /api/models/switch` - Switch between models
- `POST /api/train` - Train models
- `POST /api/predict` - Make predictions

### Analytics
- `GET /api/training-history` - Get training history
- `GET /api/models/compare` - Compare model performance

## 🎯 Key Features

### 1. File Upload System
- Drag-and-drop CSV file upload
- File validation and preprocessing
- Integration with your `convert_data.py` script
- Real-time upload progress

### 2. Model Training
- Two model types: Pre-trained and Trainable
- Configurable training parameters
- Real-time training progress
- Model performance tracking

### 3. Predictions
- Use any trained model for predictions
- Batch prediction on uploaded datasets
- Confidence scores and result visualization
- Export prediction results

### 4. Analytics Dashboard
- Training accuracy over time
- Model performance comparison
- Prediction distribution charts
- Interactive visualizations

## 🔧 FIXME Items

The following items need to be implemented:

### Backend (Flask)
1. **Data Standardization**: Integrate with your existing `convert_data.py`
2. **Model Loading**: Load pre-trained models on startup
3. **Actual ML Models**: Replace placeholder models with real implementations
4. **File Management**: Implement proper file cleanup and management
5. **Error Handling**: Add comprehensive error handling and logging

### Frontend (React)
1. **API Integration**: Connect all components to actual backend APIs
2. **Real-time Updates**: Implement WebSocket connections for live updates
3. **Data Validation**: Add client-side validation for file uploads
4. **Error Boundaries**: Add React error boundaries for better UX
5. **Loading States**: Implement proper loading states throughout the app

### Integration
1. **Authentication**: Add user authentication if needed
2. **Database**: Add database for persistent storage
3. **Deployment**: Add Docker configuration for easy deployment
4. **Testing**: Add unit and integration tests

## 🎨 UI/UX Features

- **Space Theme**: Dark background with starfield animation
- **NASA Branding**: Official NASA colors and typography
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects and animations
- **Accessibility**: Keyboard navigation and screen reader support

## 📈 Performance

- **Optimized Loading**: Lazy loading for large datasets
- **Efficient Charts**: Optimized chart rendering
- **Memory Management**: Proper cleanup of resources
- **Caching**: Client-side caching for better performance

## 🚀 Deployment

### Development
```bash
# Backend
cd backend
python run.py

# Frontend
cd frontend
npm start
```

### Production
```bash
# Build frontend
cd frontend
npm run build

# Serve with backend
cd backend
python app.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the NASA Space Apps Challenge.

## 🆘 Support

For issues and questions:
1. Check the FIXME items in the code
2. Review the API documentation
3. Check the console for error messages
4. Ensure all dependencies are installed

---

**Built with ❤️ for the NASA Space Apps Challenge**
