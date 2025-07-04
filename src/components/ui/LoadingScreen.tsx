import React from 'react'
import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%);
  position: relative;
  overflow: hidden;
`

const LoadingSpinner = styled.div`
  width: 80px;
  height: 80px;
  border: 3px solid rgba(0, 212, 255, 0.1);
  border-top: 3px solid #00d4ff;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    border: 2px solid rgba(0, 255, 157, 0.1);
    border-top: 2px solid #00ff9d;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ${rotate} 1.5s linear infinite reverse;
  }
`

const LoadingText = styled(motion.h2)`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
`

const LoadingSubtext = styled(motion.p)`
  color: #666666;
  font-size: 0.875rem;
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`

const ParticleField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(2px 2px at 20px 30px, rgba(0, 212, 255, 0.2), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(0, 255, 157, 0.2), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255, 0, 150, 0.2), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(0, 212, 255, 0.2), transparent);
    background-repeat: repeat;
    background-size: 150px 150px;
    animation: float 15s infinite linear;
  }
`

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4ff 0%, #00ff9d 50%, #ff0096 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
  letter-spacing: 2px;
`

interface LoadingScreenProps {
  message?: string
  subtext?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "NebulaForge X", 
  subtext = "Initializing AI-powered game engine..." 
}) => {
  return (
    <LoadingContainer>
      <ParticleField />
      
      <LogoContainer
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Logo>NEBULA</Logo>
      </LogoContainer>
      
      <LoadingSpinner />
      
      <LoadingText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {message}
      </LoadingText>
      
      <LoadingSubtext
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {subtext}
      </LoadingSubtext>
    </LoadingContainer>
  )
}