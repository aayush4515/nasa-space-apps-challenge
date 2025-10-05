import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import DatabaseService from '../services/DatabaseService';

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
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #4a9eff;
`;

const RefreshButton = styled.button`
  background: rgba(74, 158, 255, 0.2);
  border: 1px solid rgba(74, 158, 255, 0.5);
  color: #4a9eff;
  padding: 8px 16px;
  border-radius: 6px;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(74, 158, 255, 0.3);
    border-color: rgba(74, 158, 255, 0.7);
  }
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  text-align: center;
  margin-top: 20px;
`;

function Analytics({ searchResults, currentModel }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // Use the same data source as Dashboard - get stats from database
        const dbStats = await DatabaseService.loadStats();
        const dbData = await DatabaseService.loadAllData();
        const dbPredictions = dbData.predictions || [];
        
        // Use database stats for accurate totals (same as Dashboard)
        const totalPredictions = dbStats.total_predictions || 0;
        const exoplanetsFound = dbStats.exoplanets_found || 0;
        const nonExoplanets = totalPredictions - exoplanetsFound;
        
        // Calculate confidence score distribution from database predictions
        const confidenceRanges = {
          '0-20%': 0,
          '21-40%': 0,
          '41-60%': 0,
          '61-80%': 0,
          '81-100%': 0
        };
        
        dbPredictions.forEach(pred => {
          const confidence = pred.prediction?.confidence || 0;
          if (confidence <= 20) confidenceRanges['0-20%']++;
          else if (confidence <= 40) confidenceRanges['21-40%']++;
          else if (confidence <= 60) confidenceRanges['41-60%']++;
          else if (confidence <= 80) confidenceRanges['61-80%']++;
          else confidenceRanges['81-100%']++;
        });
        
        const confidenceData = Object.entries(confidenceRanges).map(([range, count]) => ({
          range,
          count,
          percentage: totalPredictions > 0 ? Math.round((count / totalPredictions) * 100) : 0
        }));
        
        const analyticsData = {
          searchHistory: dbPredictions.map((result, index) => ({
            date: new Date(result.timestamp || Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            exoplanet_id: result.exoplanet_id
          })),
          monthlyStats: {
            totalSearches: totalPredictions,
            keplerSearches: totalPredictions,
            accuracy: 0.9117
          },
          exoplanetDiscovery: [
            { name: 'Exoplanets Found', value: exoplanetsFound, color: '#4caf50' },
            { name: 'Non-Exoplanets', value: nonExoplanets, color: '#f44336' }
          ],
          confidenceDistribution: confidenceData
        };
        
        setAnalyticsData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        
        // Fallback to local calculation (same as Dashboard)
        const results = searchResults || [];
        const exoplanetsFound = results.filter(result => 
          result.prediction && result.prediction.is_exoplanet
        ).length;
        const totalPredictions = results.length;
        const nonExoplanets = totalPredictions - exoplanetsFound;
        
        setAnalyticsData({
          searchHistory: results.map((result, index) => ({
            date: new Date(result.timestamp || Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            exoplanet_id: result.exoplanet_id
          })),
          monthlyStats: {
            totalSearches: totalPredictions,
            keplerSearches: totalPredictions,
            accuracy: 0.9117
          },
          exoplanetDiscovery: [
            { name: 'Exoplanets Found', value: exoplanetsFound, color: '#4caf50' },
            { name: 'Non-Exoplanets', value: nonExoplanets, color: '#f44336' }
          ],
          confidenceDistribution: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [searchResults, lastUpdate]);

  // Auto-refresh every 30 seconds to catch new predictions
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Listen for storage events to detect new predictions from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'predictions' || e.key === 'searchResults') {
        setLastUpdate(Date.now());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
        <SectionTitle>Kepler Analytics Dashboard</SectionTitle>
        <SectionSubtitle>
          Comprehensive analysis of Kepler model performance and prediction statistics
        </SectionSubtitle>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <RefreshButton onClick={() => setLastUpdate(Date.now())}>
            🔄 Refresh Data
          </RefreshButton>
        </div>

        <StatsGrid>
          <StatCard>
            <StatValue color="#4a9eff">{analyticsData.monthlyStats.totalSearches}</StatValue>
            <StatLabel>Total Predictions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#4caf50">{analyticsData.exoplanetDiscovery[0]?.value || 0}</StatValue>
            <StatLabel>Exoplanets Found</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#f44336">{analyticsData.exoplanetDiscovery[1]?.value || 0}</StatValue>
            <StatLabel>Non-Exoplanets</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#ff9800">
              {analyticsData.monthlyStats.totalSearches > 0 
                ? Math.round((analyticsData.exoplanetDiscovery[0]?.value / analyticsData.monthlyStats.totalSearches) * 100) 
                : 0}%
            </StatValue>
            <StatLabel>Discovery Rate</StatLabel>
          </StatCard>
        </StatsGrid>

        <ChartsGrid>
          <ChartCard>
            <ChartTitle>Exoplanet Discovery Distribution</ChartTitle>
            <ChartContainer>
              {analyticsData.exoplanetDiscovery.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.exoplanetDiscovery}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.exoplanetDiscovery.map((entry, index) => (
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
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%', 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'Space Mono, monospace'
                }}>
                  No prediction data available
                </div>
              )}
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Confidence Score Distribution</ChartTitle>
            <ChartContainer>
              {analyticsData.confidenceDistribution.some(item => item.count > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.confidenceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 158, 255, 0.2)" />
                    <XAxis 
                      dataKey="range" 
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
                      formatter={(value, name) => [value, 'Predictions']}
                      labelFormatter={(label) => `Confidence Range: ${label}`}
                    />
                    <Bar dataKey="count" fill="#4a9eff" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%', 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'Space Mono, monospace'
                }}>
                  No prediction data available
                </div>
              )}
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Prediction Activity Over Time</ChartTitle>
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

        </ChartsGrid>

        <LastUpdated>
          Last updated: {new Date().toLocaleString()}
        </LastUpdated>

      </AnalyticsSection>
    </AnalyticsContainer>
  );
}

export default Analytics;
