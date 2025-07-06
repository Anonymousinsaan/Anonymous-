import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Lock, User, Mail, Eye, EyeOff } from 'lucide-react'
import styled from 'styled-components'
import { useAuthStore } from '@/stores/authStore'

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
`

const BackgroundEffects = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
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
      radial-gradient(1px 1px at 90px 40px, rgba(255, 0, 150, 0.3), transparent);
    background-repeat: repeat;
    background-size: 200px 200px;
    animation: float 20s infinite linear;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`

const LoginCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px;
  backdrop-filter: blur(20px);
  width: 100%;
  max-width: 400px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  .logo {
    width: 64px;
    height: 64px;
    background: linear-gradient(45deg, #00d4ff, #00ff9d);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: white;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(45deg, #00d4ff, #00ff9d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }
  
  .subtitle {
    color: #ccc;
    font-size: 0.9rem;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const InputGroup = styled.div`
  position: relative;
  
  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px 16px;
    transition: all 0.3s ease;
    
    &:focus-within {
      border-color: #00d4ff;
      box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
    }
    
    .icon {
      color: rgba(255, 255, 255, 0.5);
      margin-right: 12px;
    }
    
    input {
      background: none;
      border: none;
      color: white;
      outline: none;
      font-size: 14px;
      flex: 1;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
    
    .toggle-visibility {
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 4px;
      
      &:hover {
        color: white;
      }
    }
  }
  
  .label {
    font-size: 14px;
    font-weight: 500;
    color: white;
    margin-bottom: 8px;
  }
`

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const ModeToggle = styled.div`
  text-align: center;
  margin-top: 24px;
  
  .toggle-text {
    color: #ccc;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .toggle-button {
    background: none;
    border: none;
    color: #00d4ff;
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;
    
    &:hover {
      color: #00ff9d;
    }
  }
`

const ErrorMessage = styled(motion.div)`
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #ff4757;
  font-size: 14px;
  text-align: center;
`

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { login, register, loading, error } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLogin) {
      await login(formData.username, formData.password)
    } else {
      if (formData.password !== formData.confirmPassword) {
        return
      }
      await register(formData.username, formData.email, formData.password)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <LoginContainer>
      <BackgroundEffects />
      
      <LoginCard
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <div className="logo">
            <Sparkles size={28} />
          </div>
          <div className="title">NebulaForge X</div>
          <div className="subtitle">AI-Powered Development Engine</div>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <div className="label">Username</div>
            <div className="input-container">
              <User className="icon" size={20} />
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
            </div>
          </InputGroup>
          
          {!isLogin && (
            <InputGroup>
              <div className="label">Email</div>
              <div className="input-container">
                <Mail className="icon" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </InputGroup>
          )}
          
          <InputGroup>
            <div className="label">Password</div>
            <div className="input-container">
              <Lock className="icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <div
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </InputGroup>
          
          {!isLogin && (
            <InputGroup>
              <div className="label">Confirm Password</div>
              <div className="input-container">
                <Lock className="icon" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <div
                  className="toggle-visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </InputGroup>
          )}
          
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}
          
          <SubmitButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </SubmitButton>
        </Form>
        
        <ModeToggle>
          <div className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </div>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </ModeToggle>
      </LoginCard>
    </LoginContainer>
  )
}