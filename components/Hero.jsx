'use client'

import { useRef, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  PerspectiveCamera, 
  OrbitControls, 
  Environment, 
  Float,
  ContactShadows,
  Sparkles,
  MeshReflectorMaterial,
  RoundedBox,
  useGLTF,
  Sphere,
  Cylinder,
  Box
} from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'

/**
 * HolographicAvatar - Wireframe holographic character
 */
function HolographicAvatar({ position = [0, 0, 0] }) {
  const groupRef = useRef()
  
  useFrame(({ clock }) => {
    // Gentle floating animation
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.1
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <Sphere args={[0.3, 16, 16]} position={[0, 1.5, 0]}>
        <meshBasicMaterial 
          color="#00d9ff" 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </Sphere>
      
      {/* Body */}
      <Cylinder args={[0.25, 0.3, 0.8, 16]} position={[0, 0.8, 0]}>
        <meshBasicMaterial 
          color="#00d9ff" 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </Cylinder>
      
      {/* Arms */}
      <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[-0.4, 0.8, 0]} rotation={[0, 0, Math.PI/6]}>
        <meshBasicMaterial 
          color="#00d9ff" 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[0.4, 0.8, 0]} rotation={[0, 0, -Math.PI/6]}>
        <meshBasicMaterial 
          color="#00d9ff" 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </Cylinder>
      
      {/* Legs */}
      <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[-0.15, 0.1, 0]}>
        <meshBasicMaterial 
          color="#00d9ff" 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[0.15, 0.1, 0]}>
        <meshBasicMaterial 
          color="#00d9ff" 
          wireframe 
          transparent 
          opacity={0.8}
        />
      </Cylinder>
      
      {/* Glowing aura */}
      <Sphere args={[0.8, 32, 32]} position={[0, 0.8, 0]}>
        <meshBasicMaterial 
          color="#00d9ff" 
          transparent 
          opacity={0.1}
        />
      </Sphere>
    </group>
  )
}

/**
 * RotatingPlatform - Holographic pedestal with rotating effects
 */
