const fs = require('fs');
const path = require('path');

// Define all missing components
const components = [
  // UI Components
  { path: 'src/components/ui/LoadingScreen.tsx', name: 'LoadingScreen' },
  { path: 'src/components/ui/NebulaTheme.ts', name: 'NebulaTheme', isTheme: true },
  { path: 'src/components/ui/Dashboard.tsx', name: 'Dashboard' },
  
  // Auth Components
  { path: 'src/components/auth/LoginPage.tsx', name: 'LoginPage' },
  
  // Engine Components
  { path: 'src/components/engine/EngineBuilder.tsx', name: 'EngineBuilder' },
  { path: 'src/components/engine/MultiplayerLobby.tsx', name: 'MultiplayerLobby' },
  
  // AI Components
  { path: 'src/components/ai/AIChat.tsx', name: 'AIChat' },
  { path: 'src/components/ai/SentinelMonitor.tsx', name: 'SentinelMonitor' },
  
  // Builder Components
  { path: 'src/components/builder/AssetForge.tsx', name: 'AssetForge' },
  { path: 'src/components/builder/ProjectManager.tsx', name: 'ProjectManager' },
  { path: 'src/components/builder/VisualScripting.tsx', name: 'VisualScripting' },
];

// Create component template
const createComponent = (name) => `import React from 'react'
import styled from 'styled-components'

export const ${name}: React.FC = () => {
  return (
    <Container>
      <Title>${name}</Title>
      <Description>
        Welcome to ${name}! This component is ready for development.
      </Description>
      <Placeholder>
        🚀 NebulaForge X - ${name} Module
      </Placeholder>
    </Container>
  )
}

const Container = styled.div\`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
\`

const Title = styled.h1\`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #00d4ff, #0099cc, #00ff9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
\`

const Description = styled.p\`
  font-size: 1.1rem;
  color: #cccccc;
  margin-bottom: 32px;
  max-width: 600px;
  line-height: 1.6;
\`

const Placeholder = styled.div\`
  background: rgba(0, 212, 255, 0.1);
  border: 2px dashed rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  padding: 40px;
  font-size: 1.25rem;
  color: #00d4ff;
  font-weight: 600;
\`

export default ${name}
`;

// Create theme template
const createTheme = () => `export const NebulaTheme = {
  colors: {
    primary: '#00d4ff',
    secondary: '#0099cc',
    accent: '#00ff9d',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: 'rgba(0, 212, 255, 0.2)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
  animations: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },
};

export default NebulaTheme;
`;

// Create stores
const createStore = (name, storeType) => `import { create } from 'zustand'

interface ${name}State {
  // Add your state properties here
  isInitialized: boolean
  data: any
}

interface ${name}Actions {
  // Add your actions here
  initialize${name}: () => Promise<void>
  ${storeType === 'ai' ? 'connectWebSocket: () => Promise<void>' : ''}
  ${storeType === 'auth' ? 'initializeAuth: () => Promise<void>' : ''}
  ${storeType === 'engine' ? 'initializeEngine: () => Promise<void>' : ''}
}

export const use${name}Store = create<${name}State & ${name}Actions>((set, get) => ({
  // Initial state
  isInitialized: false,
  data: null,
  
  // Actions
  initialize${name}: async () => {
    try {
      console.log('Initializing ${name}...')
      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize ${name}:', error)
    }
  },
  
  ${storeType === 'ai' ? `connectWebSocket: async () => {
    try {
      console.log('Connecting WebSocket...')
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  },
  
  initializeAI: async () => {
    try {
      console.log('Initializing AI...')
      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize AI:', error)
    }
  },` : ''}
  
  ${storeType === 'auth' ? `initializeAuth: async () => {
    try {
      console.log('Initializing Auth...')
      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize Auth:', error)
    }
  },
  
  isAuthenticated: true, // Demo mode` : ''}
  
  ${storeType === 'engine' ? `initializeEngine: async () => {
    try {
      console.log('Initializing Engine...')
      set({ isInitialized: true })
    } catch (error) {
      console.error('Failed to initialize Engine:', error)
    }
  },` : ''}
}))
`;

// Create directories and files
const createDirectories = () => {
  const dirs = [
    'src/components/auth',
    'src/components/ui', 
    'src/components/engine',
    'src/components/ai',
    'src/components/builder',
    'src/stores'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Main function
const main = () => {
  console.log('Creating missing components...');
  
  createDirectories();
  
  // Create components
  components.forEach(({ path: filePath, name, isTheme }) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const content = isTheme ? createTheme() : createComponent(name);
    fs.writeFileSync(filePath, content);
    console.log(`Created: ${filePath}`);
  });
  
  // Create stores if they don't exist
  const stores = [
    { path: 'src/stores/authStore.ts', name: 'Auth', type: 'auth' },
    { path: 'src/stores/engineStore.ts', name: 'Engine', type: 'engine' },
    { path: 'src/stores/aiStore.ts', name: 'AI', type: 'ai' },
  ];
  
  stores.forEach(({ path: filePath, name, type }) => {
    if (!fs.existsSync(filePath)) {
      const content = createStore(name, type);
      fs.writeFileSync(filePath, content);
      console.log(`Created: ${filePath}`);
    }
  });
  
  console.log('All components created successfully!');
};

main();