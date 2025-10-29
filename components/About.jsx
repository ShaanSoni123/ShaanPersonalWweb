'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  PerspectiveCamera,
  Environment,
  Float,
  Text,
  useScroll,
  Sphere,
  MeshDistortMaterial
} from '@react-three/drei'
import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * AnimatedRoom3D - Morphing 3D environment that changes as user scrolls
 */
function AnimatedRoom3D() {
  const meshRef = useRef()
  const groupRef = useRef()
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central morphing sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#667eea"
            emissive="#764ba2"
            emissiveIntensity={0.5}
            distort={0.4}
            speed={2}
            roughness={0.2}
          />
        </Sphere>
      </Float>

      {/* Orbiting particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 3
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(i * 0.5) * 2,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1} />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * Scene3D - About section 3D scene
 */
function Scene3D() {
  const cameraRef = useRef()

  useFrame(({ clock }) => {
    if (cameraRef.current) {
      // Gentle camera movement
      cameraRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.5
      cameraRef.current.position.y = Math.cos(clock.getElapsedTime() * 0.15) * 0.3 + 1
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1, 5]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#667eea" intensity={0.5} />
      
      <Environment preset="night" />
      
      <AnimatedRoom3D />
    </>
  )
}

/**
 * TimelineItem - Individual achievement/milestone
 */
function TimelineItem({ year, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="flex gap-6 mb-12"
    >
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary-500 animate-glow" />
        <div className="w-0.5 h-full bg-gradient-to-b from-primary-500 to-transparent" />
      </div>
      
      <div className="flex-1 pb-8">
        <span className="text-primary-400 text-sm font-semibold">{year}</span>
        <h3 className="text-2xl font-bold mt-2 mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  )
}

/**
 * About Component - Personal story and achievements
 */
export default function About() {
  const sectionRef = useRef()
  const { scrollYProgress } = useFramerScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const achievements = [
    {
      year: "2024",
      title: "Senior Full-Stack Developer",
      description: "Leading development of cutting-edge web applications with modern technologies and best practices."
    },
    {
      year: "2023",
      title: "Open Source Contributor",
      description: "Active contributor to major open-source projects with 1000+ stars on GitHub."
    },
    {
      year: "2022",
      title: "AI/ML Integration Specialist",
      description: "Pioneered integration of AI models into production applications, improving user experience by 300%."
    },
    {
      year: "2021",
      title: "Started Tech Journey",
      description: "Embarked on the exciting journey of creating digital experiences that matter."
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.about-canvas', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
        rotation: 360,
        ease: 'none'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-gradient-to-b from-dark to-dark-light">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        <Canvas className="about-canvas">
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative z-10 max-w-6xl mx-auto px-8 py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I'm a passionate developer who believes in the power of technology to create 
            meaningful experiences. My journey is driven by curiosity, creativity, and 
            a constant desire to push boundaries.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl"
          >
            <h3 className="text-3xl font-bold mb-4 text-primary-400">My Philosophy</h3>
            <p className="text-gray-300 leading-relaxed">
              I believe great software is a blend of art and engineering. Every line of code 
              should serve a purpose, every design decision should enhance the user experience, 
              and every project should leave a positive impact.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl"
          >
            <h3 className="text-3xl font-bold mb-4 text-primary-400">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {['React', 'Next.js', 'Three.js', 'Node.js', 'TypeScript', 'Python', 'AI/ML', 'Cloud Architecture'].map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-4xl font-bold mb-12 text-center">Journey & Milestones</h3>
          {achievements.map((item, index) => (
            <TimelineItem key={index} {...item} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

