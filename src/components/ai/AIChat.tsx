import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Zap, Brain, Eye, Settings } from 'lucide-react'
import styled from 'styled-components'
import { useAIStore } from '@/stores/aiStore'

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
`

const ChatHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  .title {
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
  }
  
  .subtitle {
    font-size: 0.9rem;
    color: #00d4ff;
    margin-top: 4px;
  }
`

const ModuleSelector = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const ModuleButton = styled(motion.button)<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.active ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: ${props => props.active ? '#00d4ff' : 'white'};
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
    color: #00d4ff;
  }
`

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const MessageBubble = styled(motion.div)<{ isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.isUser ? 'linear-gradient(45deg, #00d4ff, #00ff9d)' : 'linear-gradient(45deg, #ff6b6b, #feca57)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .message-content {
    background: ${props => props.isUser ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    border: 1px solid ${props => props.isUser ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
    border-radius: 16px;
    padding: 12px 16px;
    color: white;
    font-size: 14px;
    line-height: 1.4;
    
    .timestamp {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 8px;
    }
  }
`

const SystemMessage = styled(motion.div)`
  align-self: center;
  background: rgba(0, 255, 157, 0.1);
  border: 1px solid rgba(0, 255, 157, 0.3);
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 13px;
  color: #00ff9d;
  text-align: center;
  max-width: 80%;
`

const ChatInput = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  .input-container {
    flex: 1;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    padding: 12px 16px;
    
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
  }
`

const SendButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(0, 212, 255, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

export const AIChat: React.FC = () => {
  const [message, setMessage] = useState('')
  const [selectedModule, setSelectedModule] = useState('nebulavoid')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { 
    chatHistory, 
    sendChatMessage, 
    loading,
    modules,
    getAllModuleStatuses
  } = useAIStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSendMessage = () => {
    if (!message.trim() || loading) return
    
    sendChatMessage(message)
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const activeModules = getAllModuleStatuses().filter(m => m.status === 'active')

  return (
    <ChatContainer>
      <ChatHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="title">AI Chat</div>
          <div className="subtitle">Talk to your AI development team</div>
        </div>
        
        <ModuleSelector>
          {activeModules.slice(0, 4).map((module) => (
            <ModuleButton
              key={module.id}
              active={selectedModule === module.id}
              onClick={() => setSelectedModule(module.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {module.id === 'nebulavoid' && <Brain size={14} />}
              {module.id === 'sentinelflux' && <Eye size={14} />}
              {module.id === 'stellarforge' && <Zap size={14} />}
              {module.id === 'aethercore' && <Settings size={14} />}
              {module.name.split(' ')[0]}
            </ModuleButton>
          ))}
        </ModuleSelector>
      </ChatHeader>
      
      <ChatMessages>
        <AnimatePresence>
          {chatHistory.map((msg, index) => (
            <div key={msg.id}>
              {msg.type === 'system' ? (
                <SystemMessage
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.content}
                </SystemMessage>
              ) : (
                <MessageBubble
                  isUser={msg.type === 'user'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="avatar">
                    {msg.type === 'user' ? (
                      <User size={20} />
                    ) : (
                      <Bot size={20} />
                    )}
                  </div>
                  <div className="message-content">
                    {msg.content}
                    <div className="timestamp">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </MessageBubble>
              )}
            </div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </ChatMessages>
      
      <ChatInput
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI to build anything..."
            disabled={loading}
          />
        </div>
        <SendButton
          onClick={handleSendMessage}
          disabled={!message.trim() || loading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Send size={20} />
        </SendButton>
      </ChatInput>
    </ChatContainer>
  )
}