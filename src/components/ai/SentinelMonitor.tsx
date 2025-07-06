import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles } from 'lucide-react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
`

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(45deg, #00d4ff, #00ff9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
`

const Description = styled(motion.p)`
  font-size: 1.1rem;
  color: #ccc;
  margin-bottom: 32px;
  max-width: 600px;
`

const ComingSoon = styled(motion.div)`
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  padding: 24px;
  color: #00d4ff;
  font-size: 1.1rem;
  font-weight: 600;
`

export const SentinelMonitor: React.FC = () => {
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Shield size={80} style={{ color: '#00d4ff', marginBottom: '24px' }} />
      </motion.div>
      
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Sentinel Monitor
      </Title>
      
      <Description
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Monitor your project's health, performance, and security with AI-powered analysis and auto-healing.
      </Description>
      
      <ComingSoon
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Sparkles size={24} style={{ marginRight: '8px' }} />
        Coming Soon - AI-powered monitoring & auto-healing system
      </ComingSoon>
    </Container>
  )
}