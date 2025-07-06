import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Gamepad2, 
  Smartphone, 
  Globe, 
  Brain, 
  MessageSquare, 
  Package, 
  FolderOpen,
  Code,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import styled from 'styled-components'

const SidebarContainer = styled(motion.aside)<{ collapsed: boolean }>`
  width: ${props => props.collapsed ? '80px' : '280px'};
  background: rgba(0, 0, 0, 0.9);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  height: 100vh;
  overflow: hidden;
  position: relative;
  transition: width 0.3s ease;
  backdrop-filter: blur(10px);
`

const SidebarHeader = styled.div<{ collapsed: boolean }>`
  padding: 20px ${props => props.collapsed ? '16px' : '24px'};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo {
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, #00d4ff, #00ff9d);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 18px;
  }
  
  .title {
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: opacity 0.3s ease;
  }
`

const CollapseToggle = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
  }
`

const Navigation = styled.nav`
  padding: 24px 0;
  flex: 1;
  overflow-y: auto;
`

const NavSection = styled.div<{ collapsed: boolean }>`
  margin-bottom: 32px;
  
  .section-title {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
    padding: 0 ${props => props.collapsed ? '16px' : '24px'};
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: opacity 0.3s ease;
  }
`

const NavItem = styled(motion.div)<{ active: boolean; collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px ${props => props.collapsed ? '16px' : '24px'};
  margin: 0 ${props => props.collapsed ? '8px' : '16px'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  background: ${props => props.active ? 'rgba(0, 212, 255, 0.1)' : 'transparent'};
  color: ${props => props.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.7)'};
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
  }
  
  .icon {
    width: 24px;
    height: 24px;
    margin-right: ${props => props.collapsed ? '0' : '16px'};
  }
  
  .label {
    font-size: 14px;
    font-weight: 500;
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: opacity 0.3s ease;
  }
  
  .badge {
    background: #00ff9d;
    color: black;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 8px;
    margin-left: auto;
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: opacity 0.3s ease;
  }
`

const Tooltip = styled(motion.div)`
  position: absolute;
  left: 90px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`

const navigationItems = [
  {
    section: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
      { id: 'builder', label: 'Engine Builder', icon: Gamepad2, path: '/builder', badge: 'NEW' },
      { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare, path: '/ai-chat' },
    ]
  },
  {
    section: 'Creation Modes',
    items: [
      { id: 'gameforge', label: 'GameForge', icon: Gamepad2, path: '/builder?mode=game' },
      { id: 'appforge', label: 'AppForge', icon: Smartphone, path: '/builder?mode=app' },
      { id: 'webforge', label: 'WebForge', icon: Globe, path: '/builder?mode=web' },
      { id: 'aiforge', label: 'AIForge', icon: Brain, path: '/builder?mode=ai' },
    ]
  },
  {
    section: 'Tools',
    items: [
      { id: 'asset-forge', label: 'Asset Forge', icon: Package, path: '/asset-forge' },
      { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },
      { id: 'visual-scripting', label: 'Visual Scripts', icon: Code, path: '/visual-scripting' },
      { id: 'multiplayer', label: 'Multiplayer', icon: Users, path: '/multiplayer' },
      { id: 'sentinel', label: 'Sentinel Monitor', icon: Shield, path: '/sentinel' },
    ]
  }
]

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path.includes('builder') && location.pathname.includes('builder'))
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <SidebarContainer
      collapsed={collapsed}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CollapseToggle
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </CollapseToggle>

      <SidebarHeader collapsed={collapsed}>
        <div className="logo">
          <Sparkles size={20} />
        </div>
        <div className="title">NebulaForge X</div>
      </SidebarHeader>

      <Navigation>
        {navigationItems.map((section) => (
          <NavSection key={section.section} collapsed={collapsed}>
            <div className="section-title">{section.section}</div>
            {section.items.map((item) => (
              <NavItem
                key={item.id}
                active={isActive(item.path)}
                collapsed={collapsed}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="icon" />
                <span className="label">{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
                
                {collapsed && hoveredItem === item.id && (
                  <Tooltip
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </Tooltip>
                )}
              </NavItem>
            ))}
          </NavSection>
        ))}
      </Navigation>
    </SidebarContainer>
  )
}