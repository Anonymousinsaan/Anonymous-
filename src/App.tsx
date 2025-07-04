import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'

// Core components
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { NebulaTheme } from '@/components/ui/NebulaTheme'
import { Header } from '@/components/ui/Header'
import { Sidebar } from '@/components/ui/Sidebar'
import { BackgroundEffects } from '@/components/ui/BackgroundEffects'

// Pages
import { LoginPage } from '@/components/auth/LoginPage'
import { Dashboard } from '@/components/ui/Dashboard'
import { EngineBuilder } from '@/components/engine/EngineBuilder'
import { AIChat } from '@/components/ai/AIChat'
import { AssetForge } from '@/components/builder/AssetForge'
import { ProjectManager } from '@/components/builder/ProjectManager'
import { VisualScripting } from '@/components/builder/VisualScripting'
import { MultiplayerLobby } from '@/components/engine/MultiplayerLobby'
import { SentinelMonitor } from '@/components/ai/SentinelMonitor'

// Hooks and stores
import { useAuthStore } from '@/stores/authStore'
import { useEngineStore } from '@/stores/engineStore'
import { useAIStore } from '@/stores/aiStore'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%);
    color: #ffffff;
    overflow: hidden;
  }

  #root {
    height: 100vh;
    width: 100vw;
    position: relative;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #00d4ff, #0099cc);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #00e6ff, #00b3e6);
  }

  /* Futuristic selection */
  ::selection {
    background: rgba(0, 212, 255, 0.3);
    color: #ffffff;
  }

  /* Animations */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
    50% { box-shadow: 0 0 30px rgba(0, 212, 255, 0.6); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  /* Loading animations */
  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`

const MainContent = styled(motion.main)`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  z-index: 1;
`

const ContentArea = styled(motion.div)`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`

const FloatingParticles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
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
  }
`

function App() {
  const { isAuthenticated, user, initializeAuth } = useAuthStore()
  const { initializeEngine } = useEngineStore()
  const { initializeAI, connectWebSocket } = useAIStore()

  useEffect(() => {
    // Initialize all systems
    const initialize = async () => {
      try {
        await initializeAuth()
        await initializeEngine()
        await initializeAI()
        await connectWebSocket()
      } catch (error) {
        console.error('Failed to initialize NebulaForge X:', error)
      }
    }

    initialize()
  }, [initializeAuth, initializeEngine, initializeAI, connectWebSocket])

  return (
    <ThemeProvider theme={NebulaTheme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <FloatingParticles />
          <BackgroundEffects />
          
          <AnimatePresence mode="wait">
            {!isAuthenticated ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: '100%', height: '100%' }}
              >
                <LoginPage />
              </motion.div>
            ) : (
              <motion.div
                key="app"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: '100%', height: '100%', display: 'flex' }}
              >
                <Sidebar />
                <MainContent>
                  <Header />
                  <ContentArea>
                    <Suspense fallback={<LoadingScreen />}>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/builder" element={<EngineBuilder />} />
                        <Route path="/ai-chat" element={<AIChat />} />
                        <Route path="/asset-forge" element={<AssetForge />} />
                        <Route path="/projects" element={<ProjectManager />} />
                        <Route path="/visual-scripting" element={<VisualScripting />} />
                        <Route path="/multiplayer" element={<MultiplayerLobby />} />
                        <Route path="/sentinel" element={<SentinelMonitor />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Suspense>
                  </ContentArea>
                </MainContent>
              </motion.div>
            )}
          </AnimatePresence>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(10, 10, 10, 0.9)',
                color: '#ffffff',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 212, 255, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#00ff9d',
                  secondary: '#000000',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff4757',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </AppContainer>
      </Router>
    </ThemeProvider>
  )
}

export default App