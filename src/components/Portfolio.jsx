import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { 
  OrbitControls, 
  Text, 
  Box, 
  Sphere, 
  Cylinder,
  Environment, 
  ContactShadows, 
  RoundedBox, 
  MeshReflectorMaterial,
  Float,
  Stars,
  Cloud,
  Sparkles,
  PresentationControls,
  Html
} from '@react-three/drei'
import * as THREE from 'three'

// Premium color palette
const colors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  dark: '#0f172a',
  light: '#f1f5f9',
  gold: '#fbbf24'
}

// Animated Developer Character
function DeveloperCharacter({ position }) {
  const groupRef = useRef()
  const [typing, setTyping] = useState(true)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      
      // Typing animation for hands
      if (typing) {
        const leftHand = groupRef.current.children[3]
        const rightHand = groupRef.current.children[4]
        if (leftHand && rightHand) {
          leftHand.rotation.x = -1.2 + Math.sin(state.clock.elapsedTime * 8) * 0.1
          rightHand.rotation.x = -1.2 + Math.cos(state.clock.elapsedTime * 8) * 0.1
        }
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <Sphere position={[0, 1.6, 0]} args={[0.15, 32, 32]}>
        <meshStandardMaterial color="#ffdbac" />
      </Sphere>
      
      {/* Body */}
      <Box position={[0, 1.2, 0]} args={[0.3, 0.4, 0.2]}>
        <meshStandardMaterial color="#2563eb" />
      </Box>
      
      {/* Chair */}
      <Box position={[0, 0.8, 0]} args={[0.4, 0.05, 0.4]}>
        <meshStandardMaterial color="#1e293b" />
      </Box>
      
      {/* Left Arm */}
      <Box position={[-0.2, 1.1, -0.2]} args={[0.08, 0.3, 0.08]} rotation={[-1.2, 0, 0.2]}>
        <meshStandardMaterial color="#ffdbac" />
      </Box>
      
      {/* Right Arm */}
      <Box position={[0.2, 1.1, -0.2]} args={[0.08, 0.3, 0.08]} rotation={[-1.2, 0, -0.2]}>
        <meshStandardMaterial color="#ffdbac" />
      </Box>
    </group>
  )
}

