import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const ManualPredictContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Section = styled.div`
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

const ParametersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ParameterCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(74, 158, 255, 0.6);
    box-shadow: 0 8px 25px rgba(74, 158, 255, 0.2);
  }
`;

const ParameterLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SliderContainer = styled.div`
  margin-bottom: 16px;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(74, 158, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #4a9eff, #6bb6ff);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(74, 158, 255, 0.4);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(74, 158, 255, 0.6);
    }
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #4a9eff, #6bb6ff);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(74, 158, 255, 0.4);
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NumberInput = styled.input`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: ${props => props.isEmpty ? 'rgba(255, 255, 255, 0.4)' : 'white'};
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  width: 120px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4a9eff;
    box-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
    color: white;
  }
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const ValueDisplay = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  min-width: 60px;
  text-align: right;
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
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
  
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

const PredictionCard = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(74, 158, 255, 0.6);
    box-shadow: 0 8px 25px rgba(74, 158, 255, 0.2);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #4a9eff;
  font-family: 'Space Mono', monospace;
`;

// Feature definitions with their max values
const FEATURES = {
  koi_period: { max: 2000, label: 'KOI Period (days)' },
  koi_time0bk: { max: 2000, label: 'KOI Time0 BK (days)' },
  koi_duration: { max: 200, label: 'KOI Duration (hours)' },
  koi_depth: { max: 2000000, label: 'KOI Depth (ppm)' },
  koi_max_sngle_ev: { max: 30000, label: 'KOI Max Single Event' },
  koi_max_mult_ev: { max: 200000, label: 'KOI Max Multiple Event' },
  koi_num_transits: { max: 3000, label: 'KOI Number of Transits' },
  koi_steff: { max: 20000, label: 'KOI Stellar Effective Temperature (K)' },
  koi_slogg: { max: 6, label: 'KOI Stellar Log G (cm/s²)' },
  koi_smet: { max: 0.6, label: 'KOI Stellar Metallicity' },
  koi_srad: { max: 300, label: 'KOI Stellar Radius (R☉)' },
  koi_smass: { max: 4, label: 'KOI Stellar Mass (M☉)' },
  ra: { max: 400, label: 'Right Ascension (degrees)' },
  dec: { max: 60, label: 'Declination (degrees)' },
  koi_kepmag: { max: 20, label: 'KOI Kepler Magnitude' }
};

function ManualPredict({ onSearchResult }) {
  const [parameters, setParameters] = useState(
    Object.keys(FEATURES).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {})
  );
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleParameterChange = (key, value) => {
    // Allow empty string for deletion
    if (value === '') {
      setParameters(prev => ({
        ...prev,
        [key]: 0
      }));
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= FEATURES[key].max) {
      setParameters(prev => ({
        ...prev,
        [key]: numValue
      }));
    }
  };

  const handleSliderChange = (key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }));
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    setPredictionResult(null);

    try {
      // Call the manual prediction API
      const response = await fetch('https://nasa-space-apps-challenge-frqb.onrender.com/api/predict/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parameters: parameters
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      
      if (data.prediction) {
        const result = {
          exoplanet_id: 'Manual Input',
          dataset: 'manual',
          timestamp: new Date().toISOString(),
          prediction: {
            confidence: Math.round(data.prediction.confidence * 10000) / 100,
            score: data.prediction.confidence,
            is_exoplanet: data.prediction.is_exoplanet,
            model_version: data.prediction.model_version
          },
          parameters: parameters
        };
        
        setPredictionResult(result);
        
        // Call the parent component to update global state
        if (onSearchResult) {
          onSearchResult(result);
        }
        
        const statusText = data.prediction.is_exoplanet ? 'is an exoplanet' : 'is not an exoplanet';
        const confidencePercentage = Math.round(data.prediction.confidence * 10000) / 100;
        toast.success(`Prediction complete! ${confidencePercentage}% confident that the input ${statusText}.`);
      } else {
        throw new Error('Invalid response from prediction API');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error(`Prediction failed: ${error.message}`);
      setPredictionResult(null);
    } finally {
      setIsPredicting(false);
    }
  };

  if (isPredicting) {
    return (
      <ManualPredictContainer>
        <LoadingSpinner>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            border: '2px solid #4a9eff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '12px'
          }}></div>
          Predicting...
        </LoadingSpinner>
      </ManualPredictContainer>
    );
  }

  return (
    <ManualPredictContainer>
      <Section>
        <SectionTitle>Manual Exoplanet Prediction</SectionTitle>
        <SectionSubtitle>
          Enter the 15 key parameters manually to get ML predictions for exoplanet detection.
          Use sliders or text inputs to set the values.
        </SectionSubtitle>

        <ParametersGrid>
          {Object.entries(FEATURES).map(([key, config]) => (
            <ParameterCard key={key}>
              <ParameterLabel>{config.label}</ParameterLabel>
              
              <SliderContainer>
                <Slider
                  type="range"
                  min="0"
                  max={config.max}
                  step={config.max > 100 ? "1" : "0.01"}
                  value={parameters[key]}
                  onChange={(e) => handleSliderChange(key, e.target.value)}
                />
              </SliderContainer>
              
              <InputContainer>
                <NumberInput
                  type="number"
                  min="0"
                  max={config.max}
                  step={config.max > 100 ? "1" : "0.01"}
                  value={parameters[key] === 0 ? '0' : parameters[key]}
                  isEmpty={parameters[key] === 0}
                  onChange={(e) => handleParameterChange(key, e.target.value)}
                  onFocus={(e) => e.target.select()}
                />
                <ValueDisplay>
                  Max: {config.max}
                </ValueDisplay>
              </InputContainer>
            </ParameterCard>
          ))}
        </ParametersGrid>

        <PredictButton onClick={handlePredict}>
          Predict Exoplanet
        </PredictButton>

        {predictionResult && (
          <ResultsSection>
            <ResultsTitle>Prediction Results</ResultsTitle>
            <PredictionCard>
              <div style={{ 
                background: 'rgba(74, 158, 255, 0.1)', 
                border: '1px solid rgba(74, 158, 255, 0.3)', 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '16px' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '12px' 
                }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: '900', 
                    color: predictionResult.prediction.is_exoplanet ? '#4caf50' : '#f44336',
                    fontFamily: 'Orbitron, monospace',
                    marginBottom: '8px',
                    textAlign: 'center'
                  }}>
                    {predictionResult.prediction.is_exoplanet ? '🪐 EXOPLANET' : '❌ NOT EXOPLANET'}
                  </div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: predictionResult.prediction.is_exoplanet ? '#4caf50' : '#f44336',
                    fontFamily: 'Space Mono, monospace',
                    textAlign: 'center'
                  }}>
                    {Math.round(predictionResult.prediction.confidence * 10000) / 100}% confident
                  </div>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'Space Mono, monospace'
                }}>
                  Model Version: {predictionResult.prediction.model_version}
                </div>
              </div>
            </PredictionCard>
          </ResultsSection>
        )}
      </Section>
    </ManualPredictContainer>
  );
}

export default ManualPredict;
