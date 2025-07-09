import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Code, 
  Eye, 
  Layers, 
  Zap,
  Download,
  Upload,
  Grid,
  Palette,
  Gamepad2,
  Smartphone,
  Globe,
  Brain
} from 'lucide-react'
import styled from 'styled-components'
import { useEngineStore } from '@/stores/engineStore'
import { useAIStore } from '@/stores/aiStore'
import { GenesisAI } from '@/components/ai/GenesisAI'

const BuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  overflow: hidden;
`

const BuilderHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`

const ModeSelector = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  .mode-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
    margin-right: 16px;
  }
`

const ModeButton = styled(motion.button)<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.active ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: ${props => props.active ? '#00d4ff' : 'white'};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
    color: #00d4ff;
  }
`

const BuilderControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const ControlButton = styled(motion.button)<{ variant?: 'primary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => 
    props.variant === 'primary' ? 'linear-gradient(45deg, #00d4ff, #0099cc)' :
    props.variant === 'danger' ? 'linear-gradient(45deg, #ff4757, #c44569)' :
    'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`

const BuilderContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const Viewport = styled(motion.div)`
  flex: 1;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
  
  .viewport-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #666;
  }
`

const PropertiesPanel = styled(motion.div)`
  width: 300px;
  background: rgba(0, 0, 0, 0.8);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  padding: 20px;
  
  h3 {
    color: white;
    margin-bottom: 16px;
    font-size: 1.1rem;
  }
  
  .property-group {
    margin-bottom: 24px;
    
    .group-title {
      color: #00d4ff;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .property-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .property-label {
        color: #ccc;
        font-size: 0.9rem;
      }
      
      .property-value {
        color: white;
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
  }
`

const FloatingTools = styled(motion.div)`
  position: absolute;
  left: 20px;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
`

const ToolButton = styled(motion.button)<{ active?: boolean }>`
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid ${props => props.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  color: ${props => props.active ? '#00d4ff' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #00d4ff;
    color: #00d4ff;
    transform: scale(1.1);
  }
`

const modes = [
  { id: 'game', label: 'GameForge', icon: Gamepad2 },
  { id: 'app', label: 'AppForge', icon: Smartphone },
  { id: 'web', label: 'WebForge', icon: Globe },
  { id: 'ai', label: 'AIForge', icon: Brain }
]

export const EngineBuilder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentMode, setCurrentMode] = useState(searchParams.get('mode') || 'game')
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTool, setActiveTool] = useState<string>('select')
  
  const { 
    isRunning, 
    renderStats, 
    startEngine, 
    stopEngine, 
    exportProject 
  } = useEngineStore()
  
  const { sendChatMessage } = useAIStore()

  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode && modes.some(m => m.id === mode)) {
      setCurrentMode(mode)
    }
  }, [searchParams])

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode)
    setSearchParams({ mode })
  }

  const handlePlay = () => {
    if (isPlaying) {
      stopEngine()
      setIsPlaying(false)
    } else {
      startEngine()
      setIsPlaying(true)
    }
  }

  const handleExport = async () => {
    await exportProject('html5')
  }

  const getModeContent = () => {
    switch (currentMode) {
      case 'game':
        return {
          title: 'GameForge Mode',
          description: 'Create 3D/2D games with AI-powered systems',
          placeholderText: '3D Game Viewport - Drop models, create terrain, add physics...'
        }
      case 'app':
        return {
          title: 'AppForge Mode',
          description: 'Build mobile & desktop apps with drag-drop UI',
          placeholderText: 'App Designer - Drag components, design screens, add logic...'
        }
      case 'web':
        return {
          title: 'WebForge Mode',
          description: 'Develop websites and web platforms',
          placeholderText: 'Web Designer - Create layouts, add components, style elements...'
        }
      case 'ai':
        return {
          title: 'AIForge Mode',
          description: 'Build AI agents and intelligent systems',
          placeholderText: 'AI Flow Designer - Connect nodes, create agents, design conversations...'
        }
      default:
        return {
          title: 'NebulaForge X',
          description: 'Universal development engine',
          placeholderText: 'Select a mode to begin creating...'
        }
    }
  }

  const modeContent = getModeContent()

  return (
    <BuilderContainer>
      <GenesisAI 
        currentMode={currentMode as 'game' | 'app' | 'web' | 'ai'} 
        onModeChange={handleModeChange}
      />
      
      <BuilderHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ModeSelector>
          <div className="mode-title">{modeContent.title}</div>
          {modes.map((mode) => (
            <ModeButton
              key={mode.id}
              active={currentMode === mode.id}
              onClick={() => handleModeChange(mode.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <mode.icon size={16} />
              {mode.label}
            </ModeButton>
          ))}
        </ModeSelector>
        
        <BuilderControls>
          <ControlButton
            variant="primary"
            onClick={handlePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Stop' : 'Play'}
          </ControlButton>
          
          <ControlButton
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            Export
          </ControlButton>
          
          <ControlButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={16} />
            Settings
          </ControlButton>
        </BuilderControls>
      </BuilderHeader>
      
      <BuilderContent>
        <Viewport
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FloatingTools>
            <ToolButton 
              active={activeTool === 'select'}
              onClick={() => setActiveTool('select')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye size={20} />
            </ToolButton>
            <ToolButton 
              active={activeTool === 'transform'}
              onClick={() => setActiveTool('transform')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Grid size={20} />
            </ToolButton>
            <ToolButton 
              active={activeTool === 'paint'}
              onClick={() => setActiveTool('paint')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Palette size={20} />
            </ToolButton>
            <ToolButton 
              active={activeTool === 'code'}
              onClick={() => setActiveTool('code')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Code size={20} />
            </ToolButton>
          </FloatingTools>
          
          <div className="viewport-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <Zap size={48} style={{ color: '#00d4ff', marginBottom: '16px' }} />
              <div style={{ color: '#ccc', fontSize: '1.2rem', marginBottom: '8px' }}>
                {modeContent.placeholderText}
              </div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>
                {modeContent.description}
              </div>
            </motion.div>
          </div>
        </Viewport>
        
        <PropertiesPanel
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>Properties</h3>
          
          <div className="property-group">
            <div className="group-title">Engine Stats</div>
            <div className="property-item">
              <span className="property-label">FPS</span>
              <span className="property-value">{renderStats.fps.toFixed(0)}</span>
            </div>
            <div className="property-item">
              <span className="property-label">Draw Calls</span>
              <span className="property-value">{renderStats.drawCalls}</span>
            </div>
            <div className="property-item">
              <span className="property-label">Triangles</span>
              <span className="property-value">{(renderStats.triangles / 1000).toFixed(1)}K</span>
            </div>
            <div className="property-item">
              <span className="property-label">Memory</span>
              <span className="property-value">{(renderStats.memoryUsage / 1024).toFixed(1)}MB</span>
            </div>
          </div>
          
          <div className="property-group">
            <div className="group-title">Mode Settings</div>
            <div className="property-item">
              <span className="property-label">Current Mode</span>
              <span className="property-value">{currentMode.toUpperCase()}</span>
            </div>
            <div className="property-item">
              <span className="property-label">Active Tool</span>
              <span className="property-value">{activeTool.toUpperCase()}</span>
            </div>
            <div className="property-item">
              <span className="property-label">Status</span>
              <span className="property-value">{isRunning ? 'Running' : 'Stopped'}</span>
            </div>
          </div>
        </PropertiesPanel>
      </BuilderContent>
    </BuilderContainer>
  )
}