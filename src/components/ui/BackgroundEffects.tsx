import React from 'react'
import styled from 'styled-components'

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`

const ParticleField = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(2px 2px at 20px 30px, rgba(0, 212, 255, 0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(0, 255, 157, 0.3), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255, 0, 150, 0.3), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(0, 212, 255, 0.3), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(0, 255, 157, 0.3), transparent);
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: float 20s infinite linear;
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`

const GlowEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%);
  animation: pulse 8s infinite ease-in-out;
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
  }
`

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 30s infinite linear;
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
`

export const BackgroundEffects: React.FC = () => {
  return (
    <BackgroundContainer>
      <GridOverlay />
      <ParticleField />
      <GlowEffect />
    </BackgroundContainer>
  )
}