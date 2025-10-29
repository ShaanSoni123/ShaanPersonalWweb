'use client'

import { useRef, Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  PerspectiveCamera,
  Environment,
  Float,
  Sphere,
  MeshDistortMaterial,
  Trail
} from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

/**
 * FloatingOrb - Interactive floating orb that follows mouse
 */
function FloatingOrb({ mousePosition }) {
  const orbRef = useRef()
  
  useFrame(({ clock }) => {
    if (orbRef.current) {
      // Follow mouse with smooth interpolation
      orbRef.current.position.x += (mousePosition.x * 3 - orbRef.current.position.x) * 0.05
      orbRef.current.position.y += (mousePosition.y * 3 - orbRef.current.position.y) * 0.05
      
      // Gentle rotation
      orbRef.current.rotation.x = clock.getElapsedTime() * 0.3
      orbRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={orbRef} args={[0.8, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#0ea5e9"
          emissive="#0ea5e9"
          emissiveIntensity={0.8}
          distort={0.4}
          speed={3}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

/**
 * ParticleField - Animated particle background
 */
function ParticleField() {
  const particlesRef = useRef()
  const count = 200
  
  const particles = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    particles[i] = (Math.random() - 0.5) * 20
  }
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05
      particlesRef.current.rotation.x = clock.getElapsedTime() * 0.03
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#667eea"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

/**
 * Scene3D - Contact section 3D environment
 */
function Scene3D({ mousePosition }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#667eea" intensity={0.5} />
      
      <Environment preset="night" />
      
      <FloatingOrb mousePosition={mousePosition} />
      <ParticleField />
    </>
  )
}

/**
 * ContactForm - Interactive contact form using Web3Forms
 */
function ContactForm() {
  // Form field state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult("")
    
    // Prepare data object for Web3Forms API
    const data = {
      access_key: "82b7dca8-e7f8-4303-972d-e3681289e861", // Your Web3Forms public access key
      name: name,
      email: email,
      message: message,
      subject: "New Contact Form Submission from Portfolio",
      from_name: "Portfolio Contact Form"
    }
    
    try {
      // Send POST request to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        // ✅ Success: Show success message and clear form
        setIsSuccess(true)
        setResult("Message sent successfully! 🎉 I'll get back to you soon.")
        
        // Clear form fields
        setName("")
        setEmail("")
        setMessage("")
      } else {
        // ❌ Error from API: Show error message
        setIsSuccess(false)
        setResult(`Something went wrong: ${result.message || "Please try again."}`)
      }
    } catch (error) {
      // ❌ Network error: Show error message
      console.error("Network error:", error)
      setIsSuccess(false)
      setResult("Something went wrong, please try again. Check your internet connection.")
    } finally {
      // Stop loading state
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          className="interactive w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="interactive w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={loading}
          rows={5}
          className="interactive w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Tell me about your project..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="interactive w-full px-8 py-4 bg-primary-500 rounded-lg hover:bg-primary-600 transition-all font-semibold hover:animate-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            {/* Loading spinner */}
            <svg 
              className="animate-spin h-5 w-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Sending...</span>
          </>
        ) : (
          "Send Message"
        )}
      </button>
      
      {/* Success/Error message display */}
      {result && (
        <div 
          className={`text-center p-4 glass rounded-lg border-2 transition-all ${
            isSuccess 
              ? "border-green-500/50 bg-green-500/10" 
              : "border-red-500/50 bg-red-500/10"
          }`}
        >
          <span className={`text-sm ${isSuccess ? "text-green-400" : "text-red-400"}`}>
            {result}
          </span>
        </div>
      )}
    </form>
  )
}

/**
 * Contact Component - Get in touch section
 */
export default function Contact() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -(e.clientY / window.innerHeight) * 2 + 1
    setMousePosition({ x, y })
  }

  return (
    <div 
      className="relative w-full min-h-screen bg-gradient-to-t from-dark to-dark-light"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-40">
        <Canvas>
          <Suspense fallback={null}>
            <Scene3D mousePosition={mousePosition} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have an exciting project or just want to say hi? I'd love to hear from you.
            Drop me a message and let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <ContactForm />
          </motion.div>

          {/* Contact Info & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              
              <div className="space-y-4">
                <a 
                  href="mailto:shaansoni21@gmail.com" 
                  className="interactive flex items-center gap-4 p-4 glass rounded-lg hover:bg-white/10 transition-all"
                >
                  <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold">shaansoni21@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="https://github.com/ShaanSoni123" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive flex items-center gap-4 p-4 glass rounded-lg hover:bg-white/10 transition-all"
                >
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-400">GitHub</p>
                    <p className="font-semibold">@ShaanSoni123</p>
                  </div>
                </a>

                <a 
                  href="https://www.linkedin.com/in/shaan-soni/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive flex items-center gap-4 p-4 glass rounded-lg hover:bg-white/10 transition-all"
                >
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <div>
                    <p className="text-sm text-gray-400">LinkedIn</p>
                    <p className="font-semibold">Shaan Soni</p>
                  </div>
                </a>

                <a 
                  href="https://www.instagram.com/shaan.soni_1/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive flex items-center gap-4 p-4 glass rounded-lg hover:bg-white/10 transition-all"
                >
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <div>
                    <p className="text-sm text-gray-400">Instagram</p>
                    <p className="font-semibold">@shaan.soni_1</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="glass p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Availability</h3>
              <p className="text-gray-300 mb-4">
                Currently available for freelance projects and collaborations.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold">Available Now</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center text-gray-400"
        >
          <p className="mb-4">Built with Next.js, React Three Fiber, Framer Motion & GSAP</p>
          <p>&copy; 2024 Shaan Soni. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  )
}

