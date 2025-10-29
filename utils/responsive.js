/**
 * Responsive utilities for handling different screen sizes
 */

export const breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
}

export const useResponsive = () => {
  if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: true }
  
  const width = window.innerWidth
  
  return {
    isMobile: width < breakpoints.tablet,
    isTablet: width >= breakpoints.tablet && width < breakpoints.desktop,
    isDesktop: width >= breakpoints.desktop,
    width
  }
}

/**
 * Get appropriate 3D scene scale based on screen size
 */
export const getSceneScale = () => {
  if (typeof window === 'undefined') return 1
  
  const width = window.innerWidth
  
  if (width < breakpoints.mobile) return 0.5
  if (width < breakpoints.tablet) return 0.7
  if (width < breakpoints.desktop) return 0.85
  return 1
}

/**
 * Get camera position based on screen size
 */
export const getCameraPosition = (defaultPosition = [0, 2, 5]) => {
  if (typeof window === 'undefined') return defaultPosition
  
  const width = window.innerWidth
  const [x, y, z] = defaultPosition
  
  if (width < breakpoints.tablet) {
    return [x, y, z * 1.5] // Move camera back on mobile
  }
  
  return defaultPosition
}

/**
 * Check if touch device
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

