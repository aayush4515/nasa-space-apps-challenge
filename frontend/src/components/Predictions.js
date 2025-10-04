import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import axios from 'axios';

const PredictionsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PredictionsSection = styled.div`
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

const PredictionForm = styled.div`
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

const PredictButton = styled.button`
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

const ResultsSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
`;

const ResultsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 20px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ResultCard = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const ResultValue = styled.div`
  font-size: 24px;
  font-weight: 900;
  color: ${props => props.color || '#4a9eff'};
  font-family: 'Orbitron', monospace;
  margin-bottom: 4px;
`;

const ResultLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PredictionsTable = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 20px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background: rgba(74, 158, 255, 0.1);
  padding: 12px 16px;
  font-weight: 700;
  font-size: 12px;
  color: #4a9eff;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(74, 158, 255, 0.1);
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  
  &:hover {
    background: rgba(74, 158, 255, 0.05);
  }
`;

const TableCell = styled.div`
  color: ${props => {
    if (props.type === 'exoplanet') return '#4caf50';
    if (props.type === 'false_positive') return '#f44336';
    return 'rgba(255, 255, 255, 0.8)';
  }};
  font-weight: ${props => props.bold ? '700' : '400'};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #4a9eff;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  font-size: 16px;
`;

function Predictions({ currentModel, uploadedFiles }) {
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [availableFiles, setAvailableFiles] = useState([]);

  useEffect(() => {
    // FIXME: Fetch available files from backend
    setAvailableFiles(uploadedFiles.map(file => ({
      name: file.filename || file.name,
      path: file.standardized_path || file.path
    })));
  }, [uploadedFiles]);

  const handlePrediction = async () => {
    if (!selectedFile) {
      toast.error('Please select a file for prediction');
      return;
    }

    setIsPredicting(true);

    try {
      // FIXME: Replace with actual prediction API call
      const response = await axios.post('/api/predict', {
        file_path: selectedFile,
        model_type: selectedModel
      });

      if (response.data) {
        setPredictions(response.data);
        toast.success('Predictions completed successfully!');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Prediction failed. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const getPredictionType = (prediction) => {
    return prediction === 1 ? 'exoplanet' : 'false_positive';
  };

  const getPredictionLabel = (prediction) => {
    return prediction === 1 ? 'Exoplanet' : 'False Positive';
  };

  if (isPredicting) {
    return (
      <PredictionsContainer>
        <LoadingSpinner>
          <div className="loading"></div>
          <span style={{ marginLeft: '12px' }}>Making predictions...</span>
        </LoadingSpinner>
      </PredictionsContainer>
    );
  }

  return (
    <PredictionsContainer>
      <PredictionsSection>
        <SectionTitle>Make Predictions</SectionTitle>
        <SectionSubtitle>
          Use your trained models to identify exoplanets in new datasets
        </SectionSubtitle>

        <PredictionForm>
          <FormTitle>Prediction Configuration</FormTitle>
          
          <FormGroup>
            <Label>Select Model</Label>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="pretrained">Pre-trained Model</option>
              <option value="trainable">Trainable Model</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Select Dataset</Label>
            <Select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              <option value="">Choose a dataset...</option>
              {availableFiles.map((file) => (
                <option key={file.path} value={file.path}>
                  {file.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <PredictButton
            onClick={handlePrediction}
            disabled={isPredicting || !selectedFile}
          >
            {isPredicting ? 'Predicting...' : 'Make Predictions'}
          </PredictButton>
        </PredictionForm>

        {predictions && (
          <ResultsSection>
            <ResultsTitle>Prediction Results</ResultsTitle>
            
            <ResultsGrid>
              <ResultCard>
                <ResultValue color="#4caf50">{predictions.exoplanet_count || 0}</ResultValue>
                <ResultLabel>Exoplanets Found</ResultLabel>
              </ResultCard>
              <ResultCard>
                <ResultValue color="#f44336">
                  {(predictions.predictions?.length || 0) - (predictions.exoplanet_count || 0)}
                </ResultValue>
                <ResultLabel>False Positives</ResultLabel>
              </ResultCard>
              <ResultCard>
                <ResultValue color="#4a9eff">{predictions.predictions?.length || 0}</ResultValue>
                <ResultLabel>Total Predictions</ResultLabel>
              </ResultCard>
              <ResultCard>
                <ResultValue color="#ff9800">
                  {predictions.predictions?.length > 0 
                    ? Math.round((predictions.exoplanet_count / predictions.predictions.length) * 100)
                    : 0}%
                </ResultValue>
                <ResultLabel>Exoplanet Rate</ResultLabel>
              </ResultCard>
            </ResultsGrid>

            {predictions.predictions && predictions.predictions.length > 0 && (
              <PredictionsTable>
                <TableHeader>
                  <div>Index</div>
                  <div>Prediction</div>
                  <div>Confidence</div>
                  <div>Type</div>
                </TableHeader>
                {predictions.predictions.slice(0, 10).map((prediction, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell bold>{getPredictionLabel(prediction)}</TableCell>
                    <TableCell>
                      {predictions.confidence ? 
                        `${Math.round(predictions.confidence[index] * 100)}%` : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell type={getPredictionType(prediction)}>
                      {getPredictionLabel(prediction)}
                    </TableCell>
                  </TableRow>
                ))}
                {predictions.predictions.length > 10 && (
                  <TableRow>
                    <TableCell colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                      ... and {predictions.predictions.length - 10} more predictions
                    </TableCell>
                  </TableRow>
                )}
              </PredictionsTable>
            )}
          </ResultsSection>
        )}

        {!predictions && !isPredicting && (
          <NoDataMessage>
            No predictions available. Upload a dataset and make predictions to see results.
          </NoDataMessage>
        )}
      </PredictionsSection>
    </PredictionsContainer>
  );
}

export default Predictions;
