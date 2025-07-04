import React from 'react'
import styled from 'styled-components'
import { Home, Gamepad2, MessageSquare, Settings, Folder, Code, Users, Shield } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const Sidebar: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/builder', icon: Gamepad2, label: 'Engine Builder' },
    { path: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
    { path: '/projects', icon: Folder, label: 'Projects' },
    { path: '/visual-scripting', icon: Code, label: 'Visual Scripting' },
    { path: '/asset-forge', icon: Settings, label: 'Asset Forge' },
    { path: '/multiplayer', icon: Users, label: 'Multiplayer' },
    { path: '/sentinel', icon: Shield, label: 'Sentinel Monitor' },
  ]

  return (
    <SidebarContainer>
      <SidebarHeader>
        <LogoContainer>
          <Logo>⚡</Logo>
          <LogoText>NF</LogoText>
        </LogoContainer>
      </SidebarHeader>
      
      <NavList>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            $isActive={location.pathname === item.path}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavItem>
        ))}
      </NavList>
      
      <SidebarFooter>
        <StatusIndicator>
          <StatusDot $status="online" />
          <span>All Systems Online</span>
        </StatusIndicator>
      </SidebarFooter>
    </SidebarContainer>
  )
}

const SidebarContainer = styled.aside`
  width: 280px;
  background: rgba(5, 5, 5, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 212, 255, 0.2);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  z-index: 10;
`

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Logo = styled.div`
  font-size: 32px;
`

const LogoText = styled.div`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4ff, #0099cc, #00ff9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const NavList = styled.nav`
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const NavItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  color: ${props => props.$isActive ? '#00d4ff' : '#cccccc'};
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
  }
  
  ${props => props.$isActive && `
    background: rgba(0, 212, 255, 0.1);
    border-right: 3px solid #00d4ff;
  `}
  
  span {
    font-size: 14px;
    font-weight: 500;
  }
  
  svg {
    flex-shrink: 0;
  }
`

const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
`

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
`

const StatusDot = styled.div<{ $status: 'online' | 'offline' | 'warning' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => 
    props.$status === 'online' ? '#00ff9d' :
    props.$status === 'warning' ? '#ffeb3b' :
    '#ff4757'
  };
  box-shadow: 0 0 8px ${props => 
    props.$status === 'online' ? '#00ff9d' :
    props.$status === 'warning' ? '#ffeb3b' :
    '#ff4757'
  };
`

export default Sidebar