import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import Analytics from './components/Analytics';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
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
    // FIXME: Load initial data from backend
    // fetchSearchHistory();
  }, []);

  const handleModelSwitch = (modelType) => {
    setCurrentModel(modelType);
    // FIXME: Implement model switching logic
    console.log(`Switched to ${modelType} model`);
  };

  const handleSearchResult = (searchData) => {
    setSearchResults(prev => [...prev, searchData]);
    // FIXME: Implement search result handling logic
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
