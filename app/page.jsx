'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import AudioManager from '@/components/AudioManager'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const mainRef = useRef(null)

  useEffect(() => {
    // Smooth scroll setup
    const ctx = gsap.context(() => {
      // Create scroll triggers for each section
      const sections = gsap.utils.toArray('.section')
      
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            console.log(`Entering section ${i}`)
          },
        })
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={mainRef} className="relative">
      <AudioManager />
      
      {/* Hero Section - Full screen 3D experience */}
      <section id="hero" className="section min-h-screen">
        <Hero />
      </section>

      {/* About Section - Scroll-triggered scene transition */}
      <section id="about" className="section min-h-screen">
        <About />
      </section>

      {/* Projects Section - Interactive 3D cards */}
      <section id="projects" className="section min-h-screen">
        <Projects />
      </section>

      {/* Gallery Section - Photo carousel with parallax */}
      <section id="gallery" className="section min-h-screen">
        <Gallery />
      </section>

      {/* Contact Section - Floating CTA */}
      <section id="contact" className="section min-h-screen">
        <Contact />
      </section>
    </main>
  )
}

