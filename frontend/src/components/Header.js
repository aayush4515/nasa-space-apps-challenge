import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(74, 158, 255, 0.3);
  z-index: 1000;
  padding: 0 20px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    font-family: 'Orbitron', monospace;
    font-size: 24px;
    font-weight: 900;
    background: linear-gradient(45deg, #4a9eff, #6bb6ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#4a9eff' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: #4a9eff;
    background: rgba(74, 158, 255, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #4a9eff, #6bb6ff);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover::after,
  &.active::after {
    width: 100%;
  }
`;

const ModelSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 158, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
`;

const ModelLabel = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ModelToggle = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 2px;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(45deg, #4a9eff, #6bb6ff)' : 'transparent'};
  border: none;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
  padding: 6px 12px;
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    color: white;
    background: ${props => props.active ? 'linear-gradient(45deg, #6bb6ff, #4a9eff)' : 'rgba(74, 158, 255, 0.2)'};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${props => props.status === 'online' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  border: 1px solid ${props => props.status === 'online' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'};
  border-radius: 6px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.status === 'online' ? '#4caf50' : '#f44336'};
  animation: ${props => props.status === 'online' ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

function Header({ currentModel, onModelSwitch }) {
  const location = useLocation();
  const [connectionStatus, setConnectionStatus] = React.useState('online');

  // FIXME: Implement actual connection status checking
  React.useEffect(() => {
    // Check backend connection status
    const checkConnection = async () => {
      try {
        // const response = await fetch('/api/health');
        // setConnectionStatus(response.ok ? 'online' : 'offline');
        setConnectionStatus('online'); // Placeholder
      } catch (error) {
        setConnectionStatus('offline');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <div style={{ fontSize: '28px' }}>🚀</div>
          <h1>NASA Exoplanet Detector</h1>
        </Logo>
        
        <NavLinks>
          <NavLink 
            to="/" 
            active={location.pathname === '/' ? 1 : 0}
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/upload" 
            active={location.pathname === '/upload' ? 1 : 0}
            className={location.pathname === '/upload' ? 'active' : ''}
          >
            Upload
          </NavLink>
          <NavLink 
            to="/training" 
            active={location.pathname === '/training' ? 1 : 0}
            className={location.pathname === '/training' ? 'active' : ''}
          >
            Training
          </NavLink>
          <NavLink 
            to="/predictions" 
            active={location.pathname === '/predictions' ? 1 : 0}
            className={location.pathname === '/predictions' ? 'active' : ''}
          >
            Predictions
          </NavLink>
          <NavLink 
            to="/analytics" 
            active={location.pathname === '/analytics' ? 1 : 0}
            className={location.pathname === '/analytics' ? 'active' : ''}
          >
            Analytics
          </NavLink>
          
          <ModelSelector>
            <ModelLabel>Model:</ModelLabel>
            <ModelToggle>
              <ToggleButton
                active={currentModel === 'pretrained'}
                onClick={() => onModelSwitch('pretrained')}
              >
                Pre-trained
              </ToggleButton>
              <ToggleButton
                active={currentModel === 'trainable'}
                onClick={() => onModelSwitch('trainable')}
              >
                Trainable
              </ToggleButton>
            </ModelToggle>
          </ModelSelector>
          
          <StatusIndicator status={connectionStatus}>
            <StatusDot status={connectionStatus} />
            {connectionStatus.toUpperCase()}
          </StatusIndicator>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;
