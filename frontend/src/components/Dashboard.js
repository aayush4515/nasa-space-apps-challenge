import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import ModelStatus from './ModelStatus';
import QuickActions from './QuickActions';
import DatabaseService from '../services/DatabaseService';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.h1`
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

const WelcomeSubtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #4a9eff;
`;

function Dashboard({ currentModel, searchResults }) {
  const [dashboardData, setDashboardData] = useState({
    totalSearches: 0,
    totalPredictions: 0,
    exoplanetsFound: 0,
    modelAccuracy: 0.9117,
    lastSearch: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data from database
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get stats from database first
        const dbStats = await DatabaseService.loadStats();
        
        // Fallback to local calculation if database is empty
        const results = searchResults || [];
        const exoplanetsFound = results.filter(result => 
          result.prediction && result.prediction.is_exoplanet
        ).length;
        
        const dashboardData = {
          totalSearches: dbStats.total_predictions || results.length,
          totalPredictions: dbStats.total_predictions || results.length,
          exoplanetsFound: dbStats.exoplanets_found || exoplanetsFound,
          modelAccuracy: 0.9117, // Fixed accuracy for pre-trained model
          lastSearch: results.length > 0 ? results[results.length - 1] : null
        };
        
        setDashboardData(dashboardData);
        console.log('Dashboard data loaded:', dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // Fallback to local calculation
        const results = searchResults || [];
        const exoplanetsFound = results.filter(result => 
          result.prediction && result.prediction.is_exoplanet
        ).length;
        
        setDashboardData({
          totalSearches: results.length,
          totalPredictions: results.length,
          exoplanetsFound: exoplanetsFound,
          modelAccuracy: 0.9117,
          lastSearch: results.length > 0 ? results[results.length - 1] : null
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [searchResults]);

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>
          <div className="loading"></div>
          <span style={{ marginLeft: '12px' }}>Loading dashboard...</span>
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome to NASA Exoplanet Detector</WelcomeTitle>
        <WelcomeSubtitle>
          Harness the power of AI to analyze exoplanet candidates in NASA mission data. 
          Get ML predictions with confidence scores for Kepler candidates.
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        <StatsCard
          title="Total Predictions"
          value={dashboardData.totalSearches}
          icon="🔮"
          color="#4a9eff"
          trend="+12%"
        />
        <StatsCard
          title="Model Accuracy"
          value={`${(dashboardData.modelAccuracy * 100).toFixed(1)}%`}
          icon="🎯"
          color="#6bb6ff"
          trend="+2%"
        />
        <StatsCard
          title="Active Model"
          value="XGBoost"
          icon="🤖"
          color="#4caf50"
          trend="Ready"
        />
        <StatsCard
          title="Exoplanets Found"
          value={dashboardData.exoplanetsFound}
          icon="🪐"
          color="#ff6b6b"
          trend="+15%"
        />
      </StatsGrid>

      <SectionGrid>
        <Section>
          <SectionTitle>Recent Activity</SectionTitle>
          <RecentActivity 
            searchResults={searchResults}
          />
        </Section>
        
        <Section>
          <SectionTitle>Model Status</SectionTitle>
          <ModelStatus 
            currentModel={currentModel}
            accuracy={dashboardData.modelAccuracy}
            lastSearch={dashboardData.lastSearch}
          />
        </Section>
      </SectionGrid>

      <Section>
        <SectionTitle>Quick Actions</SectionTitle>
        <QuickActions />
      </Section>
    </DashboardContainer>
  );
}

export default Dashboard;
