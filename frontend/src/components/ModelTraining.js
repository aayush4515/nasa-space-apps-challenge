import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import axios from 'axios';

const TrainingContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const TrainingSection = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
`;

const SectionTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
  text-align: center;
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 40px;
  font-family: 'Space Mono', monospace;
`;

const ModelSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ModelCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.selected ? 'rgba(74, 158, 255, 0.6)' : 'rgba(74, 158, 255, 0.3)'};
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: rgba(74, 158, 255, 0.6);
    background: rgba(0, 0, 0, 0.5);
  }
  
  ${props => props.selected && `
    border-color: #4a9eff;
    background: rgba(74, 158, 255, 0.1);
    box-shadow: 0 0 20px rgba(74, 158, 255, 0.3);
  `}
`;

const ModelIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
`;

const ModelName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
  text-align: center;
`;

const ModelDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
  text-align: center;
  line-height: 1.5;
`;

const ModelStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Space Mono', monospace;
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch(props.status) {
      case 'ready': return '#4caf50';
      case 'training': return '#ff9800';
      case 'error': return '#f44336';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  animation: ${props => props.status === 'training' ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const TrainingForm = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const FormTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-family: 'Space Mono', monospace;
  transition: all 0.3s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #4a9eff;
    box-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Select = styled.select`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-family: 'Space Mono', monospace;
  transition: all 0.3s ease;
  width: 100%;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4a9eff;
    box-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
  }
  
  option {
    background: #1a1a2e;
    color: white;
  }
`;

const TrainingButton = styled.button`
  background: linear-gradient(45deg, #4a9eff, #6bb6ff);
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  color: white;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(74, 158, 255, 0.3);
  width: 100%;
  font-size: 16px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 158, 255, 0.4);
    background: linear-gradient(45deg, #6bb6ff, #4a9eff);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4a9eff, #6bb6ff);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const ProgressText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
  text-align: center;
`;

function ModelTraining({ onTrainingComplete, currentModel }) {
  const [selectedModel, setSelectedModel] = useState('trainable');
  const [trainingData, setTrainingData] = useState({
    filePath: '',
    modelName: 'trainable',
    epochs: 100,
    batchSize: 32,
    learningRate: 0.001
  });
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [availableFiles, setAvailableFiles] = useState([]);

  useEffect(() => {
    // FIXME: Fetch available files from backend
    const fetchFiles = async () => {
      try {
        // const response = await axios.get('/api/files');
        // setAvailableFiles(response.data);
        setAvailableFiles([
          { name: 'kepler_data.csv', path: '/uploads/kepler_data.csv' },
          { name: 'tess_data.csv', path: '/uploads/tess_data.csv' }
        ]); // Placeholder data
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleModelSelect = (modelType) => {
    setSelectedModel(modelType);
  };

  const handleTrainingStart = async () => {
    if (!trainingData.filePath) {
      toast.error('Please select a training file');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    try {
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsTraining(false);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // FIXME: Replace with actual training API call
      const response = await axios.post('/api/train', {
        file_path: trainingData.filePath,
        model_name: trainingData.modelName,
        epochs: trainingData.epochs,
        batch_size: trainingData.batchSize,
        learning_rate: trainingData.learningRate
      });

      if (response.data) {
        toast.success('Model training completed successfully!');
        onTrainingComplete(response.data);
      }
    } catch (error) {
      console.error('Training error:', error);
      toast.error('Training failed. Please try again.');
      setIsTraining(false);
      setTrainingProgress(0);
    }
  };

  const models = [
    {
      id: 'pretrained',
      name: 'Pre-trained Model',
      description: 'Fixed model trained on NASA datasets. Used for testing and validation.',
      icon: '🎯',
      status: 'ready'
    },
    {
      id: 'trainable',
      name: 'Trainable Model',
      description: 'Customizable model that can be trained with your own datasets.',
      icon: '🧠',
      status: isTraining ? 'training' : 'ready'
    }
  ];

  return (
    <TrainingContainer>
      <TrainingSection>
        <SectionTitle>Model Training</SectionTitle>
        <SectionSubtitle>
          Train and configure your machine learning models for exoplanet detection
        </SectionSubtitle>

        <ModelSelector>
          {models.map((model) => (
            <ModelCard
              key={model.id}
              selected={selectedModel === model.id}
              onClick={() => handleModelSelect(model.id)}
            >
              <ModelIcon>{model.icon}</ModelIcon>
              <ModelName>{model.name}</ModelName>
              <ModelDescription>{model.description}</ModelDescription>
              <ModelStatus>
                <StatusIndicator status={model.status} />
                {model.status.toUpperCase()}
              </ModelStatus>
            </ModelCard>
          ))}
        </ModelSelector>

        {selectedModel === 'trainable' && (
          <TrainingForm>
            <FormTitle>Training Configuration</FormTitle>
            
            <FormGroup>
              <Label>Training Dataset</Label>
              <Select
                value={trainingData.filePath}
                onChange={(e) => setTrainingData(prev => ({ ...prev, filePath: e.target.value }))}
              >
                <option value="">Select a dataset...</option>
                {availableFiles.map((file) => (
                  <option key={file.path} value={file.path}>
                    {file.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Model Name</Label>
              <Input
                type="text"
                value={trainingData.modelName}
                onChange={(e) => setTrainingData(prev => ({ ...prev, modelName: e.target.value }))}
                placeholder="Enter model name"
              />
            </FormGroup>

            <FormGroup>
              <Label>Epochs</Label>
              <Input
                type="number"
                value={trainingData.epochs}
                onChange={(e) => setTrainingData(prev => ({ ...prev, epochs: parseInt(e.target.value) }))}
                min="1"
                max="1000"
              />
            </FormGroup>

            <FormGroup>
              <Label>Batch Size</Label>
              <Input
                type="number"
                value={trainingData.batchSize}
                onChange={(e) => setTrainingData(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                min="1"
                max="128"
              />
            </FormGroup>

            <FormGroup>
              <Label>Learning Rate</Label>
              <Input
                type="number"
                step="0.0001"
                value={trainingData.learningRate}
                onChange={(e) => setTrainingData(prev => ({ ...prev, learningRate: parseFloat(e.target.value) }))}
                min="0.0001"
                max="1"
              />
            </FormGroup>

            <TrainingButton
              onClick={handleTrainingStart}
              disabled={isTraining || !trainingData.filePath}
            >
              {isTraining ? 'Training...' : 'Start Training'}
            </TrainingButton>

            {isTraining && (
              <ProgressSection>
                <ProgressBar>
                  <ProgressFill progress={trainingProgress} />
                </ProgressBar>
                <ProgressText>
                  Training Progress: {Math.round(trainingProgress)}%
                </ProgressText>
              </ProgressSection>
            )}
          </TrainingForm>
        )}
      </TrainingSection>
    </TrainingContainer>
  );
}

export default ModelTraining;
