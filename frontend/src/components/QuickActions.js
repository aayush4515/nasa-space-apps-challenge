import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: rgba(74, 158, 255, 0.6);
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(74, 158, 255, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(74, 158, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const ActionIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.9;
`;

const ActionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #4a9eff;
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
  text-align: center;
`;

const ActionDescription = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Space Mono', monospace;
  text-align: center;
  line-height: 1.4;
`;

function QuickActions() {
  const actions = [
    {
      to: '/search',
      icon: '🔮',
      title: 'Predict Candidates',
      description: 'Get ML predictions for exoplanet candidates'
    },
    {
      to: '/history',
      icon: '📋',
      title: 'View History',
      description: 'View history of tests and predictions'
    },
    {
      to: '/analytics',
      icon: '📊',
      title: 'View Analytics',
      description: 'Analyze search results and model performance'
    }
  ];

  return (
    <ActionsGrid>
      {actions.map((action, index) => (
        <ActionCard key={index} to={action.to}>
          <ActionIcon>{action.icon}</ActionIcon>
          <ActionTitle>{action.title}</ActionTitle>
          <ActionDescription>{action.description}</ActionDescription>
        </ActionCard>
      ))}
    </ActionsGrid>
  );
}

export default QuickActions;
