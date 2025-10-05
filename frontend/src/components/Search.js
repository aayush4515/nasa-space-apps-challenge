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
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
`;

const OptionItem = styled.div`
  padding: 12px 16px;
  color: white;
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(74, 158, 255, 0.1);
  
  &:hover {
    background: rgba(74, 158, 255, 0.2);
    color: #4a9eff;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NoOptions = styled.div`
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  text-align: center;
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

const ExoplanetData = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const DataValue = styled.div`
  font-size: 14px;
  color: white;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  font-size: 16px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #4a9eff;
`;

function Search() {
  const [selectedDataset, setSelectedDataset] = useState('kepler');
  const [exoplanetId, setExoplanetId] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    // Initialize the service
    console.log('PredictionService initialized');
  }, []);

  // Load candidate options when dataset changes
  useEffect(() => {
    const fetchCandidateOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const candidates = await PredictionService.getCandidates(selectedDataset);
        setCandidateOptions(candidates);
        setFilteredOptions(candidates);
        setExoplanetId(''); // Clear selection when switching datasets
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
  }, [selectedDataset]);

  // Filter options based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = candidateOptions.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
    } else {
      setFilteredOptions(candidateOptions);
      setShowOptions(false);
    }
  }, [searchQuery, candidateOptions]);

  const getCandidateLabel = () => {
    switch (selectedDataset) {
      case 'kepler':
        return 'KOI Name';
      case 'tess':
        return 'TESS Object of Interest';
      default:
        return 'Candidate ID';
    }
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
    if (searchQuery.trim()) {
      setShowOptions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding options to allow for clicks
    setTimeout(() => setShowOptions(false), 200);
  };

  const handleSearch = async () => {
    if (!exoplanetId.trim()) {
      toast.error('Please enter a candidate ID');
      return;
    }

    setIsSearching(true);

    try {
      // Set selection in the service
      PredictionService.setSelection(selectedDataset, exoplanetId);
      
      // Make prediction using direct service
      const result = await PredictionService.makePrediction();
      
      if (result.status === 'success') {
        const searchResult = {
          exoplanet_id: exoplanetId,
          dataset: selectedDataset,
          prediction: {
            confidence: result.confidence,
            score: result.confidence / 100,
            is_exoplanet: result.is_exoplanet,
            model_version: result.model_version
          }
        };
        
        setSearchResults(searchResult);
        toast.success(`Prediction complete! ${result.confidence}% confidence this is an exoplanet.`);
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
          Analyze exoplanet candidates using clean Kepler and TESS datasets with ML predictions. 
          Search by KOI names (Kepler) or TESS Objects of Interest (TESS).
        </SectionSubtitle>

        <SearchForm>
          <FormRow>
            <FormGroup>
              <Label>Dataset</Label>
              <Select
                value={selectedDataset}
                onChange={(e) => {
                  setSelectedDataset(e.target.value);
                  setExoplanetId(''); // Clear selection when switching datasets
                }}
              >
                <option value="kepler">Kepler Dataset (clean_kepler_dataset.csv)</option>
                <option value="tess">TESS Dataset (clean_tess_dataset.csv)</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>{getCandidateLabel()}</Label>
              <div style={{ position: 'relative', width: '100%' }}>
                <SearchInput
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={
                    isLoadingOptions 
                      ? 'Loading candidates...' 
                      : `Search or select a ${getCandidateLabel().toLowerCase()}...`
                  }
                  disabled={isLoadingOptions}
                />
                {showOptions && filteredOptions.length > 0 && (
                  <FilteredOptions>
                    {filteredOptions.slice(0, 20).map((option, index) => (
                      <OptionItem
                        key={index}
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </OptionItem>
                    ))}
                    {filteredOptions.length > 20 && (
                      <NoOptions>
                        Showing first 20 of {filteredOptions.length} results
                      </NoOptions>
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
            <ResultsTitle>Prediction Results</ResultsTitle>
            
            <ExoplanetCard>
              <ExoplanetHeader>
                <ExoplanetName>
                  {searchResults.exoplanet_id}
                </ExoplanetName>
                <ExoplanetID>
                  {selectedDataset === 'kepler' ? 'KOI Name' : 'TESS Object of Interest'}: {searchResults.exoplanet_id}
                </ExoplanetID>
              </ExoplanetHeader>
              
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
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '12px' 
                  }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: '700', 
                      color: searchResults.prediction.confidence >= 70 ? '#4caf50' : '#ff9800',
                      fontFamily: 'Orbitron, monospace'
                    }}>
                      {searchResults.prediction.confidence}% Confidence
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: 'Space Mono, monospace'
                    }}>
                      {searchResults.prediction.is_exoplanet ? 'Exoplanet' : 'Not Exoplanet'}
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