function RotatingPlatform({ position = [0, 0, 0] }) {
  const platformRef = useRef()
  const ringsRef = useRef()
  
  useFrame(({ clock }) => {
    if (platformRef.current) {
      platformRef.current.rotation.y = clock.getElapsedTime() * 0.3
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y = -clock.getElapsedTime() * 0.5
    }
  })

  return (
    <group position={position}>
      {/* Main Platform */}
      <group ref={platformRef}>
        <Cylinder args={[1.5, 1.5, 0.2, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#003d5c"
            emissive="#00d9ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </Cylinder>
        
        {/* Platform grid lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * Math.PI) / 4
          return (
            <mesh 
              key={i}
              position={[Math.cos(angle) * 0.75, 0.11, Math.sin(angle) * 0.75]}
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[0.02, 0.02, 1.5]} />
              <meshBasicMaterial color="#00d9ff" transparent opacity={0.5} />
            </mesh>
          )
        })}
      </group>
      
      {/* Rotating rings */}
      <group ref={ringsRef} position={[0, 0.15, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00d9ff" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]}>
          <torusGeometry args={[1.6, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
        </mesh>
      </group>
      
      {/* Base glow */}
      <Cylinder args={[1.7, 1.7, 0.05, 32]} position={[0, -0.15, 0]}>
        <meshBasicMaterial 
          color="#00d9ff"
          transparent
          opacity={0.2}
        />
      </Cylinder>
    </group>
  )
}

/**
 * Skills Data
 */
const skillsData = [
  { name: 'WebGL', level: 90, color: '#00d9ff' },
  { name: 'ReactJS', level: 85, color: '#00d9ff' },
  { name: 'JavaScript', level: 88, color: '#00d9ff' },
  { name: 'HTML + CSS', level: 92, color: '#00d9ff' },
  { name: '3D Modelling', level: 75, color: '#00d9ff' },
]

/**
 * FloatingSkillsPanel - Left side skills panel
 */
function FloatingSkillsPanel() {
  return (
    <group position={[-4, 0.5, 2]}>
      {/* Panel background */}
      <Box args={[2.5, 3, 0.05]}>
        <meshBasicMaterial 
          color="#001a33" 
          transparent 
          opacity={0.7}
        />
      </Box>
      
      {/* Border glow */}
      <mesh>
        <boxGeometry args={[2.52, 3.02, 0.02]} />
        <meshBasicMaterial 
          color="#00d9ff" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Skills bars - simplified for 3D */}
      {skillsData.map((skill, index) => (
        <group key={skill.name} position={[0, 1.2 - index * 0.6, 0.06]}>
          {/* Progress bar background */}
          <Box args={[2, 0.15, 0.02]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#003366" transparent opacity={0.5} />
          </Box>
          
          {/* Progress bar fill */}
          <Box 
            args={[2 * skill.level / 100, 0.15, 0.03]} 
            position={[-1 + skill.level / 100, 0, 0.01]}
          >
            <meshBasicMaterial 
              color={skill.color} 
              transparent 
              opacity={0.8}
            />
          </Box>
        </group>
      ))}
    </group>
  )
}

/**
 * FloatingProfilePanel - Top left profile card
 */
function FloatingProfilePanel() {
  return (
    <group position={[-4, 3, 1]}>
      {/* Panel background */}
      <Box args={[2.5, 1.5, 0.05]}>
        <meshBasicMaterial 
          color="#001a33" 
          transparent 
          opacity={0.7}
        />
      </Box>
      
      {/* Border glow */}
      <mesh>
        <boxGeometry args={[2.52, 1.52, 0.02]} />
        <meshBasicMaterial 
          color="#00d9ff" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Avatar placeholder */}
      <Sphere args={[0.3, 16, 16]} position={[-0.8, 0.3, 0.1]}>
        <meshBasicMaterial 
          color="#00d9ff" 
          wireframe 
        />
      </Sphere>
    </group>
  )
}

/**
 * FloatingAboutPanel - Bottom left about card
 */
function FloatingAboutPanel() {
  return (
    <group position={[-4, -2.5, 1.5]}>
      {/* Panel background */}
      <Box args={[2.5, 2, 0.05]}>
        <meshBasicMaterial 
          color="#001a33" 
          transparent 
          opacity={0.7}
        />
      </Box>
      
      {/* Border glow */}
      <mesh>
        <boxGeometry args={[2.52, 2.02, 0.02]} />
        <meshBasicMaterial 
          color="#00d9ff" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Decorative icons */}
      {[0, 1, 2].map((i) => (
        <Sphere 
          key={i} 
          args={[0.1, 8, 8]} 
          position={[-0.8 + i * 0.8, -0.6, 0.1]}
        >
          <meshBasicMaterial 
            color="#00d9ff" 
            transparent 
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  )
}

/**
 * DeskGLB - Your custom .glb desk model
 */
function DeskGLB({ position = [0, 0, 0] }) {
  const gltf = useGLTF('/models/desk.glb')
  
  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf])
  
  return (
    <primitive 
      object={gltf.scene} 
      position={position}
      scale={0.3}
    />
  )
}

/**
 * DeveloperDesk - Geometric fallback desk
 */
function DeveloperDesk({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Main desk surface */}
      <RoundedBox args={[4, 0.08, 2]} radius={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#d4a574"
          roughness={0.4}
          metalness={0.1}
        />
      </RoundedBox>
      
      {/* Desk legs */}
      {[
        [-1.8, -0.5, 0.8],
        [1.8, -0.5, 0.8],
        [-1.8, -0.5, -0.8],
        [1.8, -0.5, -0.8]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.04, 0.04, 1, 16]} />
          <meshStandardMaterial color="#8b6f47" metalness={0.2} />
        </mesh>
      ))}
      
      {/* Keyboard */}
      <RoundedBox args={[0.8, 0.03, 0.3]} radius={0.01} position={[0, 0.06, 0.5]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
      </RoundedBox>
      
      {/* Mouse */}
      <RoundedBox args={[0.08, 0.03, 0.12]} radius={0.01} position={[0.6, 0.06, 0.5]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} />
      </RoundedBox>
      
      {/* Mousepad */}
      <RoundedBox args={[0.5, 0.005, 0.4]} radius={0.01} position={[0.6, 0.045, 0.5]}>
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </RoundedBox>
    </group>
  )
}

/**
 * OfficeChair - Simple developer chair
 */
function OfficeChair({ position = [0, 0, 0] }) {
  const chairRef = useRef()
  
  useFrame(({ clock }) => {
    // Subtle rotation animation
    chairRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05
  })

  return (
    <group ref={chairRef} position={position}>
      {/* Seat */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      
      {/* Backrest */}
      <RoundedBox args={[0.5, 0.6, 0.1]} radius={0.05} position={[0, 0.15, -0.25]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </RoundedBox>
      
      {/* Chair base */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} />
      </mesh>
      
      {/* Five-star base */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        return (
          <mesh
            key={i}
            position={[Math.cos(rad) * 0.3, -0.66, Math.sin(rad) * 0.3]}
            rotation={[0, rad, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.02, 0.03, 0.4, 16]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * PlantDecor - Small potted plants
 */
function PlantDecor({ position = [0, 0, 0], color = '#10b981' }) {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
      <group position={position}>
        {/* Pot */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.12, 16]} />
          <meshStandardMaterial color="#d4a574" roughness={0.8} />
        </mesh>
        
        {/* Plant stems */}
        {[0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3
          return (
            <group key={i} rotation={[0, angle, 0.3]}>
              <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
                <meshStandardMaterial color="#0d7c66" />
              </mesh>
              
              {/* Leaves */}
              <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 4]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </group>
          )
        })}
      </group>
    </Float>
  )
}

/**
 * BookStack - Stack of books on desk
 */
function BookStack({ position = [0, 0, 0] }) {
  const books = [
    { height: 0.08, color: '#991b1b', width: 0.5 },
    { height: 0.08, color: '#1e40af', width: 0.45 },
    { height: 0.08, color: '#166534', width: 0.48 },
  ]

  return (
    <group position={position}>
      {books.map((book, i) => (
        <RoundedBox
          key={i}
          args={[book.width, book.height, 0.35]}
          radius={0.01}
          position={[0, i * 0.08, 0]}
          rotation={[0, i * 0.1, 0]}
        >
          <meshStandardMaterial color={book.color} roughness={0.8} />
        </RoundedBox>
      ))}
    </group>
  )
}

/**
 * AmbientParticles - Floating dust particles for atmosphere
 */
function AmbientParticles() {
  return (
    <Sparkles
      count={50}
      scale={15}
      size={1.5}
      speed={0.2}
      opacity={0.3}
      color="#fbbf24"
    />
  )
}

/**
 * HolographicLighting - Futuristic blue/cyan lighting
 */
function HolographicLighting() {
  return (
    <>
      {/* Main ambient light - cyan tint */}
      <ambientLight intensity={0.4} color="#00d9ff" />
      
      {/* Key light - blue from top */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1}
        color="#00d9ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Hologram glow - bright cyan */}
      <pointLight position={[0, 2, 2]} intensity={2} color="#00ffff" distance={5} />
      
      {/* Rim light - blue accent */}
      <pointLight position={[-4, 2, -2]} intensity={1.2} color="#0099ff" distance={6} />
      
      {/* Fill light - cyan */}
      <pointLight position={[4, 1, 2]} intensity={0.8} color="#00d9ff" distance={5} />
      
      {/* Spotlight from above - blue */}
      <spotLight
        position={[0, 6, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#00d9ff"
        castShadow
      />
    </>
  )
}

/**
 * Scene3D - Main 3D developer room scene
 */
function Scene3D({ isMobile }) {
  const cameraRef = useRef()
  
  // Adjust camera position based on device
  const cameraPosition = isMobile 
    ? [0, 2.5, 8]  // Further back on mobile for better view
    : [0, 2.5, 6]  // Closer on desktop
  
  const cameraFov = isMobile ? 60 : 50
  
  useFrame(({ clock }) => {
    // Gentle camera sway (less on mobile)
    if (cameraRef.current) {
      const swayIntensity = isMobile ? 0.1 : 0.3
      cameraRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.2) * swayIntensity
      cameraRef.current.position.y = cameraPosition[1] + Math.sin(clock.getElapsedTime() * 0.15) * 0.05
    }
  })

  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={cameraPosition} 
        fov={cameraFov}
      />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3}
        autoRotate={!isMobile}  // Disable auto-rotate on mobile
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
      
      {/* Holographic Lighting */}
      <HolographicLighting />
      
      {/* Environment - dark for holographic effect */}
      <Environment preset="night" />
      
      {/* Fog for depth - blue tint */}
      <fog attach="fog" args={['#001122', 10, 25]} />
      
      {/* Holographic Scene */}
      <RotatingPlatform position={[0, -0.3, 0]} />
      <HolographicAvatar position={[0, 0, 0]} />
      
      {/* Floating UI Panels */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <FloatingProfilePanel />
      </Float>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <FloatingSkillsPanel />
      </Float>
      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <FloatingAboutPanel />
      </Float>
      
      {/* Holographic particles */}
      <Sparkles
        count={150}
        scale={10}
        size={3}
        speed={0.3}
        opacity={0.5}
        color="#00d9ff"
      />
      
      {/* Ambient particles */}
      <AmbientParticles />
      
      {/* Floor with reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={0.3}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1a1625"
          metalness={0.5}
        />
      </mesh>
      
      {/* Contact shadows for depth */}
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />
      
      {/* Back wall */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#2d2438" roughness={0.9} />
      </mesh>
    </>
  )
}

/**
 * Hero Component - Main landing section with 3D developer room
 */
export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#000b1a] via-[#001a33] to-[#000b1a]">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas 
          shadows 
          dpr={[1, 2]}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={null}>
            <Scene3D isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" 
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
           }} 
      />

      {/* Text Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
            style={{
              color: '#fff',
              textShadow: '0 0 30px rgba(0, 217, 255, 0.8), 0 0 60px rgba(0, 217, 255, 0.5), 0 4px 6px rgba(0,0,0,0.8)'
            }}
          >
            Hi, I'm{' '}
            <span 
              style={{
                color: '#00d9ff',
                textShadow: '0 0 40px rgba(0, 217, 255, 1), 0 0 80px rgba(0, 255, 255, 0.5)'
              }}
            >
              Shaan
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl font-light mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            style={{
              color: '#00d9ff',
              textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0, 217, 255, 0.5)'
            }}
          >
            Full-Stack Developer
          </motion.p>
          
          <motion.p 
            className="text-lg sm:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={{
              color: '#00ffff',
              textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(0, 255, 255, 0.3)'
            }}
          >
            Building immersive holographic experiences
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
        >
          <motion.button 
            className="group relative px-8 py-4 rounded-full font-medium text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(0, 217, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(0, 217, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 217, 255, 0.2), 0 0 20px rgba(0, 217, 255, 0.1)',
              color: '#00d9ff'
            }}
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
          
          <motion.button 
            className="relative px-8 py-4 rounded-full font-medium text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, #00d9ff 0%, #0099ff 100%)',
              boxShadow: '0 10px 40px rgba(0, 217, 255, 0.5), 0 0 30px rgba(0, 217, 255, 0.3)',
              color: '#000'
            }}
          >
            <span className="relative z-10">Get In Touch</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div 
            className="flex flex-col items-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            <span 
              className="text-sm mb-2 font-light tracking-wider"
              style={{ 
                color: '#00d9ff',
                textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(0, 217, 255, 0.5)' 
              }}
            >
              SCROLL TO EXPLORE
            </span>
            <div className="w-6 h-10 border-2 rounded-full flex justify-center backdrop-blur-sm"
                 style={{
                   borderColor: 'rgba(0, 217, 255, 0.5)',
                   background: 'rgba(0, 217, 255, 0.05)',
                   boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)'
                 }}>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full mt-2"
                style={{ 
                  background: '#00d9ff',
                  boxShadow: '0 0 10px rgba(0, 217, 255, 1)' 
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Holographic Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-transparent opacity-50" 
             style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }} />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-cyan-400 to-transparent opacity-50"
             style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }} />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-cyan-400 to-transparent opacity-50"
             style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }} />
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-cyan-400 to-transparent opacity-50"
             style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }} />
      </div>
    </div>
  )
}

