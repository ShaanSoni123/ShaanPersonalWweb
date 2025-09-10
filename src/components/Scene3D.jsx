import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Environment, ContactShadows } from '@react-three/drei'

// Animated rotating cube
function RotatingCube({ position }) {
  const meshRef = useRef()
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })
  
  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color="hotpink" emissive="hotpink" emissiveIntensity={0.2} />
    </Box>
  )
}

// Floating sphere with animation
function FloatingSphere({ position }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5
    }
  })
  
  return (
    <Sphere ref={meshRef} position={position} args={[0.7, 32, 32]}>
      <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.3} wireframe />
    </Sphere>
  )
}

export default function Scene3D() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
      >
        {/* Lighting - Much brighter! */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={1} color="orange" />
        
        {/* Environment for reflections */}
        <Environment preset="sunset" />
        
        {/* 3D Objects */}
        <RotatingCube position={[-2, 0, 0]} />
        <FloatingSphere position={[2, 0, 0]} />
        
        {/* 3D Text */}
        <Text
          position={[0, 2, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Welcome to 3D!
        </Text>
        
        {/* Ground with shadows */}
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
        />
        
        {/* Camera controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  )
}
