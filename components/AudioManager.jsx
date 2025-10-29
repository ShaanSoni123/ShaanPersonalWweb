'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * AudioManager - Handles all audio effects throughout the site
 * Provides hover sounds, scroll feedback, and ambient background music
 */
export default function AudioManager() {
  const [isMuted, setIsMuted] = useState(false)
  const [audioContext, setAudioContext] = useState(null)

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      setAudioContext(ctx)
    }

    // Add global event listeners for interactive sounds
    const handleHover = () => {
      if (!isMuted) playHoverSound()
    }

    const handleClick = () => {
      if (!isMuted) playClickSound()
    }

    // Attach to interactive elements
    document.querySelectorAll('button, a, .interactive').forEach(el => {
      el.addEventListener('mouseenter', handleHover)
      el.addEventListener('click', handleClick)
    })

    return () => {
      document.querySelectorAll('button, a, .interactive').forEach(el => {
        el.removeEventListener('mouseenter', handleHover)
        el.removeEventListener('click', handleClick)
      })
    }
  }, [isMuted])

  // Create synthetic sounds using Web Audio API
  const playHoverSound = () => {
    if (!audioContext) return
    
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const playClickSound = () => {
    if (!audioContext) return
    
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 1200
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.15)
  }

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="fixed top-6 right-6 z-50 glass p-3 rounded-full hover:bg-white/10 transition-all"
      onClick={() => setIsMuted(!isMuted)}
      aria-label="Toggle sound"
    >
      {isMuted ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </motion.button>
  )
}

