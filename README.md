# NASA Exoplanet Detector 🚀

A comprehensive AI/ML application for detecting exoplanets using NASA Kepler mission data. Built for the NASA Space Apps Challenge with real machine learning predictions, lightcurve generation, and persistent data storage.

## 🌟 Features

- **Pre-trained XGBoost Model**: Real ML model trained on Kepler dataset with 91.17% accuracy
- **Kepler Dataset Analysis**: 9,565+ Kepler Object of Interest (KOI) candidates
- **Interactive Search**: Real-time searchable dropdown with keyboard navigation
- **Manual Prediction**: Input custom parameters for ML predictions
- **Lightcurve Generation**: Generate and visualize lightcurves using Lightkurve library
- **Persistent Storage**: SQLite database for prediction history and analytics
- **Real-time Analytics**: Comprehensive dashboard with charts and statistics
- **NASA Theme**: Beautiful space-themed interface with responsive design
- **Production Ready**: Deployed on Render with optimized performance

## 🏗️ Architecture

### Backend (Flask API)
- **8 API Endpoints**: Autocomplete, predictions, manual predictions, database operations, lightcurve generation
- **Real ML Integration**: Pre-trained XGBoost model for Kepler dataset
- **Database Storage**: SQLite for persistent prediction history and analytics
- **Lightcurve Generation**: Real-time lightcurve creation using Lightkurve library
- **Production Optimized**: Timeout protection, error handling, and performance monitoring

### Frontend (React SPA)
- **Multi-page Interface**: Dashboard, Search, Manual Prediction, Analytics, History
- **Interactive Components**: Real-time search, parameter sliders, charts
- **Database Integration**: Persistent storage with real-time updates
- **Responsive Design**: Mobile-friendly NASA-themed interface with animations
- **State Management**: Global state with local storage fallbacks

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone and setup**:
   ```bash
   git clone <your-repo-url>
   cd nasa-space-apps-challenge
   ```

2. **Setup backend**:
   ```bash
   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   cd backend
   pip install -r requirements.txt
   ```

3. **Start the backend**:
   ```bash
   cd backend
   source ../venv/bin/activate
   python app_minimal.py
   ```

4. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5002

## 📁 Project Structure

```
nasa-space-apps-challenge/
├── backend/
│   ├── app_minimal.py         # Flask API with 8 endpoints
│   ├── ml_models.py          # XGBoost model integration
│   ├── database.py           # SQLite database operations
│   ├── lightcurve_generator.py # Lightcurve generation
│   ├── simple_lightcurve.py  # Fallback lightcurve generator
│   ├── models/
│   │   └── koi_xgb.pkl       # Pre-trained XGBoost model
│   ├── lightcurves/          # Generated lightcurve images
│   ├── predictions.db        # SQLite database
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.js     # Navigation with model selector
│   │   │   ├── Dashboard.js  # Main dashboard with stats
│   │   │   ├── Search.js     # KOI search with lightcurve
│   │   │   ├── ManualPredict.js # Manual parameter input
│   │   │   ├── Analytics.js  # Charts and analytics
│   │   │   ├── History.js    # Prediction history table
│   │   │   ├── QuickActions.js # Navigation shortcuts
│   │   │   ├── ModelStatus.js # Model information
│   │   │   └── RecentActivity.js # Recent predictions
│   │   ├── services/
│   │   │   ├── PredictionService.js # API service
│   │   │   └── DatabaseService.js   # Database operations
│   │   └── App.js            # Main app with routing
│   └── package.json          # Node dependencies
├── Assets/
│   ├── clean_kepler_dataset.csv  # 9,565 Kepler candidates
│   └── sky.jpg              # Background image
├── Datasets/
│   └── kepler_options.txt   # 9,565 KOI candidate IDs
└── README.md
```

## 🔧 Configuration

### Backend Configuration
- **API Endpoints**: 8 endpoints for comprehensive functionality
- **Model Path**: `models/koi_xgb.pkl` for Kepler predictions
- **Database**: SQLite at `predictions.db` for persistence
- **Data Path**: `../Assets/` for CSV datasets
- **Lightcurves**: Generated and stored in `lightcurves/` directory
- **Port**: 5002 (to avoid macOS AirPlay conflicts)

