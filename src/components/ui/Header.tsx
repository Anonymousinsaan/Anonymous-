import React from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, User, Settings, Zap } from 'lucide-react'
import styled from 'styled-components'
import { useAuthStore } from '@/stores/authStore'

const HeaderContainer = styled(motion.header)`
  height: 64px;
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: relative;
  z-index: 100;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 8px 16px;
  min-width: 300px;
  
  input {
    background: none;
    border: none;
    color: white;
    outline: none;
    font-size: 14px;
    flex: 1;
    margin-left: 8px;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(45deg, #00d4ff, #00ff9d);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    
    .username {
      font-size: 14px;
      font-weight: 600;
      color: white;
    }
    
    .status {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
`

const PowerIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 255, 157, 0.1);
  border: 1px solid rgba(0, 255, 157, 0.3);
  border-radius: 16px;
  
  .power-text {
    font-size: 12px;
    font-weight: 600;
    color: #00ff9d;
  }
`

export const Header: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <HeaderContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderLeft>
        <PowerIndicator>
          <Zap size={16} style={{ color: '#00ff9d' }} />
          <span className="power-text">AI POWERED</span>
        </PowerIndicator>
        
        <SearchBar>
          <Search size={16} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
          <input 
            type="text" 
            placeholder="Ask AI to build anything..." 
          />
        </SearchBar>
      </HeaderLeft>
      
      <HeaderRight>
        <IconButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell size={20} />
        </IconButton>
        
        <IconButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings size={20} />
        </IconButton>
        
        <UserProfile>
          <div className="avatar">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <div className="username">{user?.username || 'Developer'}</div>
            <div className="status">Online</div>
          </div>
        </UserProfile>
      </HeaderRight>
    </HeaderContainer>
  )
}