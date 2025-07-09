import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Eye, Settings, Activity } from 'lucide-react'
import styled from 'styled-components'
import { useAIStore } from '@/stores/aiStore'

const GenesisContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  min-width: 280px;
`

const StatusIndicator = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${props => props.active ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? 'rgba(0, 255, 157, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  margin-bottom: 8px;
  
  .icon {
    color: ${props => props.active ? '#00ff9d' : '#888'};
  }
  
  .status-text {
    color: ${props => props.active ? '#00ff9d' : '#ccc'};
    font-size: 14px;
    font-weight: 500;
  }
`

const ModeDetection = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  
  .detection-title {
    color: #00d4ff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .detection-text {
    color: #fff;
    font-size: 12px;
    line-height: 1.4;
  }
`

const AIInsights = styled.div`
  margin-top: 12px;
  
  .insights-title {
    color: #00ff9d;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  
  .insight-item {
    color: #ccc;
    font-size: 11px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

interface GenesisAIProps {
  currentMode?: 'game' | 'app' | 'web' | 'ai' | 'auto'
  onModeChange?: (mode: 'game' | 'app' | 'web' | 'ai') => void
}

export const GenesisAI: React.FC<GenesisAIProps> = ({ currentMode = 'auto', onModeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [detectedIntent, setDetectedIntent] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const { 
    modules, 
    isConnected, 
    nebulaVoidActive, 
    sentinelFluxActive,
    chatHistory 
  } = useAIStore()

  useEffect(() => {
    // Analyze user behavior and detect intent
    const analyzeUserIntent = () => {
      setIsAnalyzing(true)
      
      // Simulate AI analysis based on chat history and activity
      setTimeout(() => {
        const lastMessages = chatHistory.slice(-5)
        const hasGameKeywords = lastMessages.some(msg => 
          msg.content.toLowerCase().includes('game') || 
          msg.content.toLowerCase().includes('player') ||
          msg.content.toLowerCase().includes('level')
        )
        
        const hasAppKeywords = lastMessages.some(msg => 
          msg.content.toLowerCase().includes('app') || 
          msg.content.toLowerCase().includes('mobile') ||
          msg.content.toLowerCase().includes('ui')
        )
        
        const hasWebKeywords = lastMessages.some(msg => 
          msg.content.toLowerCase().includes('website') || 
          msg.content.toLowerCase().includes('web') ||
          msg.content.toLowerCase().includes('frontend')
        )
        
        const hasAIKeywords = lastMessages.some(msg => 
          msg.content.toLowerCase().includes('ai') || 
          msg.content.toLowerCase().includes('agent') ||
          msg.content.toLowerCase().includes('chatbot')
        )
        
        let detectedMode = 'exploring'
        let newSuggestions: string[] = []
        
        if (hasGameKeywords) {
          detectedMode = 'game development'
          newSuggestions = [
            'Switch to GameForge mode',
            'Generate 3D terrain',
            'Create player controller',
            'Add physics system'
          ]
        } else if (hasAppKeywords) {
          detectedMode = 'app development'
          newSuggestions = [
            'Switch to AppForge mode',
            'Design UI components',
            'Setup navigation',
            'Add backend API'
          ]
        } else if (hasWebKeywords) {
          detectedMode = 'web development'
          newSuggestions = [
            'Switch to WebForge mode',
            'Create responsive layout',
            'Add animations',
            'Setup CMS'
          ]
        } else if (hasAIKeywords) {
          detectedMode = 'AI development'
          newSuggestions = [
            'Switch to AIForge mode',
            'Create LLM agent',
            'Setup conversation flow',
            'Add memory system'
          ]
        } else {
          newSuggestions = [
            'Try asking about games',
            'Explore app development',
            'Build a website',
            'Create AI agents'
          ]
        }
        
        setDetectedIntent(detectedMode)
        setSuggestions(newSuggestions)
        setIsAnalyzing(false)
      }, 1500)
    }
    
    analyzeUserIntent()
    
    // Re-analyze every 30 seconds
    const interval = setInterval(analyzeUserIntent, 30000)
    return () => clearInterval(interval)
  }, [chatHistory])

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes('GameForge') && onModeChange) {
      onModeChange('game')
    } else if (suggestion.includes('AppForge') && onModeChange) {
      onModeChange('app')
    } else if (suggestion.includes('WebForge') && onModeChange) {
      onModeChange('web')
    } else if (suggestion.includes('AIForge') && onModeChange) {
      onModeChange('ai')
    }
  }

  return (
    <GenesisContainer
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Brain className="icon" size={20} style={{ color: '#00d4ff' }} />
        <span style={{ color: '#00d4ff', fontWeight: 600, fontSize: '14px' }}>GenesisAI</span>
        {isAnalyzing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Activity size={16} style={{ color: '#00ff9d' }} />
          </motion.div>
        )}
      </div>
      
      <StatusIndicator active={isConnected}>
        <Zap className="icon" size={16} />
        <span className="status-text">
          {isConnected ? 'AI Systems Online' : 'Connecting...'}
        </span>
      </StatusIndicator>
      
      <StatusIndicator active={nebulaVoidActive}>
        <Eye className="icon" size={16} />
        <span className="status-text">
          {nebulaVoidActive ? 'Monitoring Active' : 'Monitoring Offline'}
        </span>
      </StatusIndicator>
      
      <StatusIndicator active={sentinelFluxActive}>
        <Settings className="icon" size={16} />
        <span className="status-text">
          {sentinelFluxActive ? 'Auto-Optimization On' : 'Auto-Optimization Off'}
        </span>
      </StatusIndicator>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ModeDetection>
            <div className="detection-title">Intent Detection</div>
            <div className="detection-text">
              {isAnalyzing ? 'Analyzing your project intent...' : `Detected: ${detectedIntent}`}
            </div>
          </ModeDetection>
          
          {suggestions.length > 0 && (
            <AIInsights>
              <div className="insights-title">AI Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="insight-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap size={10} style={{ color: '#00ff9d' }} />
                  {suggestion}
                </motion.div>
              ))}
            </AIInsights>
          )}
        </motion.div>
      )}
    </GenesisContainer>
  )
}