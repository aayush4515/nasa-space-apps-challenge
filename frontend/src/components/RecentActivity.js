import React from 'react';
import styled from 'styled-components';

const ActivityList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(74, 158, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  font-size: 20px;
  opacity: 0.8;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: white;
  font-family: 'Space Mono', monospace;
  margin-bottom: 4px;
`;

const ActivityDescription = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
`;

const ActivityTime = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NoActivityMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Space Mono', monospace;
  font-size: 14px;
`;

function RecentActivity({ searchResults }) {
  console.log('RecentActivity received searchResults:', searchResults);
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'search': return '🔮';
      case 'prediction': return '🔮';
      default: return '📊';
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Handle both single object and array cases
  const resultsArray = Array.isArray(searchResults) ? searchResults : (searchResults ? [searchResults] : []);

  // Combine and sort activities
  const activities = [
    ...resultsArray.map(result => {
      const isExoplanet = result.prediction?.is_exoplanet;
      const status = isExoplanet ? 'Confirmed' : 'Rejected';
      const dataset = result.dataset === 'kepler' ? 'Kepler' : 'TESS';
      
      return {
        type: 'search',
        title: 'ML Prediction',
        description: `${result.exoplanet_id} tested from ${dataset} dataset. ${status} as exoplanet.`,
        timestamp: result.timestamp || new Date().toISOString()
      };
    })
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

  if (activities.length === 0) {
    return (
      <NoActivityMessage>
        No recent activity. Make predictions to see activity here.
      </NoActivityMessage>
    );
  }

  return (
    <ActivityList>
      {activities.map((activity, index) => (
        <ActivityItem key={index}>
          <ActivityIcon>{getActivityIcon(activity.type)}</ActivityIcon>
          <ActivityContent>
            <ActivityTitle>{activity.title}</ActivityTitle>
            <ActivityDescription>{activity.description}</ActivityDescription>
          </ActivityContent>
          <ActivityTime>{formatTimeAgo(activity.timestamp)}</ActivityTime>
        </ActivityItem>
      ))}
    </ActivityList>
  );
}

export default RecentActivity;
