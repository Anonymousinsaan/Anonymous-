import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styled from 'styled-components'
import { Play, Code, Zap, Users, Globe, Rocket, Star, ArrowRight, Github, Twitter } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <LandingContainer>
      <ParallaxBackground style={{ y }}>
        <div className="stars"></div>
        <div className="nebula"></div>
      </ParallaxBackground>

      {/* Navigation */}
      <Navigation>
        <NavBrand>
          <Logo>⚡</Logo>
          <span>NebulaForge X</span>
        </NavBrand>
        <NavLinks>
          <a href="#features">Features</a>
          <a href="#showcase">Showcase</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
          <a href="#community">Community</a>
        </NavLinks>
        <NavActions>
          <LoginButton>Sign In</LoginButton>
          <GetStartedButton onClick={onGetStarted}>
            Start Building <ArrowRight size={16} />
          </GetStartedButton>
        </NavActions>
      </Navigation>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroBadge>
              <Zap size={16} />
              <span>Powered by AI • Used by 10,000+ developers</span>
            </HeroBadge>
            
            <HeroTitle>
              Build Games with
              <GradientText> AI-Powered </GradientText>
              Precision
            </HeroTitle>
            
            <HeroDescription>
              The next-generation 3D game engine that combines visual scripting, 
              AI assistance, and real-time collaboration. Create amazing games 
              without writing a single line of code.
            </HeroDescription>
            
            <HeroActions>
              <PrimaryButton onClick={onGetStarted}>
                <Play size={20} />
                Start Building for Free
              </PrimaryButton>
              <SecondaryButton>
                <Github size={20} />
                View on GitHub
              </SecondaryButton>
            </HeroActions>
            
            <TrustIndicators>
              <span>Trusted by developers at</span>
              <CompanyLogos>
                <div>Unity</div>
                <div>Epic Games</div>
                <div>Blizzard</div>
                <div>Riot Games</div>
              </CompanyLogos>
            </TrustIndicators>
          </motion.div>
        </HeroContent>

        <HeroVisual>
          <motion.div
            animate={{ 
              x: mousePosition.x * 0.05,
              y: mousePosition.y * 0.05 
            }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <GameEnginePreview>
              <EngineWindow>
                <WindowHeader>
                  <div className="controls">
                    <span></span><span></span><span></span>
                  </div>
                  <span>NebulaForge X Studio</span>
                </WindowHeader>
                <WindowContent>
                  <Sidebar>
                    <SidebarItem active>🎮 Scene</SidebarItem>
                    <SidebarItem>🎨 Assets</SidebarItem>
                    <SidebarItem>🤖 AI Chat</SidebarItem>
                    <SidebarItem>🔗 API</SidebarItem>
                  </Sidebar>
                  <MainArea>
                    <Viewport>
                      <motion.div
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="cube"
                      ></motion.div>
                    </Viewport>
                  </MainArea>
                </WindowContent>
              </EngineWindow>
            </GameEnginePreview>
          </motion.div>
        </HeroVisual>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection id="features">
        <Container>
          <SectionHeader>
            <SectionTitle>Everything you need to build games</SectionTitle>
            <SectionDescription>
              Professional game development tools with AI assistance
            </SectionDescription>
          </SectionHeader>

          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon><Code /></FeatureIcon>
              <FeatureTitle>Visual Scripting</FeatureTitle>
              <FeatureDescription>
                Create game logic with drag-and-drop visual nodes. No coding required.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><Zap /></FeatureIcon>
              <FeatureTitle>AI-Powered Creation</FeatureTitle>
              <FeatureDescription>
                Generate games, characters, and assets using natural language prompts.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><Users /></FeatureIcon>
              <FeatureTitle>Real-time Collaboration</FeatureTitle>
              <FeatureDescription>
                Work with your team in real-time, just like Google Docs for game development.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><Globe /></FeatureIcon>
              <FeatureTitle>Multi-platform Export</FeatureTitle>
              <FeatureDescription>
                Deploy to web, mobile, desktop, and VR with one click.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><Rocket /></FeatureIcon>
              <FeatureTitle>NebulaLink API</FeatureTitle>
              <FeatureDescription>
                Integrate our game engine into your apps with our developer API.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon><Star /></FeatureIcon>
              <FeatureTitle>AI Monitoring</FeatureTitle>
              <FeatureDescription>
                VoidSentinel AI continuously monitors and optimizes your games.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      {/* Showcase Section */}
      <ShowcaseSection id="showcase">
        <Container>
          <SectionTitle>Games built with NebulaForge X</SectionTitle>
          <GameShowcase>
            <GameCard>
              <GamePreview style={{ background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' }}>
                <span>🚀</span>
              </GamePreview>
              <GameInfo>
                <h4>Space Explorer</h4>
                <p>3D Adventure • Made in 2 hours</p>
              </GameInfo>
            </GameCard>

            <GameCard>
              <GamePreview style={{ background: 'linear-gradient(45deg, #74b9ff, #0984e3)' }}>
                <span>🏰</span>
              </GamePreview>
              <GameInfo>
                <h4>Castle Defense</h4>
                <p>Strategy • AI-generated NPCs</p>
              </GameInfo>
            </GameCard>

            <GameCard>
              <GamePreview style={{ background: 'linear-gradient(45deg, #a29bfe, #6c5ce7)' }}>
                <span>🏃‍♂️</span>
              </GamePreview>
              <GameInfo>
                <h4>Pixel Runner</h4>
                <p>Platformer • Visual scripting only</p>
              </GameInfo>
            </GameCard>
          </GameShowcase>
        </Container>
      </ShowcaseSection>

      {/* CTA Section */}
      <CTASection>
        <Container>
          <CTAContent>
            <h2>Ready to build the next hit game?</h2>
            <p>Join thousands of developers creating amazing games with AI assistance.</p>
            <CTAButton onClick={onGetStarted}>
              Start Building for Free
              <ArrowRight size={20} />
            </CTAButton>
          </CTAContent>
        </Container>
      </CTASection>

      {/* Footer */}
      <Footer>
        <Container>
          <FooterContent>
            <FooterSection>
              <FooterBrand>
                <Logo>⚡</Logo>
                <span>NebulaForge X</span>
              </FooterBrand>
              <p>The future of game development is here.</p>
              <SocialLinks>
                <a href="#"><Twitter size={20} /></a>
                <a href="#"><Github size={20} /></a>
              </SocialLinks>
            </FooterSection>

            <FooterSection>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#showcase">Showcase</a>
              <a href="#api">API</a>
            </FooterSection>

            <FooterSection>
              <h4>Resources</h4>
              <a href="#docs">Documentation</a>
              <a href="#tutorials">Tutorials</a>
              <a href="#community">Community</a>
              <a href="#support">Support</a>
            </FooterSection>

            <FooterSection>
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </FooterSection>
          </FooterContent>
          
          <FooterBottom>
            <p>&copy; 2024 NebulaForge X. All rights reserved.</p>
            <p>Made with ❤️ for the game development community</p>
          </FooterBottom>
        </Container>
      </Footer>
    </LandingContainer>
  )
}

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%);
  color: white;
  overflow-x: hidden;
