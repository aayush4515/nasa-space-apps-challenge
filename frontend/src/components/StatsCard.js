import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: rgba(74, 158, 255, 0.6);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${props => props.color}, ${props => props.color}88);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Space Mono', monospace;
  margin: 0;
`;

const CardIcon = styled.div`
  font-size: 24px;
  opacity: 0.8;
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: ${props => props.color};
  font-family: 'Orbitron', monospace;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
`;

const CardTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.positive ? '#4caf50' : '#f44336'};
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TrendArrow = styled.span`
  font-size: 14px;
`;

function StatsCard({ title, value, icon, color = '#4a9eff', trend, positive = true }) {
  return (
    <CardContainer color={color}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardIcon>{icon}</CardIcon>
      </CardHeader>
      
      <CardValue color={color}>{value}</CardValue>
      
      {trend && (
        <CardTrend positive={positive}>
          <TrendArrow>{positive ? '↗' : '↘'}</TrendArrow>
          {trend}
        </CardTrend>
      )}
    </CardContainer>
  );
}

export default StatsCard;
