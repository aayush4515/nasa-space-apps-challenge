import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AnalyticsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const AnalyticsSection = styled.div`
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

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ChartCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 20px;
  text-align: center;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: ${props => props.color || '#4a9eff'};
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ModelComparison = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ComparisonTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 20px;
  text-align: center;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ComparisonCard = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid ${props => props.isBest ? 'rgba(76, 175, 80, 0.5)' : 'rgba(74, 158, 255, 0.3)'};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  position: relative;
  
  ${props => props.isBest && `
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
  `}
`;

const ModelName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
`;

const ModelAccuracy = styled.div`
  font-size: 24px;
  font-weight: 900;
  color: ${props => props.isBest ? '#4caf50' : '#4a9eff'};
  font-family: 'Orbitron', monospace;
  margin-bottom: 4px;
`;

const ModelLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BestBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(45deg, #4caf50, #66bb6a);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #4a9eff;
`;

function Analytics({ searchResults, currentModel }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // FIXME: Replace with actual API calls
        const mockData = {
          searchHistory: searchResults.map((result, index) => ({
            date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dataset: result.dataset,
            exoplanet_id: result.exoplanet_id
          })),
          datasetUsage: [
            { name: 'Kepler', searches: searchResults.filter(r => r.dataset === 'kepler').length },
            { name: 'TESS', searches: searchResults.filter(r => r.dataset === 'tess').length }
          ],
          searchDistribution: [
            { name: 'Kepler', value: searchResults.filter(r => r.dataset === 'kepler').length, color: '#4caf50' },
            { name: 'TESS', value: searchResults.filter(r => r.dataset === 'tess').length, color: '#4a9eff' }
          ],
          monthlyStats: {
            totalSearches: searchResults.length,
            keplerSearches: searchResults.filter(r => r.dataset === 'kepler').length,
            tessSearches: searchResults.filter(r => r.dataset === 'tess').length,
            accuracy: 0.92
          }
        };
        
        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [searchResults]);

  if (isLoading) {
    return (
      <AnalyticsContainer>
        <LoadingSpinner>
          <div className="loading"></div>
          <span style={{ marginLeft: '12px' }}>Loading analytics...</span>
        </LoadingSpinner>
      </AnalyticsContainer>
    );
  }

  if (!analyticsData) {
    return (
      <AnalyticsContainer>
        <AnalyticsSection>
          <SectionTitle>Analytics</SectionTitle>
          <SectionSubtitle>No analytics data available</SectionSubtitle>
        </AnalyticsSection>
      </AnalyticsContainer>
    );
  }

  return (
    <AnalyticsContainer>
      <AnalyticsSection>
        <SectionTitle>Analytics Dashboard</SectionTitle>
        <SectionSubtitle>
          Comprehensive analysis of model performance and prediction statistics
        </SectionSubtitle>

        <StatsGrid>
          <StatCard>
            <StatValue color="#4a9eff">{analyticsData.monthlyStats.totalSearches}</StatValue>
            <StatLabel>Total Searches</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#4caf50">{analyticsData.monthlyStats.keplerSearches}</StatValue>
            <StatLabel>Kepler Searches</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#ff9800">{(analyticsData.monthlyStats.accuracy * 100).toFixed(1)}%</StatValue>
            <StatLabel>Model Accuracy</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#6bb6ff">{analyticsData.monthlyStats.tessSearches}</StatValue>
            <StatLabel>TESS Searches</StatLabel>
          </StatCard>
        </StatsGrid>

        <ChartsGrid>
          <ChartCard>
            <ChartTitle>Search Activity Over Time</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.searchHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 158, 255, 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255, 255, 255, 0.6)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(255, 255, 255, 0.6)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 46, 0.9)',
                      border: '1px solid rgba(74, 158, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="exoplanet_id" 
                    stroke="#4a9eff" 
                    strokeWidth={3}
                    dot={{ fill: '#4a9eff', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Dataset Usage</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.datasetUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 158, 255, 0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255, 255, 255, 0.6)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(255, 255, 255, 0.6)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 46, 0.9)',
                      border: '1px solid rgba(74, 158, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="searches" fill="#4a9eff" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Search Distribution</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.searchDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.searchDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(26, 26, 46, 0.9)',
                      border: '1px solid rgba(74, 158, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        </ChartsGrid>

        <ModelComparison>
          <ComparisonTitle>Dataset Usage Summary</ComparisonTitle>
          <ComparisonGrid>
            {analyticsData.datasetUsage.map((dataset, index) => {
              const isMostUsed = dataset.searches === Math.max(...analyticsData.datasetUsage.map(d => d.searches));
              return (
                <ComparisonCard key={index} isBest={isMostUsed}>
                  {isMostUsed && <BestBadge>Most Used</BestBadge>}
                  <ModelName>{dataset.name}</ModelName>
                  <ModelAccuracy isBest={isMostUsed}>
                    {dataset.searches}
                  </ModelAccuracy>
                  <ModelLabel>Searches</ModelLabel>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {dataset.name} dataset
                  </div>
                </ComparisonCard>
              );
            })}
          </ComparisonGrid>
        </ModelComparison>
      </AnalyticsSection>
    </AnalyticsContainer>
  );
}

export default Analytics;