`

const ParallaxBackground = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  
  .stars {
    position: absolute;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(2px 2px at 20px 30px, rgba(0, 212, 255, 0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(0, 255, 157, 0.3), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255, 0, 150, 0.3), transparent);
    background-repeat: repeat;
    background-size: 200px 200px;
    animation: twinkle 20s linear infinite;
  }
  
  .nebula {
    position: absolute;
    top: 20%;
    right: 10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(100px);
  }
  
  @keyframes twinkle {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
`

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  z-index: 1000;
`

const NavBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
`

const Logo = styled.div`
  font-size: 32px;
`

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  
  a {
    color: #cccccc;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: #00d4ff;
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`

const NavActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`

const LoginButton = styled.button`
  background: transparent;
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
  }
`

const GetStartedButton = styled.button`
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-2px);
  }
`

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding: 120px 5% 80px;
  min-height: 100vh;
  align-items: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
`

const HeroContent = styled.div`
  max-width: 600px;
`

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 24px;
  color: #00d4ff;
`

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const GradientText = styled.span`
  background: linear-gradient(135deg, #00d4ff, #0099cc, #00ff9d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const HeroDescription = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  color: #cccccc;
  margin-bottom: 40px;
`

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border: none;
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
  }
`

const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
  }
`

const TrustIndicators = styled.div`
  color: #666;
  font-size: 14px;
  
  span {
    display: block;
    margin-bottom: 12px;
  }
`

