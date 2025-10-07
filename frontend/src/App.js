import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import ManualPredict from './components/ManualPredict';
import Analytics from './components/Analytics';
import History from './components/History';
import DatabaseService from './services/DatabaseService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  background-image: url('');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
`;

const MainContent = styled.main`
  padding-top: 80px; /* Account for fixed header */
  min-height: calc(100vh - 80px);
`;

function App() {
  const [currentModel, setCurrentModel] = useState('pretrained');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load predictions from database on app start
    const loadInitialData = async () => {
      try {
        const data = await DatabaseService.loadAllData();
        setSearchResults(data.predictions);
        console.log('Loaded initial data from database:', data);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleModelSwitch = (modelType) => {
    setCurrentModel(modelType);
    // FIXME: Implement model switching logic
    console.log(`Switched to ${modelType} model`);
  };

  const handleSearchResult = async (searchData) => {
    // Update local state
    setSearchResults(prev => [...prev, searchData]);
    
    // Save to database
    try {
      const success = await DatabaseService.savePrediction(searchData);
      if (success) {
        console.log('Prediction saved to database');
      } else {
        console.error('Failed to save prediction to database');
      }
    } catch (error) {
      console.error('Error saving prediction:', error);
    }
    
    console.log('Search completed:', searchData);
  };

  return (
    <Router>
      <AppContainer>
        <Header 
          currentModel={currentModel}
          onModelSwitch={handleModelSwitch}
        />
        
        <MainContent>
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  currentModel={currentModel}
                  searchResults={searchResults}
                />
              } 
            />
            <Route 
              path="/search" 
              element={
                <Search 
                  onSearchResult={handleSearchResult}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              } 
            />
            <Route 
              path="/predict-manual" 
              element={
                <ManualPredict 
                  onSearchResult={handleSearchResult}
                />
              } 
            />
            <Route 
              path="/history" 
              element={
                <History 
                  searchResults={searchResults}
                />
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <Analytics 
                  searchResults={searchResults}
                  currentModel={currentModel}
                />
              } 
            />
          </Routes>
        </MainContent>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AppContainer>
    </Router>
  );
}

export default App;
