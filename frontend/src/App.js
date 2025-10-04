import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import ModelTraining from './components/ModelTraining';
import Predictions from './components/Predictions';
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // FIXME: Load initial data from backend
    // fetchTrainingHistory();
    // fetchAvailableModels();
  }, []);

  const handleModelSwitch = (modelType) => {
    setCurrentModel(modelType);
    // FIXME: Implement model switching logic
    console.log(`Switched to ${modelType} model`);
  };

  const handleFileUpload = (fileData) => {
    setUploadedFiles(prev => [...prev, fileData]);
    // FIXME: Implement file upload logic
    console.log('File uploaded:', fileData);
  };

  const handleTrainingComplete = (trainingData) => {
    setTrainingHistory(prev => [...prev, trainingData]);
    // FIXME: Implement training completion logic
    console.log('Training completed:', trainingData);
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
                  uploadedFiles={uploadedFiles}
                  trainingHistory={trainingHistory}
                />
              } 
            />
            <Route 
              path="/upload" 
              element={
                <FileUpload 
                  onFileUpload={handleFileUpload}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              } 
            />
            <Route 
              path="/training" 
              element={
                <ModelTraining 
                  onTrainingComplete={handleTrainingComplete}
                  currentModel={currentModel}
                />
              } 
            />
            <Route 
              path="/predictions" 
              element={
                <Predictions 
                  currentModel={currentModel}
                  uploadedFiles={uploadedFiles}
                />
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <Analytics 
                  trainingHistory={trainingHistory}
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
