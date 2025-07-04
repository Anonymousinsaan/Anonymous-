// Authentication Store for NebulaForge X
// Using a simple implementation that can be enhanced with Zustand later

import React from 'react'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  joinedAt: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
}

class AuthStore {
  private state: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  }

  private listeners: Set<() => void> = new Set()

  getState = () => this.state

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify = () => {
    this.listeners.forEach(listener => listener())
  }

  private setState = (newState: Partial<AuthState>) => {
    this.state = { ...this.state, ...newState }
    this.notify()
  }

  initializeAuth = async () => {
    this.setState({ loading: true })
    
    try {
      // Check for stored auth data
      const storedUser = localStorage.getItem('nebulaforge_user')
      const storedToken = localStorage.getItem('nebulaforge_token')
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser)
        this.setState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: 'Failed to initialize authentication'
      })
    }
  }

  login = async (username: string, password: string) => {
    this.setState({ loading: true, error: null })
    
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, create a mock user
      const user: User = {
        id: 'demo-user-1',
        username,
        email: `${username}@example.com`,
        plan: 'pro',
        joinedAt: new Date().toISOString()
      }
      
      // Store auth data
      localStorage.setItem('nebulaforge_user', JSON.stringify(user))
      localStorage.setItem('nebulaforge_token', 'demo-token-' + Date.now())
      
      this.setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      })
      
      return { success: true }
    } catch (error) {
      this.setState({
        loading: false,
        error: 'Invalid credentials'
      })
      return { success: false, error: 'Invalid credentials' }
    }
  }

  logout = async () => {
    // Clear stored auth data
    localStorage.removeItem('nebulaforge_user')
    localStorage.removeItem('nebulaforge_token')
    
    this.setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    })
  }

  register = async (username: string, email: string, password: string) => {
    this.setState({ loading: true, error: null })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user: User = {
        id: 'new-user-' + Date.now(),
        username,
        email,
        plan: 'free',
        joinedAt: new Date().toISOString()
      }
      
      localStorage.setItem('nebulaforge_user', JSON.stringify(user))
      localStorage.setItem('nebulaforge_token', 'new-token-' + Date.now())
      
      this.setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null
      })
      
      return { success: true }
    } catch (error) {
      this.setState({
        loading: false,
        error: 'Registration failed'
      })
      return { success: false, error: 'Registration failed' }
    }
  }
}

// Create singleton instance
const authStore = new AuthStore()

// Custom hook for using the auth store
export const useAuthStore = () => {
  const [state, setState] = React.useState(authStore.getState())
  
  React.useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setState(authStore.getState())
    })
    return unsubscribe
  }, [])
  
  return {
    ...state,
    initializeAuth: authStore.initializeAuth,
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register
  }
}

// For backwards compatibility
export default authStore