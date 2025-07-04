import React from 'react'
import styled from 'styled-components'
import { Search, Bell, Settings, User } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <Logo>
          <LogoIcon>⚡</LogoIcon>
          <LogoText>NebulaForge X</LogoText>
        </Logo>
      </HeaderLeft>
      
      <HeaderCenter>
        <SearchContainer>
          <Search size={20} />
          <SearchInput placeholder="Search projects, templates, or ask AI..." />
        </SearchContainer>
      </HeaderCenter>
      
      <HeaderRight>
        <HeaderAction>
          <Bell size={20} />
        </HeaderAction>
        <HeaderAction>
          <Settings size={20} />
        </HeaderAction>
        <UserProfile>
          <User size={20} />
        </UserProfile>
      </HeaderRight>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  min-width: 200px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 18px;
  color: white;
`

const LogoIcon = styled.div`
  font-size: 24px;
`

const LogoText = styled.span`
  background: linear-gradient(135deg, #00d4ff, #0099cc, #00ff9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const HeaderCenter = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 40px;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #00d4ff;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
  }
  
  svg {
    color: #666;
  }
`

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 14px;
  
  &::placeholder {
    color: #666;
  }
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 200px;
  justify-content: flex-end;
`

const HeaderAction = styled.button`
  background: transparent;
  border: none;
  color: #cccccc;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
  }
`

const UserProfile = styled.button`
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 212, 255, 0.3);
  }
`

export default Header