'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  PerspectiveCamera,
  Environment,
  RoundedBox,
  Text,
  Float,
  useTexture
} from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

/**
 * ProjectCard3D - Interactive 3D card that flips on hover
 */
function ProjectCard3D({ position, project, index, onHover, isHovered }) {
  const meshRef = useRef()
  const [localHover, setLocalHover] = useState(false)
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Smooth rotation for flip effect
      const targetRotation = isHovered ? Math.PI : 0
      meshRef.current.rotation.y += (targetRotation - meshRef.current.rotation.y) * 0.1
      
      // Floating animation when not hovered
      if (!isHovered) {
        meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + index) * 0.1
      }
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group
        ref={meshRef}
        position={position}
        onPointerEnter={() => {
          setLocalHover(true)
          onHover(index)
        }}
        onPointerLeave={() => {
          setLocalHover(false)
          onHover(null)
        }}
      >
        {/* Front face */}
        <RoundedBox args={[2, 2.5, 0.1]} radius={0.1}>
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={localHover ? 0.5 : 0.2}
            roughness={0.3}
          />
        </RoundedBox>
        
        {/* Back face (visible when flipped) */}
        <RoundedBox args={[2, 2.5, 0.1]} radius={0.1} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.5}
          />
        </RoundedBox>

        {/* Project title on front */}
        <Text
          position={[0, 0.8, 0.06]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {project.title}
        </Text>
      </group>
    </Float>
  )
}

/**
 * Scene3D - Projects showcase in 3D space
 */
function Scene3D({ projects, hoveredIndex, onHover }) {
  const cameraRef = useRef()
  
  useFrame(({ clock }) => {
    if (cameraRef.current && hoveredIndex === null) {
      // Gentle camera pan when not hovering
      cameraRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.1) * 2
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#667eea" intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />
      
      <Environment preset="city" />
      
      {/* Project cards arranged in a grid */}
      {projects.map((project, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        const x = (col - 1) * 3
        const y = -(row * 3)
        
        return (
          <ProjectCard3D
            key={i}
            position={[x, y, 0]}
            project={project}
            index={i}
            onHover={onHover}
            isHovered={hoveredIndex === i}
          />
        )
      })}
    </>
  )
}

/**
 * ProjectInfo - Detailed project information panel
 */
function ProjectInfo({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass p-8 rounded-2xl max-w-2xl mx-auto"
    >
      <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
      <p className="text-gray-300 mb-6">{project.description}</p>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-primary-400">Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech, i) => (
            <span key={i} className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button className="interactive px-6 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-all">
          View Live
        </button>
        <button className="interactive px-6 py-2 glass rounded-lg hover:bg-white/10 transition-all">
          Source Code
        </button>
      </div>
    </motion.div>
  )
}

/**
 * Projects Component - Portfolio showcase
 */
export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  
  const projects = [
    {
      title: "AI Chat Platform",
      description: "Real-time AI-powered chat application with natural language processing and sentiment analysis. Built with cutting-edge LLM integration.",
      tech: ["Next.js", "OpenAI", "WebSocket", "PostgreSQL"],
      color: "#8b5cf6",
      image: "/projects/ai-chat.jpg"
    },
    {
      title: "3D Portfolio Engine",
      description: "Open-source framework for creating stunning 3D portfolio websites with minimal code. Features drag-and-drop 3D scene builder.",
      tech: ["React", "Three.js", "TypeScript", "Blender"],
      color: "#ec4899",
      image: "/projects/3d-portfolio.jpg"
    },
    {
      title: "Smart Dashboard",
      description: "Enterprise analytics dashboard with real-time data visualization, custom reporting, and predictive insights powered by ML.",
      tech: ["Vue.js", "D3.js", "Python", "TensorFlow"],
      color: "#06b6d4",
      image: "/projects/dashboard.jpg"
    },
    {
      title: "E-Commerce Platform",
      description: "Full-featured e-commerce solution with payment integration, inventory management, and AI-powered product recommendations.",
      tech: ["React", "Node.js", "Stripe", "MongoDB"],
      color: "#10b981",
      image: "/projects/ecommerce.jpg"
    },
    {
      title: "Music Visualizer",
      description: "Real-time audio visualization tool with WebGL shaders and reactive 3D graphics. Supports multiple visualization modes.",
      tech: ["Three.js", "Web Audio API", "GLSL"],
      color: "#f59e0b",
      image: "/projects/music-viz.jpg"
    },
    {
      title: "Task Automation Tool",
      description: "No-code automation platform for developers. Connect APIs, schedule tasks, and build workflows with a visual interface.",
      tech: ["Next.js", "Temporal", "Redis", "Docker"],
      color: "#6366f1",
      image: "/projects/automation.jpg"
    }
  ]

  return (
    <div className="relative w-full min-h-screen bg-dark">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene3D 
              projects={projects} 
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hover over any project to explore. Each one represents a unique challenge 
            and a creative solution.
          </p>
        </motion.div>

        {/* Project details shown on hover */}
        <div className="min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && (
              <ProjectInfo project={projects[hoveredIndex]} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

