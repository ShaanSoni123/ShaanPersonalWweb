'use client'

import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  PerspectiveCamera,
  Environment,
  RoundedBox,
  useTexture,
  Image as DreiImage
} from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

/**
 * ParallaxImage3D - 3D image with parallax depth effect
 */
function ParallaxImage3D({ position, scale, image, index, activeIndex }) {
  const meshRef = useRef()
  const isActive = index === activeIndex
  
  useFrame(({ clock, mouse }) => {
    if (meshRef.current) {
      // Parallax effect based on mouse position
      meshRef.current.position.x = position[0] + mouse.x * (index * 0.3)
      meshRef.current.position.y = position[1] + mouse.y * (index * 0.2)
      
      // Scale active image
      const targetScale = isActive ? scale * 1.2 : scale
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
      
      // Rotate slightly
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() + index) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <RoundedBox args={[2, 1.5, 0.1]} radius={0.05}>
        <meshStandardMaterial
          color={image.color}
          emissive={image.color}
          emissiveIntensity={isActive ? 0.5 : 0.2}
          roughness={0.3}
        />
      </RoundedBox>
    </group>
  )
}

/**
 * Scene3D - Gallery scene with parallax images
 */
function Scene3D({ images, activeIndex }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#667eea" intensity={0.5} />
      
      <Environment preset="sunset" />
      
      {/* Render images in 3D space with depth */}
      {images.map((image, i) => {
        const offset = (i - activeIndex) * 2.5
        const z = -Math.abs(i - activeIndex) * 2
        
        return (
          <ParallaxImage3D
            key={i}
            position={[offset, 0, z]}
            scale={1}
            image={image}
            index={i}
            activeIndex={activeIndex}
          />
        )
      })}
    </>
  )
}

/**
 * Gallery Component - Photo carousel with parallax
 */
export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const images = [
    {
      title: "Workspace Setup",
      description: "Where the magic happens - my creative space",
      color: "#8b5cf6",
      src: "/gallery/workspace.jpg"
    },
    {
      title: "Conference Talk",
      description: "Speaking about the future of web development",
      color: "#ec4899",
      src: "/gallery/conference.jpg"
    },
    {
      title: "Team Collaboration",
      description: "Building amazing products with amazing people",
      color: "#06b6d4",
      src: "/gallery/team.jpg"
    },
    {
      title: "Hackathon Win",
      description: "First place at TechCrunch Disrupt 2024",
      color: "#10b981",
      src: "/gallery/hackathon.jpg"
    },
    {
      title: "Adventure Time",
      description: "Taking a break to recharge and find inspiration",
      color: "#f59e0b",
      src: "/gallery/adventure.jpg"
    }
  ]

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-dark-light to-dark">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene3D images={images} activeIndex={activeIndex} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
            Life in <span className="gradient-text">Motion</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Moments that shaped my journey - from late-night coding sessions to 
            incredible adventures.
          </p>
        </motion.div>

        {/* Active image info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-8 rounded-2xl max-w-2xl text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-3">{images[activeIndex].title}</h3>
            <p className="text-gray-300 text-lg">{images[activeIndex].description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={handlePrevious}
            className="interactive w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`interactive w-3 h-3 rounded-full transition-all ${
                  i === activeIndex 
                    ? 'bg-primary-500 w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="interactive w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

