import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Environment, ContactShadows, RoundedBox, Cylinder, Torus, Html } from '@react-three/drei'
import * as THREE from 'three'

// Sound effect function
const playClickSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.1)
}

// Mouse-following floating elements
function FloatingOrb({ position, color, size = 0.3 }) {
  const meshRef = useRef()
  const { mouse, viewport } = useThree()
  
  useFrame((state) => {
    if (meshRef.current) {
      // Follow mouse with smooth interpolation
      const x = (mouse.x * viewport.width) / 8
      const y = (mouse.y * viewport.height) / 8
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0] + x, 0.02)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + y, 0.02)
      
      // Gentle floating animation
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 2) * 0.2
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })
  
  return (
    <Sphere 
      ref={meshRef} 
      position={position} 
      args={[size, 32, 32]}
      onClick={() => playClickSound()}
    >
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </Sphere>
  )
}

// Interactive workspace desk
function WorkspaceDesk() {
  const deskRef = useRef()
  
  useFrame((state) => {
    if (deskRef.current) {
      deskRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })
  
  return (
    <group ref={deskRef}>
      {/* Desk surface */}
      <RoundedBox 
        position={[0, -1, 0]} 
        args={[6, 0.2, 3]} 
        radius={0.1}
        onClick={() => playClickSound()}
      >
        <meshStandardMaterial color="#8B4513" />
      </RoundedBox>
      
      {/* Desk legs */}
      {[[-2.5, -2, -1], [2.5, -2, -1], [-2.5, -2, 1], [2.5, -2, 1]].map((pos, i) => (
        <Cylinder key={i} position={pos} args={[0.1, 0.1, 2]}>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
      ))}
    </group>
  )
}

// Interactive computer setup
function ComputerSetup() {
  const [hovered, setHovered] = useState(false)
  const screenRef = useRef()
  
  useFrame((state) => {
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = hovered ? 0.3 : 0.1
    }
  })
  
  return (
    <group position={[0, -0.5, -0.5]}>
      {/* Monitor */}
      <RoundedBox 
        ref={screenRef}
        position={[0, 0.5, 0]} 
        args={[2.5, 1.5, 0.1]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => playClickSound()}
      >
        <meshStandardMaterial 
          color="#1a1a1a" 
          emissive="#0066ff" 
          emissiveIntensity={0.1}
        />
      </RoundedBox>
      
      {/* Monitor stand */}
      <Cylinder position={[0, -0.2, 0]} args={[0.3, 0.3, 0.4]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
      
      {/* Keyboard */}
      <RoundedBox 
        position={[0, -0.85, 0.8]} 
        args={[1.8, 0.1, 0.6]}
        onClick={() => playClickSound()}
      >
        <meshStandardMaterial color="#2a2a2a" />
      </RoundedBox>
    </group>
  )
}

// Floating decorative elements
function FloatingDecorations() {
  return (
    <>
      <FloatingOrb position={[-3, 1, 2]} color="#ff6b6b" size={0.2} />
      <FloatingOrb position={[3, 1.5, 1]} color="#4ecdc4" size={0.25} />
      <FloatingOrb position={[-2, 2.5, -1]} color="#45b7d1" size={0.15} />
      <FloatingOrb position={[2.5, 0.5, 2]} color="#96ceb4" size={0.3} />
      <FloatingOrb position={[0, 3, 1]} color="#ffeaa7" size={0.2} />
    </>
  )
}

// Rotating geometric shapes
function GeometricShapes() {
  const torusRef = useRef()
  const boxRef = useRef()
  
  useFrame((state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.3
      torusRef.current.rotation.y += delta * 0.2
    }
    if (boxRef.current) {
      boxRef.current.rotation.x += delta * 0.4
      boxRef.current.rotation.z += delta * 0.3
    }
  })
  
  return (
    <>
      <Torus 
        ref={torusRef}
        position={[-4, 2, -2]} 
        args={[0.5, 0.2, 16, 32]}
        onClick={() => playClickSound()}
      >
        <meshStandardMaterial color="#e17055" wireframe />
      </Torus>
      
      <Box 
        ref={boxRef}
        position={[4, 1, -1]} 
        args={[0.8, 0.8, 0.8]}
        onClick={() => playClickSound()}
      >
        <meshStandardMaterial color="#a29bfe" transparent opacity={0.7} />
      </Box>
    </>
  )
}

