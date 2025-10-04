import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import ModelStatus from './ModelStatus';
import QuickActions from './QuickActions';

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

function Dashboard({ currentModel, uploadedFiles, trainingHistory }) {
  const [dashboardData, setDashboardData] = useState({
    totalFiles: 0,
    totalPredictions: 0,
    modelAccuracy: 0,
    lastTraining: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // FIXME: Fetch dashboard data from backend
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Placeholder data - replace with actual API calls
        const mockData = {
          totalFiles: uploadedFiles.length,
          totalPredictions: Math.floor(Math.random() * 1000) + 500,
          modelAccuracy: Math.random() * 0.3 + 0.7, // 70-100%
          lastTraining: trainingHistory.length > 0 ? trainingHistory[trainingHistory.length - 1] : null
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [uploadedFiles, trainingHistory]);

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
          Harness the power of AI to discover exoplanets in space mission data. 
          Upload datasets, train models, and make predictions with cutting-edge machine learning.
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        <StatsCard
          title="Total Files"
          value={dashboardData.totalFiles}
          icon="📁"
          color="#4a9eff"
          trend="+12%"
        />
        <StatsCard
          title="Predictions Made"
          value={dashboardData.totalPredictions.toLocaleString()}
          icon="🔮"
          color="#6bb6ff"
          trend="+8%"
        />
        <StatsCard
          title="Model Accuracy"
          value={`${(dashboardData.modelAccuracy * 100).toFixed(1)}%`}
          icon="🎯"
          color="#4caf50"
          trend="+2.3%"
        />
        <StatsCard
          title="Exoplanets Found"
          value="1,247"
          icon="🪐"
          color="#ff6b6b"
          trend="+15%"
        />
      </StatsGrid>

      <SectionGrid>
        <Section>
          <SectionTitle>Recent Activity</SectionTitle>
          <RecentActivity 
            uploadedFiles={uploadedFiles}
            trainingHistory={trainingHistory}
          />
        </Section>
        
        <Section>
          <SectionTitle>Model Status</SectionTitle>
          <ModelStatus 
            currentModel={currentModel}
            accuracy={dashboardData.modelAccuracy}
            lastTraining={dashboardData.lastTraining}
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
