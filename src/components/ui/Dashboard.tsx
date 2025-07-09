import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gamepad2, 
  Smartphone, 
  Globe, 
  Brain, 
  Zap, 
  Settings, 
  Play, 
  Pause,
  Download,
  Upload,
  Activity,
  Sparkles,
  Rocket,
  Eye
} from 'lucide-react'
import styled from 'styled-components'
import { useEngineStore } from '@/stores/engineStore'
import { useAIStore } from '@/stores/aiStore'
import { GenesisAI } from '@/components/ai/GenesisAI'

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
`

const WelcomeHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(45deg, #00d4ff, #00ff9d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }
  
  .subtitle {
    font-size: 1.2rem;
    color: #ccc;
    margin-bottom: 8px;
  }
  
  .version {
    font-size: 0.9rem;
    color: #888;
  }
`

const ModeSwitcher = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`

const ModeCard = styled(motion.div)<{ active?: boolean }>`
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid ${props => props.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00d4ff;
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 212, 255, 0.2);
  }
  
  .mode-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    color: ${props => props.active ? '#00d4ff' : '#888'};
  }
  
  .mode-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.active ? '#00d4ff' : '#fff'};
    margin-bottom: 8px;
  }
  
  .mode-description {
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 16px;
  }
  
  .mode-features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .feature-tag {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .mode-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: ${props => props.active ? '#00ff9d' : '#888'};
  }
`

const SystemStatus = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`

const StatusCard = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  
  .status-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .status-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
  }
  
  .status-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .metric {
    text-align: center;
    
    .metric-value {
      font-size: 1.4rem;
      font-weight: 700;
      color: #00ff9d;
    }
    
    .metric-label {
      font-size: 0.8rem;
      color: #888;
    }
  }
`

const QuickActions = styled(motion.div)`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
`

const ActionButton = styled(motion.button)`
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const modes = [
  {
    id: 'game',
    title: 'GameForge Mode',
    description: 'Create AAA & indie 3D/2D games with procedural generation and AI-powered NPCs',
    icon: Gamepad2,
    features: ['3D/2D Engine', 'Procedural Terrain', 'AI NPCs', 'Multiplayer', 'VR Support'],
    status: 'Ready'
  },
  {
    id: 'app',
    title: 'AppForge Mode',
    description: 'Build cross-platform mobile & desktop apps with drag-drop interface',
    icon: Smartphone,
    features: ['Drag & Drop', 'Cross-Platform', 'Backend API', 'Authentication', 'Push Notifications'],
    status: 'Ready'
  },
  {
    id: 'web',
    title: 'WebForge Mode',
    description: 'Develop responsive websites, e-commerce, and web platforms',
    icon: Globe,
    features: ['Responsive Design', 'E-Commerce', 'CMS', 'SEO Ready', 'Analytics'],
    status: 'Ready'
  },
  {
    id: 'ai',
    title: 'AIForge Mode',
    description: 'Create LLM agents, chatbots, and advanced AI services',
    icon: Brain,
    features: ['LLM Agents', 'Chatbots', 'AI Pipelines', 'Fine-tuning', 'Auto-deploy'],
    status: 'Ready'
  }
]

export const Dashboard: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<string>('game')
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const { 
    isInitialized, 
    isRunning, 
    renderStats, 
    currentProject,
    startEngine,
    stopEngine,
    createNewProject,
    exportProject
  } = useEngineStore()
  
  const { 
    modules, 
    isConnected, 
    nebulaVoidActive, 
    sentinelFluxActive,
    getAllModuleStatuses
  } = useAIStore()

  const handleModeChange = (modeId: string) => {
    setIsTransitioning(true)
    setSelectedMode(modeId)
    
    setTimeout(() => {
      setIsTransitioning(false)
      // Navigate to the specific mode
      window.location.href = `/builder?mode=${modeId}`
    }, 500)
  }

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'new-project':
        await createNewProject(`Project_${Date.now()}`, selectedMode)
        break
      case 'start-engine':
        startEngine()
        break
      case 'stop-engine':
        stopEngine()
        break
      case 'export':
        await exportProject('html5')
        break
    }
  }

  return (
    <DashboardContainer>
      <GenesisAI currentMode={selectedMode} onModeChange={handleModeChange} />
      
      <WelcomeHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>NebulaForge X</h1>
        <div className="subtitle">Universal AI-Powered Development Engine</div>
        <div className="version">v1.0.0 | All Systems Online</div>
      </WelcomeHeader>

      <ModeSwitcher
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {modes.map((mode) => (
          <ModeCard
            key={mode.id}
            active={selectedMode === mode.id}
            onClick={() => handleModeChange(mode.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <mode.icon className="mode-icon" />
            <div className="mode-title">{mode.title}</div>
            <div className="mode-description">{mode.description}</div>
            <div className="mode-features">
              {mode.features.map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
            <div className="mode-status">
              <Sparkles size={16} />
              {mode.status}
            </div>
          </ModeCard>
        ))}
      </ModeSwitcher>

      <SystemStatus
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <StatusCard>
          <div className="status-header">
            <Activity size={24} style={{ color: '#00ff9d' }} />
            <div className="status-title">Engine Status</div>
          </div>
          <div className="status-metrics">
            <div className="metric">
              <div className="metric-value">{renderStats.fps.toFixed(0)}</div>
              <div className="metric-label">FPS</div>
            </div>
            <div className="metric">
              <div className="metric-value">{renderStats.drawCalls}</div>
              <div className="metric-label">Draw Calls</div>
            </div>
            <div className="metric">
              <div className="metric-value">{(renderStats.memoryUsage / 1024).toFixed(1)}MB</div>
              <div className="metric-label">Memory</div>
            </div>
            <div className="metric">
              <div className="metric-value">{(renderStats.triangles / 1000).toFixed(1)}K</div>
              <div className="metric-label">Triangles</div>
            </div>
          </div>
        </StatusCard>

        <StatusCard>
          <div className="status-header">
            <Brain size={24} style={{ color: '#00d4ff' }} />
            <div className="status-title">AI Modules</div>
          </div>
          <div className="status-metrics">
            <div className="metric">
              <div className="metric-value">{getAllModuleStatuses().length}</div>
              <div className="metric-label">Active Modules</div>
            </div>
            <div className="metric">
              <div className="metric-value">{isConnected ? 'Online' : 'Offline'}</div>
              <div className="metric-label">Connection</div>
            </div>
            <div className="metric">
              <div className="metric-value">{nebulaVoidActive ? 'Active' : 'Idle'}</div>
              <div className="metric-label">NebulaVoid</div>
            </div>
            <div className="metric">
              <div className="metric-value">{sentinelFluxActive ? 'Monitoring' : 'Off'}</div>
              <div className="metric-label">SentinelFlux</div>
            </div>
          </div>
        </StatusCard>
      </SystemStatus>

      <QuickActions
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <ActionButton
          onClick={() => handleQuickAction('new-project')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Rocket size={20} />
          New Project
        </ActionButton>
        
        <ActionButton
          onClick={() => handleQuickAction(isRunning ? 'stop-engine' : 'start-engine')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Stop Engine' : 'Start Engine'}
        </ActionButton>
        
        <ActionButton
          onClick={() => handleQuickAction('export')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={20} />
          Export Project
        </ActionButton>
      </QuickActions>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={48} style={{ color: '#00d4ff' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardContainer>
  )
}