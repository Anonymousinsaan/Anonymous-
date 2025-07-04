import React from 'react'
import styled from 'styled-components'

export const LoadingScreen: React.FC = () => {
  return (
    <Container>
      <Title>LoadingScreen</Title>
      <Description>
        Welcome to LoadingScreen! This component is ready for development.
      </Description>
      <Placeholder>
        🚀 NebulaForge X - LoadingScreen Module
      </Placeholder>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #00d4ff, #0099cc, #00ff9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Description = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
  margin-bottom: 32px;
  max-width: 600px;
  line-height: 1.6;
`

const Placeholder = styled.div`
  background: rgba(0, 212, 255, 0.1);
  border: 2px dashed rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  padding: 40px;
  font-size: 1.25rem;
  color: #00d4ff;
  font-weight: 600;
`

export default LoadingScreen
