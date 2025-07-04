import React, { memo, useCallback, useMemo, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

// Lazy load heavy components
const MonacoEditor = lazy(() => import('@monaco-editor/react'))
const ReactFlow = lazy(() => import('reactflow'))
const ThreeCanvas = lazy(() => import('@react-three/fiber').then(module => ({ default: module.Canvas })))

interface PerformanceOptimizerProps {
  children: React.ReactNode
  enableLazyLoading?: boolean
  enableVirtualization?: boolean
  enablePreloading?: boolean
}

// Optimized loading spinner
const LoadingSpinner = memo(() => (
  <LoadingWrapper>
    <motion.div
      className="spinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="glow-ring" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Initializing NebulaForge X...
    </motion.p>
  </LoadingWrapper>
))

// Optimized error boundary
const ErrorFallback = memo(({ error, resetError }: { error: Error, resetError: () => void }) => (
  <ErrorWrapper>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <h2>⚠️ System Error Detected</h2>
      <p>NebulaForge X encountered an unexpected error:</p>
      <code>{error.message}</code>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetError}
      >
        🔄 Restart System
      </motion.button>
    </motion.div>
  </ErrorWrapper>
))

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState({
    fps: 60,
    memory: 0,
    loadTime: 0,
    renderTime: 0
  })

  React.useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const measurePerformance = () => {
      const currentTime = performance.now()
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - lastTime))
        const memory = (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: Math.round(memory * 100) / 100
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measurePerformance)
    }
    
    measurePerformance()
  }, [])

  return metrics
}

// Virtualized list component for large datasets
export const VirtualizedList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 50,
  containerHeight = 400 
}: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemHeight?: number
  containerHeight?: number
}) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }))
  }, [items, scrollTop, itemHeight, containerHeight])
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])
  
  return (
    <VirtualContainer style={{ height: containerHeight }} onScroll={handleScroll}>
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </VirtualContainer>
  )
})

// Optimized image component with lazy loading
export const OptimizedImage = memo(({ 
  src, 
  alt, 
  width, 
  height,
  className 
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}) => {
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState(false)
  
  return (
    <ImageContainer className={className}>
      <AnimatePresence>
        {!loaded && !error && (
          <motion.div
            className="placeholder"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="shimmer" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: loaded ? 'block' : 'none' }}
      />
      
      {error && (
        <div className="error-placeholder">
          ❌ Image failed to load
        </div>
      )}
    </ImageContainer>
  )
})

// Main performance optimizer component
export const PerformanceOptimizer = memo(({ 
  children, 
  enableLazyLoading = true,
  enableVirtualization = true,
  enablePreloading = true 
}: PerformanceOptimizerProps) => {
  const metrics = usePerformanceMonitor()
  
  // Preload critical resources
  React.useEffect(() => {
    if (enablePreloading) {
      // Preload critical fonts
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
      link.as = 'style'
      document.head.appendChild(link)
      
      // Preload critical images
      const criticalImages = [
        '/logo.svg',
        '/icon-192x192.png',
        '/background-pattern.webp'
      ]
      
      criticalImages.forEach(src => {
        const img = new Image()
        img.src = src
      })
    }
  }, [enablePreloading])
  
  // Performance warning system
  React.useEffect(() => {
    if (metrics.fps < 30) {
      console.warn('⚠️ Low FPS detected:', metrics.fps)
    }
    if (metrics.memory > 100) {
      console.warn('⚠️ High memory usage:', metrics.memory + 'MB')
    }
  }, [metrics])
  
  return (
    <OptimizedWrapper>
      {/* Performance indicator */}
      <PerformanceIndicator>
        <div className="metric">
          <span className="label">FPS:</span>
          <span className={`value ${metrics.fps < 30 ? 'warning' : metrics.fps > 50 ? 'good' : 'ok'}`}>
            {metrics.fps}
          </span>
        </div>
        <div className="metric">
          <span className="label">Memory:</span>
          <span className={`value ${metrics.memory > 100 ? 'warning' : 'good'}`}>
            {metrics.memory}MB
          </span>
        </div>
      </PerformanceIndicator>
      
      {/* Optimized content */}
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </OptimizedWrapper>
  )
})

// Styled components with hardware acceleration
const LoadingWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
  color: #00d4ff;
  
  .spinner {
    width: 80px;
    height: 80px;
    position: relative;
    will-change: transform;
    
    .glow-ring {
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-top: 3px solid #00d4ff;
      border-radius: 50%;
      box-shadow: 0 0 20px #00d4ff40;
      will-change: transform;
    }
  }
  
  p {
    margin-top: 20px;
    font-size: 16px;
    font-weight: 300;
    text-align: center;
  }
`

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a0000 0%, #2e1a1a 50%, #3e1616 100%);
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
  
  h2 {
    color: #ff4757;
    margin-bottom: 20px;
  }
  
  code {
    background: #00000040;
    padding: 10px;
    border-radius: 8px;
    display: block;
    margin: 20px 0;
    color: #ffeaa7;
  }
  
  button {
    background: linear-gradient(135deg, #ff4757, #ff3742);
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    will-change: transform;
  }
`

const VirtualContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  will-change: scroll-position;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00d4ff40;
    border-radius: 4px;
  }
`

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  
  .placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .shimmer {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, #00d4ff20, transparent);
      animation: shimmer 1.5s infinite;
    }
  }
  
  .error-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: #1a1a1a;
    color: #666;
    font-size: 14px;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`

const OptimizedWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  will-change: auto;
`

const PerformanceIndicator = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: #00000080;
  backdrop-filter: blur(10px);
  border: 1px solid #00d4ff40;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  gap: 16px;
  font-size: 12px;
  z-index: 9999;
  
  .metric {
    display: flex;
    gap: 4px;
    
    .label {
      color: #999;
    }
    
    .value {
      font-weight: 600;
      
      &.good { color: #00ff88; }
      &.ok { color: #ffeb3b; }
      &.warning { color: #ff4757; }
    }
  }
`

export default PerformanceOptimizer