const CompanyLogos = styled.div`
  display: flex;
  gap: 24px;
  
  div {
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    font-size: 12px;
    color: #999;
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`

const HeroVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const GameEnginePreview = styled.div`
  perspective: 1000px;
`

const EngineWindow = styled.div`
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  transform: rotateY(-10deg) rotateX(5deg);
  width: 600px;
  height: 400px;
`

const WindowHeader = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  
  .controls {
    display: flex;
    gap: 8px;
    
    span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff5f57;
      
      &:nth-child(2) { background: #ffbd2e; }
      &:nth-child(3) { background: #28ca42; }
    }
  }
  
  span {
    font-size: 14px;
    color: #cccccc;
  }
`

const WindowContent = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  height: calc(100% - 48px);
`

const Sidebar = styled.div`
  background: rgba(10, 10, 10, 0.8);
  padding: 16px;
  border-right: 1px solid rgba(0, 212, 255, 0.2);
`

const SidebarItem = styled.div<{ active?: boolean }>`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  cursor: pointer;
  background: ${props => props.active ? 'rgba(0, 212, 255, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#00d4ff' : '#cccccc'};
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }
`

const MainArea = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Viewport = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #1a1a2e, #16213e);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  .cube {
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, #00d4ff, #0099cc);
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  }
`

const FeaturesSection = styled.section`
  padding: 100px 0;
  background: rgba(10, 10, 10, 0.5);
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
`

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const SectionDescription = styled.p`
  font-size: 1.25rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`

const FeatureCard = styled.div`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-10px);
    border-color: #00d4ff;
    box-shadow: 0 20px 40px rgba(0, 212, 255, 0.1);
  }
`

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
`

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
`

const FeatureDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
`

const ShowcaseSection = styled.section`
  padding: 100px 0;
`

const GameShowcase = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 60px;
`

const GameCard = styled.div`
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`

const GamePreview = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`

const GameInfo = styled.div`
  padding: 20px;
  
  h4 {
    font-size: 1.25rem;
    margin-bottom: 8px;
  }
  
  p {
    color: #999;
    font-size: 14px;
  }
`

const CTASection = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 153, 204, 0.1));
  text-align: center;
`

const CTAContent = styled.div`
  h2 {
    font-size: 3rem;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    color: #cccccc;
    margin-bottom: 40px;
  }
`

const CTAButton = styled.button`
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border: none;
  color: white;
  padding: 20px 40px;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 212, 255, 0.3);
  }
`

const Footer = styled.footer`
  background: rgba(5, 5, 5, 0.9);
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  padding: 60px 0 20px;
`

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`

const FooterSection = styled.div`
  h4 {
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: #00d4ff;
  }
  
  a {
    display: block;
    color: #cccccc;
    text-decoration: none;
    margin-bottom: 12px;
    transition: color 0.3s;
    
    &:hover {
      color: #00d4ff;
    }
  }
  
  p {
    color: #999;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  
  a {
    width: 40px;
    height: 40px;
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00d4ff;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(0, 212, 255, 0.2);
      transform: translateY(-2px);
    }
  }
`

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #666;
  
  p {
    margin-bottom: 8px;
  }
`

export default LandingPage