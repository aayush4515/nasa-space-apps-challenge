import React from 'react';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HistoryHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const HistoryTitle = styled.h1`
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #4a9eff, #6bb6ff, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 3s ease-in-out infinite alternate;
  
  @keyframes glow {
    from { filter: drop-shadow(0 0 20px rgba(74, 158, 255, 0.5)); }
    to { filter: drop-shadow(0 0 30px rgba(255, 107, 107, 0.5)); }
  }
`;

const HistorySubtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const TableContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: rgba(74, 158, 255, 0.1);
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid rgba(74, 158, 255, 0.3);
`;

const TableHeaderCell = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  color: #4a9eff;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(74, 158, 255, 0.1);
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(74, 158, 255, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 16px 20px;
  font-family: 'Space Mono', monospace;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
`;

const CandidateCell = styled(TableCell)`
  font-weight: 600;
  color: #4a9eff;
`;

const DatasetCell = styled(TableCell)`
  text-transform: uppercase;
  font-weight: 600;
`;

const ConfidenceCell = styled(TableCell)`
  font-weight: 600;
  color: ${props => props.confidence >= 70 ? '#4caf50' : props.confidence >= 50 ? '#ff9800' : '#f44336'};
`;

const StatusCell = styled(TableCell)`
  font-weight: 600;
  color: ${props => props.isExoplanet ? '#4caf50' : '#f44336'};
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  font-size: 16px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

function History({ searchResults }) {
  const totalPredictions = searchResults.length;
  const exoplanetsFound = searchResults.filter(result => 
    result.prediction && result.prediction.is_exoplanet
  ).length;
  const averageConfidence = searchResults.length > 0 
    ? (searchResults.reduce((sum, result) => sum + (result.prediction?.confidence || 0), 0) / searchResults.length).toFixed(1)
    : 0;

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (searchResults.length === 0) {
    return (
      <HistoryContainer>
        <HistoryHeader>
          <HistoryTitle>Prediction History</HistoryTitle>
          <HistorySubtitle>
            View detailed history of all ML predictions and test results
          </HistorySubtitle>
        </HistoryHeader>
        
        <NoDataMessage>
          No predictions made yet. Start by making predictions to see your history here.
        </NoDataMessage>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>Prediction History</HistoryTitle>
        <HistorySubtitle>
          View detailed history of all ML predictions and test results
        </HistorySubtitle>
      </HistoryHeader>

      <StatsRow>
        <StatCard>
          <StatValue>{totalPredictions}</StatValue>
          <StatLabel>Total Predictions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{exoplanetsFound}</StatValue>
          <StatLabel>Exoplanets Found</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{averageConfidence}%</StatValue>
          <StatLabel>Avg Confidence</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{((exoplanetsFound / totalPredictions) * 100).toFixed(1)}%</StatValue>
          <StatLabel>Success Rate</StatLabel>
        </StatCard>
      </StatsRow>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Candidate ID</TableHeaderCell>
              <TableHeaderCell>Dataset</TableHeaderCell>
              <TableHeaderCell>Confidence</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {searchResults.map((result, index) => (
              <TableRow key={index}>
                <CandidateCell>{result.exoplanet_id}</CandidateCell>
                <DatasetCell>{result.dataset}</DatasetCell>
                <ConfidenceCell confidence={result.prediction?.confidence || 0}>
                  {result.prediction?.confidence || 0}%
                </ConfidenceCell>
                <StatusCell isExoplanet={result.prediction?.is_exoplanet}>
                  {result.prediction?.is_exoplanet ? 'Exoplanet' : 'Not Exoplanet'}
                </StatusCell>
                <TableCell>{formatDate(result.timestamp || new Date().toISOString())}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </HistoryContainer>
  );
}

export default History;