// Skills data
const skillsData = [
  { name: 'Python', level: 90, color: '#3776ab', icon: '🐍' },
  { name: 'JavaScript', level: 85, color: '#f7df1e', icon: '⚡' },
  { name: 'React.js', level: 88, color: '#61dafb', icon: '⚛️' },
  { name: 'Three.js', level: 75, color: '#000000', icon: '🎮' },
  { name: '3D Modeling', level: 70, color: '#ff6b35', icon: '🎨' },
  { name: 'Node.js', level: 80, color: '#339933', icon: '🚀' },
  { name: 'WebGL', level: 65, color: '#990000', icon: '✨' }
]

// Holographic Skills Panel Component
function HolographicSkillsPanel({ position, scrollProgress }) {
  const panelRef = useRef()
  
  useFrame((state) => {
    if (panelRef.current) {
      panelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      panelRef.current.material.opacity = Math.min(scrollProgress * 2, 0.9)
    }
  })
  
  return (
    <group position={position}>
      {/* Main panel background */}
      <RoundedBox 
        ref={panelRef}
        args={[4, 6, 0.1]} 
        radius={0.1}
        onClick={() => playClickSound()}
      >
        <meshStandardMaterial 
          color="#001122" 
          transparent 
          opacity={0.7}
          emissive="#0066ff"
          emissiveIntensity={0.1}
        />
      </RoundedBox>
      
      {/* Skills bars */}
      {skillsData.map((skill, index) => (
        <group key={skill.name} position={[0, 2.5 - index * 0.7, 0.06]}>
          {/* Skill name */}
          <Text
            position={[-1.5, 0, 0]}
            fontSize={0.2}
            color="#00ffff"
            anchorX="left"
            anchorY="middle"
          >
            {skill.icon} {skill.name}
          </Text>
          
          {/* Progress bar background */}
          <RoundedBox 
            position={[0.5, 0, 0]} 
            args={[2, 0.1, 0.02]}
            radius={0.05}
          >
            <meshStandardMaterial color="#003366" transparent opacity={0.5} />
          </RoundedBox>
          
          {/* Progress bar fill */}
          <RoundedBox 
            position={[0.5 - (1 - skill.level/100), 0, 0.01]} 
            args={[2 * skill.level/100, 0.1, 0.02]}
            radius={0.05}
          >
            <meshStandardMaterial 
              color={skill.color} 
              emissive={skill.color}
              emissiveIntensity={0.3}
            />
          </RoundedBox>
          
          {/* Percentage text */}
          <Text
            position={[1.7, 0, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
          >
            {skill.level}%
          </Text>
        </group>
      ))}
    </group>
  )
}

// 3D Avatar/Character
function Avatar({ position, scrollProgress }) {
  const avatarRef = useRef()
  
  useFrame((state) => {
    if (avatarRef.current) {
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      avatarRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05
    }
  })
  
  return (
    <group ref={avatarRef} position={position}>
      {/* Head */}
      <Sphere position={[0, 1.5, 0]} args={[0.3, 32, 32]}>
        <meshStandardMaterial color="#ffdbac" />
      </Sphere>
      
      {/* Body */}
      <Cylinder position={[0, 0.8, 0]} args={[0.25, 0.3, 0.8]}>
        <meshStandardMaterial color="#4a90e2" />
      </Cylinder>
      
      {/* Arms */}
      <Cylinder position={[-0.4, 0.8, 0]} args={[0.08, 0.08, 0.6]} rotation={[0, 0, Math.PI/6]}>
        <meshStandardMaterial color="#ffdbac" />
      </Cylinder>
      <Cylinder position={[0.4, 0.8, 0]} args={[0.08, 0.08, 0.6]} rotation={[0, 0, -Math.PI/6]}>
        <meshStandardMaterial color="#ffdbac" />
      </Cylinder>
      
      {/* Legs */}
      <Cylinder position={[-0.15, 0.1, 0]} args={[0.08, 0.08, 0.6]}>
        <meshStandardMaterial color="#2c3e50" />
      </Cylinder>
      <Cylinder position={[0.15, 0.1, 0]} args={[0.08, 0.08, 0.6]}>
        <meshStandardMaterial color="#2c3e50" />
      </Cylinder>
      
      {/* Holographic effect */}
      <Torus position={[0, 0.5, 0]} args={[0.8, 0.02, 16, 32]}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff"
          emissiveIntensity={0.5}
          wireframe
        />
      </Torus>
    </group>
  )
}

// About section with floating info cards
function AboutSection({ position, scrollProgress }) {
  return (
    <group position={position}>
      {/* Main about panel */}
      <RoundedBox args={[5, 3, 0.1]} radius={0.1}>
        <meshStandardMaterial 
          color="#001a33" 
          transparent 
          opacity={0.8}
          emissive="#0066ff"
          emissiveIntensity={0.05}
        />
      </RoundedBox>
      
      {/* About text */}
      <Text
        position={[0, 0.8, 0.06]}
        fontSize={0.3}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        ABOUT SHAAN
      </Text>
      
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={4.5}
      >
        Creative developer with passion for 3D experiences,
        interactive design, and cutting-edge web technologies.
        Transforming ideas into immersive digital realities.
      </Text>
      
      {/* Floating info cards */}
      {[
        { text: "🎓 Computer Science", pos: [-2, -1.5, 0.2] },
        { text: "💼 5+ Years Experience", pos: [0, -1.5, 0.2] },
        { text: "🌍 Based in India", pos: [2, -1.5, 0.2] }
      ].map((card, index) => (
        <group key={index} position={card.pos}>
          <RoundedBox args={[1.5, 0.4, 0.05]} radius={0.05}>
            <meshStandardMaterial 
              color="#003366" 
              transparent 
              opacity={0.7}
              emissive="#0099ff"
              emissiveIntensity={0.1}
            />
          </RoundedBox>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {card.text}
          </Text>
        </group>
      ))}
    </group>
  )
}

export default function Scene3D() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = Math.min(scrolled / maxScroll, 1)
      setScrollProgress(progress)
      
      // Determine current section based on scroll
      if (progress < 0.33) setCurrentSection(0)
      else if (progress < 0.66) setCurrentSection(1)
      else setCurrentSection(2)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ 
      width: '100vw', 
      height: '300vh', // Make it scrollable
      position: 'relative',
      background: 'linear-gradient(180deg, #0a0a23 0%, #1a1a3a 50%, #2a2a4a 100%)'
    }}>
      {/* Fixed 3D Canvas */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1
      }}>
        <Canvas
          camera={{ position: [0, 0, 12], fov: 75 }}
          shadows
        >
          {/* Dynamic Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.8}
            color="#ffffff"
          />
          <pointLight position={[-5, 5, 5]} intensity={1} color="#00ffff" />
          <pointLight position={[5, -5, 5]} intensity={0.8} color="#ff6b6b" />
          
          {/* Environment */}
          <Environment preset="night" />
          
          {/* Section 1: Hero with Avatar */}
          {currentSection === 0 && (
            <>
              <Avatar position={[3, 0, 0]} scrollProgress={scrollProgress} />
              <Text
                position={[-2, 2, 0]}
                fontSize={0.8}
                color="#00ffff"
                anchorX="center"
                anchorY="middle"
              >
                SHAAN SONI
              </Text>
              <Text
                position={[-2, 1, 0]}
                fontSize={0.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                maxWidth={4}
              >
                Creative Developer & 3D Artist
              </Text>
            </>
          )}
          
          {/* Section 2: Skills */}
          {currentSection === 1 && (
            <HolographicSkillsPanel position={[0, 0, 0]} scrollProgress={scrollProgress} />
          )}
          
          {/* Section 3: About */}
          {currentSection === 2 && (
            <AboutSection position={[0, 0, 0]} scrollProgress={scrollProgress} />
          )}
          
          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <Sphere
              key={i}
              position={[
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
              ]}
              args={[0.02, 8, 8]}
            >
              <meshStandardMaterial 
                color="#00ffff" 
                emissive="#00ffff"
                emissiveIntensity={0.5}
              />
            </Sphere>
          ))}
          
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.2}
          />
        </Canvas>
      </div>
      
      {/* Scroll indicator */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        color: '#00ffff',
        fontSize: '1rem',
        textAlign: 'center',
        animation: 'bounce 2s infinite'
      }}>
        <div>Scroll to explore</div>
        <div style={{ fontSize: '2rem' }}>↓</div>
      </div>
      
      {/* Section indicators */}
      <div style={{
        position: 'fixed',
        right: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {['Hero', 'Skills', 'About'].map((section, index) => (
          <div
            key={section}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentSection === index ? '#00ffff' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
      
      {/* Add bounce animation */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
      `}</style>
    </div>
  )
}
