import React from 'react'
import styled, { keyframes } from 'styled-components'

export const BackgroundEffects: React.FC = () => {
  return (
    <BackgroundContainer>
      <StarsLayer />
      <NebulaLayer />
      <GridLayer />
    </BackgroundContainer>
  )
}

const float = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-40px) translateX(-5px); }
  75% { transform: translateY(-20px) translateX(-10px); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`

const StarsLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(2px 2px at 20px 30px, rgba(0, 212, 255, 0.4), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(0, 255, 157, 0.3), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255, 0, 150, 0.4), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(0, 212, 255, 0.3), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(0, 255, 157, 0.3), transparent),
    radial-gradient(1px 1px at 200px 120px, rgba(255, 0, 150, 0.2), transparent);
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: ${float} 20s ease-in-out infinite;
`

const NebulaLayer = styled.div`
  position: absolute;
  top: 10%;
  right: 20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle at center,
    rgba(0, 212, 255, 0.15) 0%,
    rgba(0, 153, 204, 0.1) 30%,
    rgba(0, 255, 157, 0.05) 60%,
    transparent 100%
  );
  border-radius: 50%;
  filter: blur(60px);
  animation: ${pulse} 8s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(
      circle at center,
      rgba(255, 0, 150, 0.2) 0%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%);
    filter: blur(40px);
    animation: ${float} 15s ease-in-out infinite reverse;
  }
`

const GridLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 212, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`

export default BackgroundEffects