### Frontend Configuration
- **Theme**: NASA space theme with dark background and animations
- **API Base URL**: `https://nasa-space-apps-challenge-frqb.onrender.com`
- **Search**: Real-time filtering with keyboard navigation
- **Charts**: Recharts library for analytics visualization
- **Responsive**: Mobile-friendly design with styled-components

## 📊 API Endpoints

### Core Endpoints
- `GET /api/autocomplete/kepler` - Get 9,565 KOI candidate options
- `POST /api/predict/kepler` - Make Kepler predictions with XGBoost
- `POST /api/predict/manual` - Make predictions with custom parameters

### Database Endpoints
- `GET /api/predictions` - Get all prediction history
- `GET /api/predictions/stats` - Get prediction statistics
- `POST /api/predictions/save` - Save prediction to database

### Lightcurve Endpoints
- `POST /api/lightcurve/generate` - Generate lightcurve for KOI
- `GET /api/lightcurve/<filename>` - Serve lightcurve images

### Example Usage

**Get Kepler candidates:**
```bash
curl https://nasa-space-apps-challenge-frqb.onrender.com/api/autocomplete/kepler
```

**Make Kepler prediction:**
```bash
curl -X POST https://nasa-space-apps-challenge-frqb.onrender.com/api/predict/kepler \
  -H "Content-Type: application/json" \
  -d '{"koi_name": "K00752.01"}'
```

**Generate lightcurve:**
```bash
curl -X POST https://nasa-space-apps-challenge-frqb.onrender.com/api/lightcurve/generate \
  -H "Content-Type: application/json" \
  -d '{"koi_name": "K00752.01"}'
```

## 🎯 Key Features

### 1. Real ML Predictions
- **Kepler Dataset**: Uses actual XGBoost model (`koi_xgb.pkl`) with 91.17% accuracy
- **15 Features**: KOI period, duration, depth, stellar properties, and more
- **Confidence Scores**: Real confidence values (0.0 to 1.0)
- **NASA Classification**: Shows original NASA disposition (CONFIRMED/CANDIDATE/FALSE POSITIVE)
- **Binary Classification**: Exoplanet vs non-exoplanet predictions

### 2. Interactive Search & Manual Input
- **9,565 Kepler Candidates**: All KOI names from the clean dataset
- **Real-time Filtering**: Type to search with keyboard navigation
- **Manual Parameters**: 15 sliders for custom predictions
- **Dropdown Interface**: Easy selection with scroll indicators

### 3. Lightcurve Generation
- **Real Data**: Uses Lightkurve library to fetch actual Kepler data
- **Fallback System**: Simple synthetic lightcurves when data unavailable
- **Visualization**: High-quality PNG images with proper scaling
- **Caching**: Generated lightcurves stored for quick access

### 4. Persistent Storage & Analytics
- **SQLite Database**: All predictions saved with timestamps
- **Real-time Stats**: Live analytics with charts and metrics
- **Prediction History**: Complete table of all predictions made
- **Performance Tracking**: Model accuracy and confidence trends

### 5. Production Features
- **Deployed on Render**: Live application at production URL
- **Error Handling**: Graceful fallbacks and timeout protection
- **Responsive Design**: Works on all device sizes
- **NASA Theme**: Space aesthetics with smooth animations

## 🔧 Technical Details

### ML Model Integration
- **XGBoost Model**: Pre-trained on Kepler dataset with 91.17% accuracy
- **Feature Engineering**: 15 features from Kepler data (period, duration, depth, stellar properties)
- **Prediction Pipeline**: CSV → DataFrame → Model → Confidence Score
- **Error Handling**: Graceful fallbacks for missing data and timeouts

### Data Processing
- **Kepler Data**: 9,565 candidates with 15 features each
- **Text Files**: Candidate IDs extracted for fast autocomplete
- **CSV Loading**: On-demand loading for predictions
- **Database Storage**: SQLite for persistent prediction history

### Lightcurve Generation
- **Lightkurve Library**: Fetches real Kepler data from MAST archive
- **Fallback System**: Synthetic lightcurves when data unavailable
- **Optimization**: Timeout protection and memory management
- **Caching**: Generated images stored locally and in database

