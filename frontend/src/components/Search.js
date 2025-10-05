import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import PredictionService from '../services/PredictionService';

const SearchContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const SearchSection = styled.div`
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

const SearchForm = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const SearchInput = styled.input`
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

const FilteredOptions = styled.div`
  max-height: 240px; /* 8 items * 30px each */
  overflow-y: auto;
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 158, 255, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(74, 158, 255, 0.7);
  }
`;

const OptionItem = styled.div`
  padding: 8px 16px;
  color: white;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(74, 158, 255, 0.1);
  height: 30px;
  display: flex;
  align-items: center;
  
  &:hover {
    background: rgba(74, 158, 255, 0.2);
    color: #4a9eff;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NoOptions = styled.div`
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  text-align: center;
  border-top: 1px solid rgba(74, 158, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
`;

const ScrollIndicator = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(74, 158, 255, 0.6);
  font-size: 12px;
  pointer-events: none;
`;

const ScrollArrows = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 8px;
  top: 8px;
  bottom: 8px;
  width: 20px;
  pointer-events: none;
`;

const ScrollArrow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(74, 158, 255, 0.4);
  font-size: 12px;
  opacity: ${props => props.visible ? 1 : 0.3};
  transition: opacity 0.2s ease;
`;


const SearchButton = styled.button`
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

const ExoplanetCard = styled.div`
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

const ExoplanetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ExoplanetName = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin: 0;
`;

const ExoplanetID = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
`;


const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  font-size: 16px;
`;

// Add CSS animation for loading spinner
const SpinnerStyle = styled.div`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #4a9eff;
`;

function Search({ onSearchResult }) {
  const selectedDataset = 'kepler'; // Hardcoded to Kepler only
  const [exoplanetId, setExoplanetId] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lightcurveData, setLightcurveData] = useState(null);
  const [isGeneratingLightcurve, setIsGeneratingLightcurve] = useState(false);
  const [lightcurveError, setLightcurveError] = useState(null);
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollIndex, setScrollIndex] = useState(0);
  const [dropdownRef, setDropdownRef] = useState(null);
  useEffect(() => {
    // Initialize the service
    console.log('PredictionService initialized');
  }, []);

  // Load candidate options on component mount
  useEffect(() => {
    const fetchCandidateOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const candidates = await PredictionService.getCandidates();
        setCandidateOptions(candidates);
        setFilteredOptions(candidates);
        setExoplanetId(''); // Clear selection
        setSearchQuery(''); // Clear search query
        setShowOptions(false);
      } catch (error) {
        console.error('Error fetching candidate options:', error);
        toast.error('Failed to load candidate options');
        setCandidateOptions([]);
        setFilteredOptions([]);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchCandidateOptions();
  }, []);

  // Filter options based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = candidateOptions.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
      setScrollIndex(0); // Reset scroll when filtering
    } else {
      // Show all options when no search query
      setFilteredOptions(candidateOptions);
      setScrollIndex(0); // Reset scroll when clearing
    }
  }, [searchQuery, candidateOptions]);

  // Handle scroll in dropdown
  const handleScroll = (direction) => {
    const maxScroll = Math.max(0, filteredOptions.length - 8);
    if (direction === 'down' && scrollIndex < maxScroll) {
      setScrollIndex(prev => prev + 1);
    } else if (direction === 'up' && scrollIndex > 0) {
      setScrollIndex(prev => prev - 1);
    }
  };

  // Get visible options based on scroll position
  const getVisibleOptions = () => {
    return filteredOptions.slice(scrollIndex, scrollIndex + 8);
  };

  const getCandidateLabel = () => {
    return 'KOI Name'; // Kepler only
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setExoplanetId(query); // Update the selected value as user types
  };

  const handleOptionClick = (option) => {
    setExoplanetId(option);
    setSearchQuery(option);
    setShowOptions(false);
  };

  const handleInputFocus = () => {
    // Always show options when focused, regardless of search query
    setShowOptions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding options to allow for clicks
    setTimeout(() => setShowOptions(false), 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showOptions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        handleScroll('down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleScroll('up');
        break;
      case 'Enter':
        e.preventDefault();
        const visibleOptions = getVisibleOptions();
        if (visibleOptions.length > 0) {
          handleOptionClick(visibleOptions[0]);
        }
        break;
      case 'Escape':
        setShowOptions(false);
        break;
    }
  };

  // Handle mouse wheel scrolling
  const handleWheelScroll = (e) => {
    if (!showOptions) return;
    
    e.preventDefault();
    if (e.deltaY > 0) {
      handleScroll('down');
    } else {
      handleScroll('up');
    }
  };

  const handleLightcurveGeneration = async () => {
    if (!searchResults) {
      toast.error('Please make a prediction first');
      return;
    }

    setIsGeneratingLightcurve(true);
    setLightcurveError(null);

    try {
      const result = await PredictionService.generateLightcurve();
      
      if (result.status === 'success') {
        setLightcurveData(result);
        toast.success('Lightcurve generated successfully!');
      } else {
        setLightcurveError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Lightcurve generation error:', error);
      setLightcurveError('Failed to generate lightcurve');
      toast.error('Failed to generate lightcurve');
    } finally {
      setIsGeneratingLightcurve(false);
    }
  };

  const handleSearch = async () => {
    if (!exoplanetId.trim()) {
      toast.error('Please enter a candidate ID');
      return;
    }

    setIsSearching(true);
    setLightcurveData(null);
    setLightcurveError(null);

    try {
      // Set selection in the service
      PredictionService.setSelection(selectedDataset, exoplanetId);
      
      // Make prediction using direct service
      const result = await PredictionService.makePrediction();
      
              if (result.status === 'success') {
                console.log('Prediction result:', result);
                console.log('NASA classification from result:', result.nasa_classification);
                console.log('Lightcurve data from result:', result.lightcurve);
                
                const searchResult = {
                  exoplanet_id: exoplanetId,
                  dataset: selectedDataset,
                  timestamp: new Date().toISOString(),
                  prediction: {
                    confidence: result.confidence,
                    score: result.confidence / 100, // Convert percentage to decimal for display
                    is_exoplanet: result.is_exoplanet,
                    model_version: result.model_version
                  },
                  nasa_classification: result.nasa_classification,
                  lightcurve: result.lightcurve
                };
                
                console.log('Search result with NASA classification and lightcurve:', searchResult);
        setSearchResults(searchResult);
        
        // Call the parent component to update global state
        if (onSearchResult) {
          onSearchResult(searchResult);
        }
        
        const statusText = result.is_exoplanet ? 'is an exoplanet' : 'is not an exoplanet';
        toast.success(`Prediction complete! ${result.confidence}% confident ${result.exoplanet_id} ${statusText}.`);
      } else {
        toast.error(result.message || 'Prediction failed');
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Prediction failed. Please try again.');
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };


  if (isSearching) {
    return (
      <SearchContainer>
        <LoadingSpinner>
          <div className="loading"></div>
          <span style={{ marginLeft: '12px' }}>Predicting...</span>
        </LoadingSpinner>
      </SearchContainer>
    );
  }

  return (
    <SearchContainer>
      <SearchSection>
        <SectionTitle>Predict Exoplanet Candidates</SectionTitle>
        <SectionSubtitle>
          Analyze exoplanet candidates using the clean Kepler dataset with ML predictions. 
          Search by KOI names from the Kepler mission.
        </SectionSubtitle>

        <SearchForm>
          <FormRow>
            <FormGroup>
              <Label>{getCandidateLabel()}</Label>
              <div style={{ position: 'relative', width: '100%' }}>
                <SearchInput
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isLoadingOptions 
                      ? 'Loading candidates...' 
                      : `Click to browse or search ${getCandidateLabel().toLowerCase()}s...`
                  }
                  disabled={isLoadingOptions}
                />
                {showOptions && filteredOptions.length > 0 && (
                  <FilteredOptions onWheel={handleWheelScroll}>
                    {getVisibleOptions().map((option, index) => (
                      <OptionItem
                        key={scrollIndex + index}
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </OptionItem>
                    ))}
                    {filteredOptions.length > 8 && (
                      <>
                        <ScrollArrows>
                          <ScrollArrow visible={scrollIndex > 0}>↑</ScrollArrow>
                          <ScrollArrow visible={scrollIndex < filteredOptions.length - 8}>↓</ScrollArrow>
                        </ScrollArrows>
                        <NoOptions>
                          Showing {scrollIndex + 1}-{Math.min(scrollIndex + 8, filteredOptions.length)} of {filteredOptions.length} results
                          <br />
                          <small>Use mouse wheel or arrow keys to scroll</small>
                        </NoOptions>
                      </>
                    )}
                  </FilteredOptions>
                )}
                {showOptions && filteredOptions.length === 0 && searchQuery.trim() && (
                  <FilteredOptions>
                    <NoOptions>No matching candidates found</NoOptions>
                  </FilteredOptions>
                )}
              </div>
            </FormGroup>
          </FormRow>

          <SearchButton
            onClick={handleSearch}
            disabled={isSearching || !exoplanetId.trim()}
          >
            {isSearching ? 'Predicting...' : 'Predict'}
          </SearchButton>
        </SearchForm>

        {searchResults && (
          <ResultsSection>
            {/* KOI Name header with left/right layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px',
              padding: '0 20px'
            }}>
              <ExoplanetName style={{ 
                fontSize: '36px', 
                fontWeight: '900',
                margin: 0,
                textAlign: 'left'
              }}>
                {searchResults.exoplanet_id}
              </ExoplanetName>
              <ExoplanetID style={{ 
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}>
                {selectedDataset === 'kepler' ? 'KOI Name' : 'TESS Object of Interest'}: {searchResults.exoplanet_id}
              </ExoplanetID>
            </div>

            {/* Prediction Results */}
            <div style={{ marginBottom: '20px' }}>
              <ExoplanetCard>
                <ResultsTitle style={{ marginBottom: '16px' }}>Prediction Results</ResultsTitle>
              
              {searchResults.prediction && (
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
                      color: searchResults.prediction.is_exoplanet ? '#4caf50' : '#f44336',
                      fontFamily: 'Orbitron, monospace',
                      marginBottom: '8px',
                      textAlign: 'center'
                    }}>
                      {searchResults.prediction.is_exoplanet ? '🪐 EXOPLANET' : '❌ NOT EXOPLANET'}
                    </div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: searchResults.prediction.is_exoplanet ? '#4caf50' : '#f44336',
                      fontFamily: 'Space Mono, monospace',
                      textAlign: 'center'
                    }}>
                      {searchResults.prediction.confidence}% confident
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'Space Mono, monospace'
                  }}>
                    Model Version: {searchResults.prediction.model_version}
                  </div>
                </div>
              )}
              </ExoplanetCard>
            </div>

            {/* NASA Classification */}
            {console.log('Rendering NASA classification section, nasa_classification:', searchResults.nasa_classification)}
            {searchResults.nasa_classification && (
              <div style={{ 
                background: 'rgba(255, 193, 7, 0.1)', 
                border: '1px solid rgba(255, 193, 7, 0.3)', 
                borderRadius: '8px', 
                padding: '16px',
                marginTop: '20px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#ffc107',
                    fontFamily: 'Orbitron, monospace',
                    marginBottom: '8px'
                  }}>
                    🚀 NASA's Original Classification
                  </div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '900', 
                    color: searchResults.nasa_classification === 'CONFIRMED' ? '#4caf50' : 
                           searchResults.nasa_classification === 'CANDIDATE' ? '#ff9800' : '#f44336',
                    fontFamily: 'Space Mono, monospace',
                    textAlign: 'center'
                  }}>
                    {searchResults.nasa_classification}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'Space Mono, monospace',
                    marginTop: '4px',
                    textAlign: 'center'
                  }}>
                    From original Kepler dataset
                  </div>
                </div>
              </div>
            )}

            {/* Lightcurve Dropdown */}
            {searchResults && (
              <div style={{ 
                background: 'rgba(74, 158, 255, 0.1)', 
                border: '1px solid rgba(74, 158, 255, 0.3)', 
                borderRadius: '8px', 
                padding: '20px',
                marginTop: '20px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#4a9eff',
                    fontFamily: 'Orbitron, monospace',
                    marginBottom: '16px'
                  }}>
                    📈 Lightcurve
                  </div>
                  
                  {!lightcurveData && !isGeneratingLightcurve && !lightcurveError && (
                    <button
                      onClick={handleLightcurveGeneration}
                      style={{
                        background: 'linear-gradient(135deg, #4a9eff 0%, #6bb6ff 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        fontFamily: 'Space Mono, monospace',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(74, 158, 255, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(74, 158, 255, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(74, 158, 255, 0.3)';
                      }}
                    >
                      Generate Lightcurve
                    </button>
                  )}

                  {isGeneratingLightcurve && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: '#4a9eff',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '16px'
                    }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid #4a9eff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '12px'
                      }}></div>
                      Generating lightcurve...
                    </div>
                  )}

                  {lightcurveError && (
                    <div style={{ 
                      color: '#f44336',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '14px',
                      textAlign: 'center',
                      padding: '12px',
                      background: 'rgba(244, 67, 54, 0.1)',
                      border: '1px solid rgba(244, 67, 54, 0.3)',
                      borderRadius: '8px',
                      marginTop: '8px'
                    }}>
                      ❌ {lightcurveError}
                    </div>
                  )}

                  {lightcurveData && lightcurveData.status === 'success' && (
                    <div style={{ 
                      maxWidth: '100%',
                      textAlign: 'center',
                      marginTop: '16px'
                    }}>
                      <img 
                        src={`http://localhost:5002${lightcurveData.url}`}
                        alt="Lightcurve"
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '8px',
                          border: '1px solid rgba(74, 158, 255, 0.3)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                        onLoad={() => console.log('Lightcurve image loaded successfully')}
                        onError={(e) => {
                          console.error('Lightcurve image failed to load:', e.target.src);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ 
                        display: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '14px',
                        marginTop: '8px'
                      }}>
                        Lightcurve image failed to load
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </ResultsSection>
        )}

        {!searchResults && !isSearching && (
          <NoResultsMessage>
            Search or select a {selectedDataset === 'kepler' ? 'KOI Name' : 'TESS Object of Interest'} to get ML predictions from the {selectedDataset} dataset.
          </NoResultsMessage>
        )}
      </SearchSection>
    </SearchContainer>
  );
}

export default Search;
