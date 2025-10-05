import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModelInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
`;

const ModelName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
`;

const ModelAccuracy = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #4caf50;
  font-family: 'Orbitron', monospace;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.5);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Space Mono', monospace;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf50;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const LastTraining = styled.div`
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
`;

const LastTrainingTitle = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const LastTrainingInfo = styled.div`
  font-size: 14px;
  color: white;
  font-family: 'Space Mono', monospace;
`;

function ModelStatus({ currentModel, accuracy, lastSearch }) {
  const getModelDisplayName = (model) => {
    switch (model) {
      case 'pretrained': return 'Pre-trained Model';
      default: return 'Unknown Model';
    }
  };

  return (
    <StatusContainer>
      <ModelInfo>
        <ModelName>{getModelDisplayName(currentModel)}</ModelName>
        <ModelAccuracy>{(accuracy * 100).toFixed(1)}%</ModelAccuracy>
      </ModelInfo>
      
      <StatusIndicator>
        <StatusDot />
        ACTIVE
      </StatusIndicator>
      
      {lastSearch && (
        <LastTraining>
          <LastTrainingTitle>Last Search</LastTrainingTitle>
          <LastTrainingInfo>
            {new Date(lastSearch.timestamp).toLocaleDateString()} - Found exoplanet {lastSearch.exoplanet_id}
          </LastTrainingInfo>
        </LastTraining>
      )}
    </StatusContainer>
  );
}

export default ModelStatus;