// Detailed Desk Setup
function DeskSetup({ position }) {
  const monitorRef = useRef()
  const [screenGlow, setScreenGlow] = useState(0)
  
  useFrame((state) => {
    // Animate screen glow
    setScreenGlow(0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    
    // Subtle monitor animation
    if (monitorRef.current) {
      monitorRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
    }
  })
  
  return (
    <group position={position}>
      {/* Desk Surface */}
      <Box position={[0, 0, 0]} args={[2, 0.05, 1]}>
        <meshStandardMaterial color="#8b4513" roughness={0.3} metalness={0.1} />
      </Box>
      
      {/* Desk Legs */}
      <Box position={[-0.9, -0.4, -0.4]} args={[0.05, 0.8, 0.05]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[0.9, -0.4, -0.4]} args={[0.05, 0.8, 0.05]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[-0.9, -0.4, 0.4]} args={[0.05, 0.8, 0.05]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[0.9, -0.4, 0.4]} args={[0.05, 0.8, 0.05]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      
      {/* Monitor */}
      <group ref={monitorRef} position={[0, 0.4, -0.3]}>
        {/* Screen */}
        <Box args={[0.8, 0.5, 0.02]}>
          <meshStandardMaterial 
            color="#000000" 
            emissive="#6366f1"
            emissiveIntensity={screenGlow}
          />
        </Box>
        {/* Monitor Stand */}
        <Box position={[0, -0.3, 0]} args={[0.15, 0.1, 0.15]}>
          <meshStandardMaterial color="#1e293b" />
        </Box>
      </group>
      
      {/* Keyboard */}
      <Box position={[0, 0.03, 0.2]} args={[0.4, 0.02, 0.15]}>
        <meshStandardMaterial color="#1e293b" />
      </Box>
      
      {/* Mouse */}
      <Box position={[0.35, 0.03, 0.2]} args={[0.06, 0.02, 0.08]}>
        <meshStandardMaterial color="#1e293b" />
      </Box>
      
      {/* Coffee Mug */}
      <group position={[-0.6, 0.08, 0]}>
        <Cylinder args={[0.04, 0.04, 0.08]}>
          <meshStandardMaterial color="#ffffff" />
        </Cylinder>
        {/* Coffee */}
        <Cylinder position={[0, 0.02, 0]} args={[0.035, 0.035, 0.04]}>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
      </group>
      
      {/* Plant */}
      <group position={[0.6, 0.1, -0.3]}>
        {/* Pot */}
        <Cylinder args={[0.05, 0.04, 0.08]}>
          <meshStandardMaterial color="#8b4513" />
        </Cylinder>
        {/* Plant */}
        <Sphere position={[0, 0.08, 0]} args={[0.06, 8, 8]}>
          <meshStandardMaterial color="#228b22" />
        </Sphere>
      </group>
      
      {/* Laptop (second screen) */}
      <group position={[0.5, 0.03, 0]}>
        <Box args={[0.3, 0.01, 0.2]}>
          <meshStandardMaterial color="#1e293b" />
        </Box>
        <Box position={[0, 0.1, -0.1]} args={[0.28, 0.18, 0.01]} rotation={[-0.3, 0, 0]}>
          <meshStandardMaterial 
            color="#000000"
            emissive="#ec4899"
            emissiveIntensity={screenGlow * 0.5}
          />
        </Box>
      </group>
    </group>
  )
}

// Floating Code Snippets
function FloatingCode({ position }) {
  const codeRef = useRef()
  
  useFrame((state) => {
    if (codeRef.current) {
      codeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
      codeRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  const codeLines = [
    'const create = () => {',
    '  return magic;',
    '}'
  ]
  
  return (
    <group ref={codeRef} position={position}>
      {codeLines.map((line, index) => (
        <Text
          key={index}
          position={[0, -index * 0.15, 0]}
          fontSize={0.1}
          color="#00ffff"
          font="https://fonts.gstatic.com/s/firacode/v21/uU9dCBsR6Z2vfE9aq3bpdva.woff"
          anchorX="left"
        >
          {line}
        </Text>
      ))}
    </group>
  )
}

// Tech Icons Floating
function FloatingTechIcons() {
  const icons = ['⚛️', '🚀', '💻', '🎨', '⚡']
  
  return (
    <>
      {icons.map((icon, index) => (
        <Float
          key={index}
          speed={1 + index * 0.2}
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <Text
            position={[
              -3 + index * 1.5,
              2 + Math.sin(index) * 0.5,
              -2
            ]}
            fontSize={0.3}
            color="#ffffff"
          >
            {icon}
          </Text>
        </Float>
      ))}
    </>
  )
}

// Glass morphism panel
function GlassPanel({ children, position, args = [4, 3, 0.1] }) {
  return (
    <group position={position}>
      <RoundedBox args={args} radius={0.1}>
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          thickness={0.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </RoundedBox>
      {children}
    </group>
  )
}

// 3D Scene Component
function Scene3D({ section }) {
  return (
    <>
      {/* Dramatic Lighting Setup */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Monitor glow lights */}
      <pointLight position={[0, 1, -2]} color="#6366f1" intensity={0.5} />
      <pointLight position={[2, 1, -2]} color="#ec4899" intensity={0.3} />
      
      {/* Ambient colored lights */}
      <pointLight position={[-5, 3, 5]} color="#00ffff" intensity={0.3} />
      <pointLight position={[5, 3, -5]} color="#fbbf24" intensity={0.2} />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" color="#0a0a23" near={5} far={20} />
      
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      {/* Main Workspace Scene */}
      <group position={[0, -1, -3]} rotation={[0, -0.2, 0]}>
        <DeskSetup position={[0, 0, 0]} />
        <DeveloperCharacter position={[0, 0, 0.5]} />
      </group>
      
      {/* Floating Elements */}
      <FloatingTechIcons />
      
      {/* Floating Code Snippets */}
      <FloatingCode position={[-3, 1, -2]} />
      <FloatingCode position={[3, 0.5, -2.5]} />
      
      {/* Additional floating code for depth */}
      {section === 1 && (
        <>
          <FloatingCode position={[-2, 2, -1]} />
          <FloatingCode position={[2, 1.5, -3]} />
        </>
      )}
      
      {/* Particle effects */}
      <Sparkles
        count={100}
        scale={15}
        size={1}
        speed={0.2}
        color="#ffffff"
        opacity={0.3}
      />
      
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={0.8}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a23"
          metalness={0.2}
        />
      </mesh>
      
      {/* Floating geometric shapes for visual interest */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Box position={[-4, 2, -5]} args={[0.3, 0.3, 0.3]}>
          <meshStandardMaterial 
            color={colors.primary} 
            wireframe
            emissive={colors.primary}
            emissiveIntensity={0.2}
          />
        </Box>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <Sphere position={[4, 1.5, -4]} args={[0.2, 16, 16]}>
          <meshStandardMaterial 
            color={colors.accent}
            wireframe
            emissive={colors.accent}
            emissiveIntensity={0.3}
          />
        </Sphere>
      </Float>
      
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="gradient-text">Shaan Soni</span>
          </h1>
          <p className="hero-subtitle">Full Stack Developer & Creative Technologist</p>
          <p className="hero-description">
            Crafting exceptional digital experiences with cutting-edge technologies
            and innovative design thinking.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">View Projects</button>
            <button className="btn-secondary">Download CV</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <h3>50+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="stat-card">
            <h3>5+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat-card">
            <h3>30+</h3>
            <p>Happy Clients</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Achievements Section
function AchievementsSection() {
  const achievements = [
    {
      year: '2024',
      title: 'Best Innovation Award',
      org: 'Tech Summit 2024',
      description: 'Recognized for developing an AI-powered healthcare solution',
      icon: '🏆'
    },
    {
      year: '2023',
      title: 'Google Developer Expert',
      org: 'Google',
      description: 'Selected as GDE for Web Technologies',
      icon: '🎯'
    },
    {
      year: '2023',
      title: 'Open Source Contributor',
      org: 'GitHub',
      description: 'Top 100 contributors in React ecosystem',
      icon: '⭐'
    },
    {
      year: '2022',
      title: 'Hackathon Winner',
      org: 'Global Hack Week',
      description: 'First place for innovative blockchain solution',
      icon: '🥇'
    }
  ]

  return (
    <section className="achievements-section">
      <div className="section-header">
        <h2 className="section-title">Achievements & Recognition</h2>
        <p className="section-subtitle">Milestones in my professional journey</p>
      </div>
      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <div key={index} className="achievement-card">
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-year">{achievement.year}</div>
            <h3 className="achievement-title">{achievement.title}</h3>
            <p className="achievement-org">{achievement.org}</p>
            <p className="achievement-description">{achievement.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Skills Section
function SkillsSection() {
  const skills = {
    'Frontend': ['React', 'Three.js', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    'Backend': ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL'],
    'Tools': ['Docker', 'AWS', 'Git', 'Figma', 'Kubernetes'],
    'Creative': ['3D Modeling', 'WebGL', 'Animation', 'UI/UX Design']
  }

  return (
    <section className="skills-section">
      <div className="section-header">
        <h2 className="section-title">Technical Expertise</h2>
        <p className="section-subtitle">Technologies I work with</p>
      </div>
      <div className="skills-container">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="skill-category">
            <h3 className="category-title">{category}</h3>
            <div className="skill-tags">
              {items.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Projects Section
function ProjectsSection() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack marketplace with real-time features',
      tech: ['React', 'Node.js', 'MongoDB'],
      image: '🛍️',
      link: '#'
    },
    {
      title: '3D Portfolio',
      description: 'Interactive 3D website with Three.js',
      tech: ['Three.js', 'React', 'WebGL'],
      image: '🎮',
      link: '#'
    },
    {
      title: 'AI Chat Application',
      description: 'Real-time chat with AI integration',
      tech: ['Python', 'React', 'OpenAI'],
      image: '🤖',
      link: '#'
    },
    {
      title: 'Blockchain DApp',
      description: 'Decentralized application on Ethereum',
      tech: ['Solidity', 'Web3.js', 'React'],
      image: '⛓️',
      link: '#'
    }
  ]

  return (
    <section className="projects-section">
      <div className="section-header">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">Recent work I'm proud of</p>
      </div>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-image">{project.image}</div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.tech.map((tech, i) => (
                <span key={i} className="tech-badge">{tech}</span>
              ))}
            </div>
            <a href={project.link} className="project-link">View Project →</a>
          </div>
        ))}
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  return (
    <section className="contact-section">
      <div className="section-header">
        <h2 className="section-title">Let's Connect</h2>
        <p className="section-subtitle">Ready to bring your ideas to life</p>
      </div>
      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <div>
              <h4>Email</h4>
              <p>shaan.soni@example.com</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">💼</span>
            <div>
              <h4>LinkedIn</h4>
              <p>linkedin.com/in/shaansoni</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🐙</span>
            <div>
              <h4>GitHub</h4>
              <p>github.com/shaansoni</p>
            </div>
          </div>
        </div>
        <div className="contact-form">
          <input type="text" placeholder="Your Name" className="form-input" />
          <input type="email" placeholder="Your Email" className="form-input" />
          <textarea placeholder="Your Message" className="form-textarea" rows="4"></textarea>
          <button className="btn-primary">Send Message</button>
        </div>
      </div>
    </section>
  )
}

// Main Portfolio Component
export default function Portfolio() {
  const [currentSection, setCurrentSection] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.floor(scrollPosition / windowHeight)
      setCurrentSection(section)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="portfolio-container">
      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas 
          camera={{ position: [5, 2, 8], fov: 75 }}
          style={{ background: '#0a0a23' }}
        >
          <Suspense fallback={null}>
            {/* Basic Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            {/* Simple Test Cube */}
            <Box position={[0, 0, 0]} args={[2, 2, 2]}>
              <meshStandardMaterial color="#6366f1" wireframe />
            </Box>
            
            {/* Stars Background */}
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
            
            <OrbitControls autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Content Sections */}
      <div className="content-wrapper">
        <HeroSection />
        <AchievementsSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </div>
      
      {/* Navigation Dots */}
      <div className="nav-dots">
        {['Home', 'Achievements', 'Skills', 'Projects', 'Contact'].map((label, index) => (
          <div
            key={index}
            className={`nav-dot ${currentSection === index ? 'active' : ''}`}
            onClick={() => window.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })}
            title={label}
          />
        ))}
      </div>
    </div>
  )
}