### Performance
- **Fast Predictions**: < 100ms response time for ML predictions
- **Efficient Search**: Client-side filtering for instant results
- **Database Queries**: Optimized with indexes for fast retrieval
- **Production Ready**: Deployed with error handling and monitoring

## 🚀 Usage

### Making Predictions

1. **Search Existing Data**: 
   - Navigate to "Predict" → "Pre-existing Data"
   - Type to search 9,565 KOI candidates
   - Click "Predict" for ML analysis
   - Generate lightcurve visualization

2. **Manual Parameter Input**:
   - Navigate to "Predict" → "Predict Manually"
   - Adjust 15 parameter sliders
   - Click "Predict Exoplanet"
   - View custom prediction results

### Example Workflow

1. Open https://nasa-space-apps-challenge-frqb.onrender.com
2. Go to "Predict" → "Pre-existing Data"
3. Type "K00752" in the search box
4. Select "K00752.01" from filtered results
5. Click "Predict" button
6. View results: "85% confident this is an exoplanet"
7. Click "Generate Lightcurve" for visualization
8. Check "Analytics" for performance metrics

## 🎨 UI Components

### Search Interface
- **Real-time Search**: Type to filter 9,565 KOI candidates
- **Keyboard Navigation**: Arrow keys and Enter for selection
- **Predict Button**: Triggers ML prediction with loading states
- **Results Display**: Confidence score, classification, and NASA disposition
- **Lightcurve Generation**: One-click lightcurve visualization

### Manual Prediction Interface
- **15 Parameter Sliders**: Interactive controls for all features
- **Real-time Validation**: Input validation with min/max values
- **Custom Predictions**: Generate predictions with user-defined parameters

### Dashboard
- **Live Statistics**: Total predictions, model accuracy, exoplanets found
- **Recent Activity**: Latest prediction history with timestamps
- **Quick Actions**: Navigation shortcuts to all features
- **Model Status**: Real-time model information and connection status

### Analytics Dashboard
- **Interactive Charts**: Pie charts, bar charts, and line graphs
- **Confidence Distribution**: Visual breakdown of prediction confidence
- **Discovery Rate**: Percentage of exoplanets found
- **Real-time Updates**: Auto-refresh every 30 seconds

## 🔧 Development

### Backend Development
```bash
cd backend
source ../venv/bin/activate
python app_minimal.py
```

### Frontend Development
```bash
cd frontend
npm start
```

### Adding New Features
- **New Endpoints**: Add to `app_minimal.py`
- **New Components**: Add to `frontend/src/components/`
- **New Services**: Add to `frontend/src/services/`

## 📈 Performance Metrics

- **API Response Time**: < 100ms for predictions
- **Search Performance**: Instant client-side filtering
- **Memory Usage**: Minimal footprint
- **Bundle Size**: Optimized React build

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Serve with backend
cd backend
python app_minimal.py
```

### Live Application
- **Production URL**: https://nasa-space-apps-challenge-frqb.onrender.com
- **Backend API**: Deployed on Render with automatic scaling
- **Database**: SQLite database with persistent storage
- **Lightcurves**: Generated and cached for performance

### Environment Variables
- No environment variables required
- All paths are relative
- No external API keys needed
- Production-ready with error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the NASA Space Apps Challenge.

## 🆘 Support

For issues and questions:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify the backend is running on port 5002
4. Check that the ML model file exists

---

**Built with ❤️ for the NASA Space Apps Challenge**

## 🎯 Project Status

✅ **Working Features:**
- Real XGBoost predictions for Kepler dataset (91.17% accuracy)
- Interactive search with 9,565 KOI candidates
- Manual parameter input with 15 sliders
- Lightcurve generation with real Kepler data
- SQLite database for persistent storage
- Real-time analytics with interactive charts
- NASA-themed responsive interface
- Production deployment on Render

🚀 **Production Ready:**
- Live application at production URL
- Comprehensive error handling and timeouts
- Optimized performance with caching
- Real ML model integration
- Complete feature set for exoplanet detection