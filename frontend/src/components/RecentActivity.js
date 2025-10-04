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

function RecentActivity({ uploadedFiles, trainingHistory }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload': return '📁';
      case 'training': return '🧠';
      case 'prediction': return '🔮';
      default: return '📊';
    }
  };

  const formatTimeAgo = (timestamp) => {
    // FIXME: Implement proper time formatting
    return '2 hours ago';
  };

  // Combine and sort activities
  const activities = [
    ...uploadedFiles.map(file => ({
      type: 'upload',
      title: 'File Uploaded',
      description: file.filename || file.name,
      timestamp: file.uploadTime || new Date().toISOString()
    })),
    ...trainingHistory.map(training => ({
      type: 'training',
      title: 'Model Training',
      description: `Training completed with ${(training.accuracy * 100).toFixed(1)}% accuracy`,
      timestamp: training.timestamp
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

  if (activities.length === 0) {
    return (
      <NoActivityMessage>
        No recent activity. Upload files or train models to see activity here.
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
