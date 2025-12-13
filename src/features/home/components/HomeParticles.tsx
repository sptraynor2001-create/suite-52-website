/**
 * HomeParticles - Whirlpool particle system for the home page
 * Particles slowly spiral inward with subtle micro-glitches
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Main particles - increased density
const PARTICLE_COUNT = 1400 // Much denser whirlpool
// Trail particles for motion blur effect (increased for more trails per glitch)
const TRAIL_COUNT = 500
const TRAILS_PER_GLITCH = 5 // Multiple trail points per glitching particle

// Mobile optimizations
const PARTICLE_COUNT_MOBILE = 600 // Reduced for mobile performance
const TRAIL_COUNT_MOBILE = 150 // Reduced trails for mobile
const MOBILE_FRAME_SKIP = 2 // Skip every other frame on mobile

interface WhirlpoolParticlesProps {
  mouseX?: number
  mouseY?: number
}

export function WhirlpoolParticles({ mouseX = 0, mouseY = 0 }: WhirlpoolParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const trailRef = useRef<THREE.Points>(null)
  
  // Detect mobile
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
  
  const activeParticleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT
  const activeTrailCount = isMobile ? TRAIL_COUNT_MOBILE : TRAIL_COUNT
  
  // Track previous positions for trails
  const prevPositions = useRef<Float32Array>(new Float32Array(activeParticleCount * 3))
  const glitchStates = useRef<Float32Array>(new Float32Array(activeParticleCount))
  const trailAges = useRef<Float32Array>(new Float32Array(activeTrailCount)) // Age of each trail particle
  const fadeTimers = useRef<Float32Array>(new Float32Array(activeParticleCount)) // Fade timer for each particle (0 = not fading, >0 = fading)
  const FADE_DURATION = 2.5 // Fade out over 2.5 seconds
  const frameCounter = useRef(0) // For mobile frame skipping

  // Particle data with randomness
  const particles = useMemo(() => {
    const positions = new Float32Array(activeParticleCount * 3)
    const colors = new Float32Array(activeParticleCount * 3) // RGB colors for opacity control
    const angles = new Float32Array(activeParticleCount)
    const startRadii = new Float32Array(activeParticleCount)
    const rotationSpeeds = new Float32Array(activeParticleCount)
    const zOffsets = new Float32Array(activeParticleCount)
    const lifetimes = new Float32Array(activeParticleCount)
    const canGlitch = new Float32Array(activeParticleCount)
    const sizes = new Float32Array(activeParticleCount) // Size variation per particle
    const glitchRates = new Float32Array(activeParticleCount) // Individual glitch rates
    const glitchOffsets = new Float32Array(activeParticleCount) // Individual glitch offset amounts

    for (let i = 0; i < activeParticleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2
      // Bias towards outer edges for more density on outside
      startRadii[i] = 10 + Math.random() * 12 // Start wider (10-22 instead of 8-18)
      // Speed variation: base speed with some randomness
      rotationSpeeds[i] = 0.015 + Math.random() * 0.02 // More variation in speed
      zOffsets[i] = (Math.random() - 0.5) * 6
      // Lifetime variation: wider range
      lifetimes[i] = Math.random() * 120 // Increased from 100
      // Glitchiness variation: 15-30% can glitch with varying rates
      const glitchChance = 0.15 + Math.random() * 0.15
      canGlitch[i] = Math.random() < glitchChance ? 1 : 0
      glitchRates[i] = 0.002 + Math.random() * 0.004 // Varying glitch rates
      glitchOffsets[i] = 0.06 + Math.random() * 0.04 // Varying glitch offset amounts
      // Size variation: slightly different sizes
      sizes[i] = 0.03 + Math.random() * 0.01 // 0.03 to 0.04

      const angle = angles[i]
      const radius = startRadii[i]
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = zOffsets[i]
      
      // Initialize colors to white (full opacity)
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 1.0
      colors[i * 3 + 2] = 1.0
    }

    return { positions, colors, angles, startRadii, rotationSpeeds, zOffsets, lifetimes, canGlitch, sizes, glitchRates, glitchOffsets }
  }, [activeParticleCount])

  // Trail particle data
  const trailParticles = useMemo(() => {
    const positions = new Float32Array(activeTrailCount * 3)
    const sourceIndices = new Uint16Array(activeTrailCount)
    
    for (let i = 0; i < activeTrailCount; i++) {
      // Each trail follows a random main particle
      sourceIndices[i] = Math.floor(Math.random() * activeParticleCount)
      positions[i * 3] = 1000 // Start hidden
      positions[i * 3 + 1] = 1000
      positions[i * 3 + 2] = 1000
    }
    
    return { positions, sourceIndices }
  }, [activeParticleCount, activeTrailCount])

  useFrame((state) => {
    if (!pointsRef.current) return

    // Mobile frame skipping for performance
    if (isMobile) {
      frameCounter.current++
      if (frameCounter.current % MOBILE_FRAME_SKIP !== 0) {
        return
      }
    }

    const time = state.clock.getElapsedTime()
    const deltaTime = state.clock.getDelta()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array

    for (let i = 0; i < activeParticleCount; i++) {
      const i3 = i * 3
      const startRadius = particles.startRadii[i]
      const rotationSpeed = particles.rotationSpeeds[i]
      const lifetime = particles.lifetimes[i]
      
      // Handle fade-out and reset
      if (fadeTimers.current[i] > 0) {
        // Particle is fading out
        fadeTimers.current[i] += deltaTime
        
        if (fadeTimers.current[i] >= FADE_DURATION) {
          // Fade complete - reset particle
          fadeTimers.current[i] = 0
          particles.angles[i] = Math.random() * Math.PI * 2
          particles.startRadii[i] = 10 + Math.random() * 12
          particles.rotationSpeeds[i] = 0.015 + Math.random() * 0.02
          particles.lifetimes[i] = Math.random() * 120
          particles.zOffsets[i] = (Math.random() - 0.5) * 6
          const glitchChance = 0.15 + Math.random() * 0.15
          particles.canGlitch[i] = Math.random() < glitchChance ? 1 : 0
          particles.glitchRates[i] = 0.002 + Math.random() * 0.004
          particles.glitchOffsets[i] = 0.06 + Math.random() * 0.04
          particles.sizes[i] = 0.03 + Math.random() * 0.01
          // Reset color to full opacity
          colors[i3] = 1.0
          colors[i3 + 1] = 1.0
          colors[i3 + 2] = 1.0
        } else {
          // Update opacity based on fade progress, combined with mouse opacity
          const fadeProgress = fadeTimers.current[i] / FADE_DURATION
          const fadeOpacity = 1.0 - fadeProgress
          const isWeb = typeof window !== 'undefined' && window.innerWidth >= 768
          const opacityMultiplier = isWeb ? 0.7 + (mouseY + 1) * 0.15 : 1.0
          const finalOpacity = fadeOpacity * opacityMultiplier
          colors[i3] = finalOpacity
          colors[i3 + 1] = finalOpacity
          colors[i3 + 2] = finalOpacity
        }
      }
      
      // Store previous position for trail
      prevPositions.current[i3] = positions[i3]
      prevPositions.current[i3 + 1] = positions[i3 + 1]
      prevPositions.current[i3 + 2] = positions[i3 + 2]
      
      // Mouse interaction (web only): X controls rotation direction, Y controls opacity and pull strength
      const isWeb = !isMobile && typeof window !== 'undefined' && window.innerWidth >= 768
      // Map mouseY (-1 to 1) to opacity - much more subtle range
      const opacityMultiplier = isWeb ? 0.7 + (mouseY + 1) * 0.15 : 1.0 // Down = 70% opacity, Up = 100% opacity (subtle)
      // Mouse Y also affects pull strength - very subtle
      const pullMultiplier = isWeb ? 1 + mouseY * 0.05 : 1 // Up = slightly stronger pull (very subtle)
      // Mouse X controls rotation direction - very subtle effect
      // Left = slightly counter-clockwise, Right = slightly clockwise, Center = balanced
      const rotationDirection = isWeb ? 1 + mouseX * 0.08 : 1 // 0.92 to 1.08 multiplier (very subtle)
      
      // Calculate progress
      const cycleLength = 100 // Faster cycle for more pronounced movement
      const adjustedTime = (time + lifetime) % cycleLength
      const progress = adjustedTime / cycleLength
      // More aggressive easing for more pronounced spiral
      const easedProgress = Math.pow(progress, 0.55) * pullMultiplier
      
      const minRadius = 0.2 // Tighter center
      const currentRadius = startRadius - (startRadius - minRadius) * easedProgress
      
      // Start fade when particle reaches center
      if (currentRadius < 0.25 && fadeTimers.current[i] === 0) {
        fadeTimers.current[i] = 0.001 // Start fade timer
      }
      
      // More pronounced acceleration towards center, modulated by mouse X position
      const rotationMultiplier = 1 + (1 - currentRadius / startRadius) * 1.8 // More dramatic acceleration
      const currentAngle = particles.angles[i] + (time * rotationSpeed * rotationMultiplier * rotationDirection)
      
      let x = Math.cos(currentAngle) * currentRadius
      let y = Math.sin(currentAngle) * currentRadius
      let z = particles.zOffsets[i] + Math.sin(time * 0.2 + i * 0.1) * 0.3
      
      // SUBTLE MICRO-GLITCH with variation
      if (particles.canGlitch[i] === 1 && fadeTimers.current[i] === 0) {
        // Use individual glitch rate
        if (Math.random() < particles.glitchRates[i]) {
          glitchStates.current[i] = 1
        }
        
        if (glitchStates.current[i] > 0) {
          // Use individual glitch offset amount
          const microOffset = particles.glitchOffsets[i]
          x += (Math.random() - 0.5) * microOffset
          y += (Math.random() - 0.5) * microOffset
          
          // Quick decay - snappy
          glitchStates.current[i] -= 0.3
          if (glitchStates.current[i] < 0) glitchStates.current[i] = 0
        }
      }
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      // Apply opacity multiplier to colors (only if not fading)
      if (fadeTimers.current[i] === 0) {
        // For white particles, all RGB components should be the same and equal to opacity
        colors[i3] = opacityMultiplier
        colors[i3 + 1] = opacityMultiplier
        colors[i3 + 2] = opacityMultiplier
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    if (pointsRef.current.geometry.attributes.color) {
      pointsRef.current.geometry.attributes.color.needsUpdate = true
    }
    
    // Update trail particles - create exaggerated motion blur for glitches
    // Skip trails on mobile for better performance (if frame is being processed)
    if (trailRef.current && (!isMobile || activeTrailCount > 0)) {
      const trailPositions = trailRef.current.geometry.attributes.position.array as Float32Array
      
      // Collect glitching particles
      const glitchingParticles: number[] = []
      for (let i = 0; i < activeParticleCount; i++) {
        if (glitchStates.current[i] > 0) {
          glitchingParticles.push(i)
        }
      }
      
      // Update trail ages and positions
      let trailIndex = 0
      for (let i = 0; i < activeTrailCount; i++) {
        const i3 = i * 3
        
        // Age trails
        trailAges.current[i] += deltaTime
        
        // Find a glitching particle for this trail
        if (glitchingParticles.length > 0 && trailIndex < glitchingParticles.length * TRAILS_PER_GLITCH) {
          const glitchIdx = Math.floor(trailIndex / TRAILS_PER_GLITCH) % glitchingParticles.length
          const sourceIdx = glitchingParticles[glitchIdx]
          const s3 = sourceIdx * 3
          
          // Create multiple trail points along the motion path
          const trailOffset = (trailIndex % TRAILS_PER_GLITCH) / TRAILS_PER_GLITCH
          // Extend trail further back and forward for exaggerated blur
          const t = -0.2 + trailOffset * 1.4 // Extends beyond normal range
          
          const dx = positions[s3] - prevPositions.current[s3]
          const dy = positions[s3 + 1] - prevPositions.current[s3 + 1]
          const dz = positions[s3 + 2] - prevPositions.current[s3 + 2]
          
          trailPositions[i3] = prevPositions.current[s3] + dx * t
          trailPositions[i3 + 1] = prevPositions.current[s3 + 1] + dy * t
          trailPositions[i3 + 2] = prevPositions.current[s3 + 2] + dz * t
          
          trailAges.current[i] = 0 // Reset age when active
          trailIndex++
        } else {
          // Fade out trails
          if (trailAges.current[i] < 0.15) {
            // Keep visible but fading
            trailAges.current[i] += deltaTime
          } else {
            // Hide trail by moving far away
            trailPositions[i3] = 1000
            trailPositions[i3 + 1] = 1000
            trailPositions[i3 + 2] = 1000
            trailAges.current[i] = 0.2 // Mark as hidden
          }
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      {/* Main particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={activeParticleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
            count={activeParticleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.03 : 0.035}
          color={0xffffff}
          transparent
          opacity={0.12}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </points>
      
      {/* Trail particles (motion blur) - reduced on mobile */}
      {(!isMobile || activeTrailCount > 0) && (
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailParticles.positions, 3]}
              count={activeTrailCount}
            array={trailParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
            size={isMobile ? 0.035 : 0.04}
          color={0xffffff}
          transparent
            opacity={0.11}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      )}
    </>
  )
}

// Red accent particles with subtle glitches
const ACCENT_COUNT = 16 // Very subtle accent - just a few red particles
const ACCENT_TRAIL_COUNT = 20 // Proportionally reduced trails
const ACCENT_TRAILS_PER_GLITCH = 5
const ACCENT_COUNT_MOBILE = 8 // Even fewer on mobile
const ACCENT_TRAIL_COUNT_MOBILE = 8 // Minimal trails on mobile

export function AccentParticles({ mouseX = 0, mouseY = 0 }: WhirlpoolParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const trailRef = useRef<THREE.Points>(null)
  
  // Mobile detection for optimization
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
  
  const activeAccentCount = isMobile ? ACCENT_COUNT_MOBILE : ACCENT_COUNT
  const activeAccentTrailCount = isMobile ? ACCENT_TRAIL_COUNT_MOBILE : ACCENT_TRAIL_COUNT
  
  const prevPositions = useRef<Float32Array>(new Float32Array(activeAccentCount * 3))
  const glitchStates = useRef<Float32Array>(new Float32Array(activeAccentCount))
  const trailAges = useRef<Float32Array>(new Float32Array(activeAccentTrailCount))
  const fadeTimers = useRef<Float32Array>(new Float32Array(activeAccentCount))
  const frameCounter = useRef(0)
  const ACCENT_FADE_DURATION = 2.5

  const particles = useMemo(() => {
    const positions = new Float32Array(activeAccentCount * 3)
    const colors = new Float32Array(activeAccentCount * 3) // RGB colors for opacity control
    const angles = new Float32Array(activeAccentCount)
    const startRadii = new Float32Array(activeAccentCount)
    const rotationSpeeds = new Float32Array(activeAccentCount)
    const lifetimes = new Float32Array(activeAccentCount)
    const zOffsets = new Float32Array(activeAccentCount)
    const canGlitch = new Float32Array(activeAccentCount)
    const sizes = new Float32Array(activeAccentCount)
    const glitchRates = new Float32Array(activeAccentCount)
    const glitchOffsets = new Float32Array(activeAccentCount)

    for (let i = 0; i < activeAccentCount; i++) {
      angles[i] = Math.random() * Math.PI * 2
      startRadii[i] = 6 + Math.random() * 8
      // Speed variation
      rotationSpeeds[i] = 0.008 + Math.random() * 0.015 // More variation
      // Lifetime variation
      lifetimes[i] = Math.random() * 120
      zOffsets[i] = (Math.random() - 0.5) * 4
      // Glitchiness variation: 20-35% can glitch
      const glitchChance = 0.2 + Math.random() * 0.15
      canGlitch[i] = Math.random() < glitchChance ? 1 : 0
      glitchRates[i] = 0.002 + Math.random() * 0.005
      glitchOffsets[i] = 0.08 + Math.random() * 0.04
      // Size variation - much wider range
      sizes[i] = 0.03 + Math.random() * 0.06 // 0.03 to 0.09 for more variety

      const angle = angles[i]
      const radius = startRadii[i]
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = zOffsets[i]
      
      // Initialize colors to red (full opacity)
      colors[i * 3] = 0.9 // R component of red
      colors[i * 3 + 1] = 0.22 // G component of red
      colors[i * 3 + 2] = 0.27 // B component of red
    }

    return { positions, colors, angles, startRadii, rotationSpeeds, lifetimes, zOffsets, canGlitch, sizes, glitchRates, glitchOffsets }
  }, [activeAccentCount])

  const trailParticles = useMemo(() => {
    const positions = new Float32Array(activeAccentTrailCount * 3)
    const sourceIndices = new Uint16Array(activeAccentTrailCount)
    
    for (let i = 0; i < activeAccentTrailCount; i++) {
      sourceIndices[i] = Math.floor(Math.random() * activeAccentCount)
      positions[i * 3] = 1000
      positions[i * 3 + 1] = 1000
      positions[i * 3 + 2] = 1000
    }
    
    return { positions, sourceIndices }
  }, [activeAccentCount, activeAccentTrailCount])

  useFrame((state) => {
    if (!pointsRef.current) return

    // Mobile frame skipping
    if (isMobile) {
      frameCounter.current++
      if (frameCounter.current % MOBILE_FRAME_SKIP !== 0) {
        return
      }
    }

    const time = state.clock.getElapsedTime()
    const deltaTime = state.clock.getDelta()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array

    for (let i = 0; i < activeAccentCount; i++) {
      const i3 = i * 3
      const startRadius = particles.startRadii[i]
      const rotationSpeed = particles.rotationSpeeds[i]
      const lifetime = particles.lifetimes[i]
      
      // Handle fade-out and reset
      if (fadeTimers.current[i] > 0) {
        // Particle is fading out
        fadeTimers.current[i] += deltaTime
        
        if (fadeTimers.current[i] >= ACCENT_FADE_DURATION) {
          // Fade complete - reset particle
          fadeTimers.current[i] = 0
          particles.angles[i] = Math.random() * Math.PI * 2
          particles.startRadii[i] = 6 + Math.random() * 8
          particles.rotationSpeeds[i] = 0.008 + Math.random() * 0.015
          particles.lifetimes[i] = Math.random() * 120
          particles.zOffsets[i] = (Math.random() - 0.5) * 4
          const glitchChance = 0.2 + Math.random() * 0.15
          particles.canGlitch[i] = Math.random() < glitchChance ? 1 : 0
          particles.glitchRates[i] = 0.002 + Math.random() * 0.005
          particles.glitchOffsets[i] = 0.08 + Math.random() * 0.04
          particles.sizes[i] = 0.03 + Math.random() * 0.06
          // Reset color to full opacity (red)
          colors[i3] = 0.9
          colors[i3 + 1] = 0.22
          colors[i3 + 2] = 0.27
        } else {
          // Update opacity based on fade progress, combined with mouse opacity
          const fadeProgress = fadeTimers.current[i] / ACCENT_FADE_DURATION
          const fadeOpacity = 1.0 - fadeProgress
          const isWeb = typeof window !== 'undefined' && window.innerWidth >= 768
          const opacityMultiplier = isWeb ? 0.7 + (mouseY + 1) * 0.15 : 1.0
          const finalOpacity = fadeOpacity * opacityMultiplier
          colors[i3] = 0.9 * finalOpacity
          colors[i3 + 1] = 0.22 * finalOpacity
          colors[i3 + 2] = 0.27 * finalOpacity
        }
      }
      
      prevPositions.current[i3] = positions[i3]
      prevPositions.current[i3 + 1] = positions[i3 + 1]
      prevPositions.current[i3 + 2] = positions[i3 + 2]
      
      // Mouse interaction (web only): X controls rotation direction, Y controls opacity and pull
      const isWeb = !isMobile && typeof window !== 'undefined' && window.innerWidth >= 768
      const opacityMultiplier = isWeb ? 0.7 + (mouseY + 1) * 0.15 : 1.0
      const pullMultiplier = isWeb ? 1 + mouseY * 0.05 : 1
      // Mouse X controls rotation direction - very subtle
      const rotationDirection = isWeb ? 1 + mouseX * 0.08 : 1
      
      // Calculate progress
      const cycleLength = 110 // Slightly faster for accent particles
      const adjustedTime = (time + lifetime) % cycleLength
      const progress = adjustedTime / cycleLength
      const easedProgress = Math.pow(progress, 0.55) * pullMultiplier
      
      const minRadius = 0.3
      const currentRadius = startRadius - (startRadius - minRadius) * easedProgress
      
      // Start fade when particle reaches center
      if (currentRadius < 0.35 && fadeTimers.current[i] === 0) {
        fadeTimers.current[i] = 0.001 // Start fade timer
      }
      
      const rotationMultiplier = 1 + (1 - currentRadius / startRadius) * 1.6
      const currentAngle = particles.angles[i] + (time * rotationSpeed * rotationMultiplier * rotationDirection)
      
      let x = Math.cos(currentAngle) * currentRadius
      let y = Math.sin(currentAngle) * currentRadius
      let z = particles.zOffsets[i]
      
      // Subtle micro-glitch for red particles with variation
      if (particles.canGlitch[i] === 1 && fadeTimers.current[i] === 0) {
        if (Math.random() < particles.glitchRates[i]) {
          glitchStates.current[i] = 1
        }
        
        if (glitchStates.current[i] > 0) {
          const microOffset = particles.glitchOffsets[i]
          x += (Math.random() - 0.5) * microOffset
          y += (Math.random() - 0.5) * microOffset
          
          glitchStates.current[i] -= 0.25
          if (glitchStates.current[i] < 0) glitchStates.current[i] = 0
        }
      }
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      // Apply opacity multiplier to colors (only if not fading)
      if (fadeTimers.current[i] === 0) {
        // For red particles, multiply RGB components by opacity
        colors[i3] = 0.9 * opacityMultiplier
        colors[i3 + 1] = 0.22 * opacityMultiplier
        colors[i3 + 2] = 0.27 * opacityMultiplier
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    if (pointsRef.current.geometry.attributes.color) {
      pointsRef.current.geometry.attributes.color.needsUpdate = true
    }
    
    // Update trail particles - create exaggerated motion blur for glitches
    if (trailRef.current && (!isMobile || activeAccentTrailCount > 0)) {
      const trailPositions = trailRef.current.geometry.attributes.position.array as Float32Array
      
      // Collect glitching particles
      const glitchingParticles: number[] = []
      for (let i = 0; i < activeAccentCount; i++) {
        if (glitchStates.current[i] > 0) {
          glitchingParticles.push(i)
        }
      }
      
      // Update trail ages and positions
      let trailIndex = 0
      for (let i = 0; i < activeAccentTrailCount; i++) {
        const i3 = i * 3
        
        // Age trails
        trailAges.current[i] += deltaTime
        
        // Find a glitching particle for this trail
        if (glitchingParticles.length > 0 && trailIndex < glitchingParticles.length * ACCENT_TRAILS_PER_GLITCH) {
          const glitchIdx = Math.floor(trailIndex / ACCENT_TRAILS_PER_GLITCH) % glitchingParticles.length
          const sourceIdx = glitchingParticles[glitchIdx]
          const s3 = sourceIdx * 3
          
          // Create multiple trail points along the motion path
          const trailOffset = (trailIndex % ACCENT_TRAILS_PER_GLITCH) / ACCENT_TRAILS_PER_GLITCH
          // Extend trail further back and forward for exaggerated blur
          const t = -0.2 + trailOffset * 1.4 // Extends beyond normal range
          
          const dx = positions[s3] - prevPositions.current[s3]
          const dy = positions[s3 + 1] - prevPositions.current[s3 + 1]
          const dz = positions[s3 + 2] - prevPositions.current[s3 + 2]
          
          trailPositions[i3] = prevPositions.current[s3] + dx * t
          trailPositions[i3 + 1] = prevPositions.current[s3 + 1] + dy * t
          trailPositions[i3 + 2] = prevPositions.current[s3 + 2] + dz * t
          
          trailAges.current[i] = 0 // Reset age when active
          trailIndex++
        } else {
          // Fade out trails
          if (trailAges.current[i] < 0.15) {
            // Keep visible but fading
            trailAges.current[i] += deltaTime
          } else {
            // Hide trail by moving far away
            trailPositions[i3] = 1000
            trailPositions[i3 + 1] = 1000
            trailPositions[i3 + 2] = 1000
            trailAges.current[i] = 0.2 // Mark as hidden
          }
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={activeAccentCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
            count={activeAccentCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.045 : 0.05}
          color={0xe63946}
          transparent
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </points>
      
      {/* Red trails - reduced on mobile */}
      {(!isMobile || activeAccentTrailCount > 0) && (
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailParticles.positions, 3]}
              count={activeAccentTrailCount}
            array={trailParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
            size={isMobile ? 0.045 : 0.05}
          color={0xe63946}
          transparent
            opacity={0.13}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </>
  )
}

// Blue accent particles
const BLUE_ACCENT_COUNT = 4 // 1/4 of red particles
const BLUE_ACCENT_TRAIL_COUNT = 5
const BLUE_ACCENT_TRAILS_PER_GLITCH = 5

export function BlueAccentParticles({ mouseX = 0, mouseY = 0 }: WhirlpoolParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const trailRef = useRef<THREE.Points>(null)
  const prevPositions = useRef<Float32Array>(new Float32Array(BLUE_ACCENT_COUNT * 3))
  const glitchStates = useRef<Float32Array>(new Float32Array(BLUE_ACCENT_COUNT))
  const trailAges = useRef<Float32Array>(new Float32Array(BLUE_ACCENT_TRAIL_COUNT))
  const fadeTimers = useRef<Float32Array>(new Float32Array(BLUE_ACCENT_COUNT))
  const FADE_DURATION = 2.5

  const particles = useMemo(() => {
    const positions = new Float32Array(BLUE_ACCENT_COUNT * 3)
    const colors = new Float32Array(BLUE_ACCENT_COUNT * 3)
    const angles = new Float32Array(BLUE_ACCENT_COUNT)
    const startRadii = new Float32Array(BLUE_ACCENT_COUNT)
    const rotationSpeeds = new Float32Array(BLUE_ACCENT_COUNT)
    const lifetimes = new Float32Array(BLUE_ACCENT_COUNT)
    const zOffsets = new Float32Array(BLUE_ACCENT_COUNT)
    const canGlitch = new Float32Array(BLUE_ACCENT_COUNT)
    const sizes = new Float32Array(BLUE_ACCENT_COUNT)
    const glitchRates = new Float32Array(BLUE_ACCENT_COUNT)
    const glitchOffsets = new Float32Array(BLUE_ACCENT_COUNT)

    for (let i = 0; i < BLUE_ACCENT_COUNT; i++) {
      angles[i] = Math.random() * Math.PI * 2
      startRadii[i] = 6 + Math.random() * 8
      rotationSpeeds[i] = 0.008 + Math.random() * 0.015
      lifetimes[i] = Math.random() * 120
      zOffsets[i] = (Math.random() - 0.5) * 4
      const glitchChance = 0.2 + Math.random() * 0.15
      canGlitch[i] = Math.random() < glitchChance ? 1 : 0
      glitchRates[i] = 0.002 + Math.random() * 0.005
      glitchOffsets[i] = 0.08 + Math.random() * 0.04
      sizes[i] = 0.03 + Math.random() * 0.06

      const angle = angles[i]
      const radius = startRadii[i]
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = zOffsets[i]
      
      // Initialize colors to blue
      colors[i * 3] = 0.26 // R
      colors[i * 3 + 1] = 0.65 // G
      colors[i * 3 + 2] = 0.96 // B
    }

    return { positions, colors, angles, startRadii, rotationSpeeds, lifetimes, zOffsets, canGlitch, sizes, glitchRates, glitchOffsets }
  }, [])

  const trailParticles = useMemo(() => {
    const positions = new Float32Array(BLUE_ACCENT_TRAIL_COUNT * 3)
    const sourceIndices = new Uint16Array(BLUE_ACCENT_TRAIL_COUNT)
    
    for (let i = 0; i < BLUE_ACCENT_TRAIL_COUNT; i++) {
      sourceIndices[i] = Math.floor(Math.random() * BLUE_ACCENT_COUNT)
      positions[i * 3] = 1000
      positions[i * 3 + 1] = 1000
      positions[i * 3 + 2] = 1000
    }
    
    return { positions, sourceIndices }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const deltaTime = state.clock.getDelta()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array

    for (let i = 0; i < BLUE_ACCENT_COUNT; i++) {
      const i3 = i * 3
      const startRadius = particles.startRadii[i]
      const rotationSpeed = particles.rotationSpeeds[i]
      const lifetime = particles.lifetimes[i]
      
      if (fadeTimers.current[i] > 0) {
        fadeTimers.current[i] += deltaTime
        
        if (fadeTimers.current[i] >= FADE_DURATION) {
          fadeTimers.current[i] = 0
          particles.angles[i] = Math.random() * Math.PI * 2
          particles.startRadii[i] = 6 + Math.random() * 8
          particles.rotationSpeeds[i] = 0.008 + Math.random() * 0.015
          particles.lifetimes[i] = Math.random() * 120
          particles.zOffsets[i] = (Math.random() - 0.5) * 4
          const glitchChance = 0.2 + Math.random() * 0.15
          particles.canGlitch[i] = Math.random() < glitchChance ? 1 : 0
          particles.glitchRates[i] = 0.002 + Math.random() * 0.005
          particles.glitchOffsets[i] = 0.08 + Math.random() * 0.04
          particles.sizes[i] = 0.03 + Math.random() * 0.06
          colors[i3] = 0.26
          colors[i3 + 1] = 0.65
          colors[i3 + 2] = 0.96
        } else {
          const fadeProgress = fadeTimers.current[i] / FADE_DURATION
          const fadeOpacity = 1.0 - fadeProgress
          const isWeb = typeof window !== 'undefined' && window.innerWidth >= 768
          const opacityMultiplier = isWeb ? 0.7 + (mouseY + 1) * 0.15 : 1.0
          const finalOpacity = fadeOpacity * opacityMultiplier
          colors[i3] = 0.26 * finalOpacity
          colors[i3 + 1] = 0.65 * finalOpacity
          colors[i3 + 2] = 0.96 * finalOpacity
        }
      }
      
      prevPositions.current[i3] = positions[i3]
      prevPositions.current[i3 + 1] = positions[i3 + 1]
      prevPositions.current[i3 + 2] = positions[i3 + 2]
      
      const isWeb = typeof window !== 'undefined' && window.innerWidth >= 768
      const opacityMultiplier = isWeb ? 0.15 + (mouseY + 1) * 0.425 : 1.0
      const pullMultiplier = isWeb ? 1 + mouseY * 0.3 : 1
      const rotationDirection = isWeb ? mouseX * 1.2 : 1
      
      const cycleLength = 110
      const adjustedTime = (time + lifetime) % cycleLength
      const progress = adjustedTime / cycleLength
      const easedProgress = Math.pow(progress, 0.55) * pullMultiplier
      
      const minRadius = 0.3
      const currentRadius = startRadius - (startRadius - minRadius) * easedProgress
      
      if (currentRadius < 0.35 && fadeTimers.current[i] === 0) {
        fadeTimers.current[i] = 0.001
      }
      
      const rotationMultiplier = 1 + (1 - currentRadius / startRadius) * 1.6
      const currentAngle = particles.angles[i] + (time * rotationSpeed * rotationMultiplier * rotationDirection)
      
      let x = Math.cos(currentAngle) * currentRadius
      let y = Math.sin(currentAngle) * currentRadius
      let z = particles.zOffsets[i]
      
      if (particles.canGlitch[i] === 1 && fadeTimers.current[i] === 0) {
        if (Math.random() < particles.glitchRates[i]) {
          glitchStates.current[i] = 1
        }
        
        if (glitchStates.current[i] > 0) {
          const microOffset = particles.glitchOffsets[i]
          x += (Math.random() - 0.5) * microOffset
          y += (Math.random() - 0.5) * microOffset
          
          glitchStates.current[i] -= 0.25
          if (glitchStates.current[i] < 0) glitchStates.current[i] = 0
        }
      }
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      if (fadeTimers.current[i] === 0) {
        colors[i3] = 0.26 * opacityMultiplier
        colors[i3 + 1] = 0.65 * opacityMultiplier
        colors[i3 + 2] = 0.96 * opacityMultiplier
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    if (pointsRef.current.geometry.attributes.color) {
      pointsRef.current.geometry.attributes.color.needsUpdate = true
    }
    
    if (trailRef.current) {
      const trailPositions = trailRef.current.geometry.attributes.position.array as Float32Array
      const glitchingParticles: number[] = []
      for (let i = 0; i < BLUE_ACCENT_COUNT; i++) {
        if (glitchStates.current[i] > 0) {
          glitchingParticles.push(i)
        }
      }
      
      let trailIndex = 0
      for (let i = 0; i < BLUE_ACCENT_TRAIL_COUNT; i++) {
        const i3 = i * 3
        trailAges.current[i] += deltaTime
        
        if (glitchingParticles.length > 0 && trailIndex < glitchingParticles.length * BLUE_ACCENT_TRAILS_PER_GLITCH) {
          const glitchIdx = Math.floor(trailIndex / BLUE_ACCENT_TRAILS_PER_GLITCH) % glitchingParticles.length
          const sourceIdx = glitchingParticles[glitchIdx]
          const s3 = sourceIdx * 3
          
          const trailOffset = (trailIndex % BLUE_ACCENT_TRAILS_PER_GLITCH) / BLUE_ACCENT_TRAILS_PER_GLITCH
          const t = -0.2 + trailOffset * 1.4
          
          const dx = positions[s3] - prevPositions.current[s3]
          const dy = positions[s3 + 1] - prevPositions.current[s3 + 1]
          const dz = positions[s3 + 2] - prevPositions.current[s3 + 2]
          
          trailPositions[i3] = prevPositions.current[s3] + dx * t
          trailPositions[i3 + 1] = prevPositions.current[s3 + 1] + dy * t
          trailPositions[i3 + 2] = prevPositions.current[s3 + 2] + dz * t
          
          trailAges.current[i] = 0
          trailIndex++
        } else {
          if (trailAges.current[i] < 0.15) {
            trailAges.current[i] += deltaTime
          } else {
            trailPositions[i3] = 1000
            trailPositions[i3 + 1] = 1000
            trailPositions[i3 + 2] = 1000
            trailAges.current[i] = 0.2
          }
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={BLUE_ACCENT_COUNT}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
            count={BLUE_ACCENT_COUNT}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={0x43a6f5}
          transparent
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </points>
      
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailParticles.positions, 3]}
            count={BLUE_ACCENT_TRAIL_COUNT}
            array={trailParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={0x43a6f5}
          transparent
          opacity={0.13}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

// Green accent particles
const GREEN_ACCENT_COUNT = 4
const GREEN_ACCENT_TRAIL_COUNT = 5
const GREEN_ACCENT_TRAILS_PER_GLITCH = 5

export function GreenAccentParticles({ mouseX = 0, mouseY = 0 }: WhirlpoolParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const trailRef = useRef<THREE.Points>(null)
  const prevPositions = useRef<Float32Array>(new Float32Array(GREEN_ACCENT_COUNT * 3))
  const glitchStates = useRef<Float32Array>(new Float32Array(GREEN_ACCENT_COUNT))
  const trailAges = useRef<Float32Array>(new Float32Array(GREEN_ACCENT_TRAIL_COUNT))
  const fadeTimers = useRef<Float32Array>(new Float32Array(GREEN_ACCENT_COUNT))
  const FADE_DURATION = 2.5

  const particles = useMemo(() => {
    const positions = new Float32Array(GREEN_ACCENT_COUNT * 3)
    const colors = new Float32Array(GREEN_ACCENT_COUNT * 3)
    const angles = new Float32Array(GREEN_ACCENT_COUNT)
    const startRadii = new Float32Array(GREEN_ACCENT_COUNT)
    const rotationSpeeds = new Float32Array(GREEN_ACCENT_COUNT)
    const lifetimes = new Float32Array(GREEN_ACCENT_COUNT)
    const zOffsets = new Float32Array(GREEN_ACCENT_COUNT)
    const canGlitch = new Float32Array(GREEN_ACCENT_COUNT)
    const sizes = new Float32Array(GREEN_ACCENT_COUNT)
    const glitchRates = new Float32Array(GREEN_ACCENT_COUNT)
    const glitchOffsets = new Float32Array(GREEN_ACCENT_COUNT)

    for (let i = 0; i < GREEN_ACCENT_COUNT; i++) {
      angles[i] = Math.random() * Math.PI * 2
      startRadii[i] = 6 + Math.random() * 8
      rotationSpeeds[i] = 0.008 + Math.random() * 0.015
      lifetimes[i] = Math.random() * 120
      zOffsets[i] = (Math.random() - 0.5) * 4
      const glitchChance = 0.2 + Math.random() * 0.15
      canGlitch[i] = Math.random() < glitchChance ? 1 : 0
      glitchRates[i] = 0.002 + Math.random() * 0.005
      glitchOffsets[i] = 0.08 + Math.random() * 0.04
      sizes[i] = 0.03 + Math.random() * 0.06

      const angle = angles[i]
      const radius = startRadii[i]
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = zOffsets[i]
      
      // Initialize colors to green
      colors[i * 3] = 0.18 // R
      colors[i * 3 + 1] = 0.85 // G
      colors[i * 3 + 2] = 0.39 // B
    }

    return { positions, colors, angles, startRadii, rotationSpeeds, lifetimes, zOffsets, canGlitch, sizes, glitchRates, glitchOffsets }
  }, [])

  const trailParticles = useMemo(() => {
    const positions = new Float32Array(GREEN_ACCENT_TRAIL_COUNT * 3)
    const sourceIndices = new Uint16Array(GREEN_ACCENT_TRAIL_COUNT)
    
    for (let i = 0; i < GREEN_ACCENT_TRAIL_COUNT; i++) {
      sourceIndices[i] = Math.floor(Math.random() * GREEN_ACCENT_COUNT)
      positions[i * 3] = 1000
      positions[i * 3 + 1] = 1000
      positions[i * 3 + 2] = 1000
    }
    
    return { positions, sourceIndices }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const deltaTime = state.clock.getDelta()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array

    for (let i = 0; i < GREEN_ACCENT_COUNT; i++) {
      const i3 = i * 3
      const startRadius = particles.startRadii[i]
      const rotationSpeed = particles.rotationSpeeds[i]
      const lifetime = particles.lifetimes[i]
      
      if (fadeTimers.current[i] > 0) {
        fadeTimers.current[i] += deltaTime
        
        if (fadeTimers.current[i] >= FADE_DURATION) {
          fadeTimers.current[i] = 0
          particles.angles[i] = Math.random() * Math.PI * 2
          particles.startRadii[i] = 6 + Math.random() * 8
          particles.rotationSpeeds[i] = 0.008 + Math.random() * 0.015
          particles.lifetimes[i] = Math.random() * 120
          particles.zOffsets[i] = (Math.random() - 0.5) * 4
          const glitchChance = 0.2 + Math.random() * 0.15
          particles.canGlitch[i] = Math.random() < glitchChance ? 1 : 0
          particles.glitchRates[i] = 0.002 + Math.random() * 0.005
          particles.glitchOffsets[i] = 0.08 + Math.random() * 0.04
          particles.sizes[i] = 0.03 + Math.random() * 0.06
          colors[i3] = 0.18
          colors[i3 + 1] = 0.85
          colors[i3 + 2] = 0.39
        } else {
          const fadeProgress = fadeTimers.current[i] / FADE_DURATION
          const fadeOpacity = 1.0 - fadeProgress
          const isWeb = typeof window !== 'undefined' && window.innerWidth >= 768
          const opacityMultiplier = isWeb ? 0.7 + (mouseY + 1) * 0.15 : 1.0
          const finalOpacity = fadeOpacity * opacityMultiplier
          colors[i3] = 0.18 * finalOpacity
          colors[i3 + 1] = 0.85 * finalOpacity
          colors[i3 + 2] = 0.39 * finalOpacity
        }
      }
      
      prevPositions.current[i3] = positions[i3]
      prevPositions.current[i3 + 1] = positions[i3 + 1]
      prevPositions.current[i3 + 2] = positions[i3 + 2]
      
      const isWeb = typeof window !== 'undefined' && window.innerWidth >= 768
      const opacityMultiplier = isWeb ? 0.15 + (mouseY + 1) * 0.425 : 1.0
      const pullMultiplier = isWeb ? 1 + mouseY * 0.3 : 1
      const rotationDirection = isWeb ? mouseX * 1.2 : 1
      
      const cycleLength = 110
      const adjustedTime = (time + lifetime) % cycleLength
      const progress = adjustedTime / cycleLength
      const easedProgress = Math.pow(progress, 0.55) * pullMultiplier
      
      const minRadius = 0.3
      const currentRadius = startRadius - (startRadius - minRadius) * easedProgress
      
      if (currentRadius < 0.35 && fadeTimers.current[i] === 0) {
        fadeTimers.current[i] = 0.001
      }
      
      const rotationMultiplier = 1 + (1 - currentRadius / startRadius) * 1.6
      const currentAngle = particles.angles[i] + (time * rotationSpeed * rotationMultiplier * rotationDirection)
      
      let x = Math.cos(currentAngle) * currentRadius
      let y = Math.sin(currentAngle) * currentRadius
      let z = particles.zOffsets[i]
      
      if (particles.canGlitch[i] === 1 && fadeTimers.current[i] === 0) {
        if (Math.random() < particles.glitchRates[i]) {
          glitchStates.current[i] = 1
        }
        
        if (glitchStates.current[i] > 0) {
          const microOffset = particles.glitchOffsets[i]
          x += (Math.random() - 0.5) * microOffset
          y += (Math.random() - 0.5) * microOffset
          
          glitchStates.current[i] -= 0.25
          if (glitchStates.current[i] < 0) glitchStates.current[i] = 0
        }
      }
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      if (fadeTimers.current[i] === 0) {
        colors[i3] = 0.18 * opacityMultiplier
        colors[i3 + 1] = 0.85 * opacityMultiplier
        colors[i3 + 2] = 0.39 * opacityMultiplier
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    if (pointsRef.current.geometry.attributes.color) {
      pointsRef.current.geometry.attributes.color.needsUpdate = true
    }
    
    if (trailRef.current) {
      const trailPositions = trailRef.current.geometry.attributes.position.array as Float32Array
      const glitchingParticles: number[] = []
      for (let i = 0; i < GREEN_ACCENT_COUNT; i++) {
        if (glitchStates.current[i] > 0) {
          glitchingParticles.push(i)
        }
      }
      
      let trailIndex = 0
      for (let i = 0; i < GREEN_ACCENT_TRAIL_COUNT; i++) {
        const i3 = i * 3
        trailAges.current[i] += deltaTime
        
        if (glitchingParticles.length > 0 && trailIndex < glitchingParticles.length * GREEN_ACCENT_TRAILS_PER_GLITCH) {
          const glitchIdx = Math.floor(trailIndex / GREEN_ACCENT_TRAILS_PER_GLITCH) % glitchingParticles.length
          const sourceIdx = glitchingParticles[glitchIdx]
          const s3 = sourceIdx * 3
          
          const trailOffset = (trailIndex % GREEN_ACCENT_TRAILS_PER_GLITCH) / GREEN_ACCENT_TRAILS_PER_GLITCH
          const t = -0.2 + trailOffset * 1.4
          
          const dx = positions[s3] - prevPositions.current[s3]
          const dy = positions[s3 + 1] - prevPositions.current[s3 + 1]
          const dz = positions[s3 + 2] - prevPositions.current[s3 + 2]
          
          trailPositions[i3] = prevPositions.current[s3] + dx * t
          trailPositions[i3 + 1] = prevPositions.current[s3 + 1] + dy * t
          trailPositions[i3 + 2] = prevPositions.current[s3 + 2] + dz * t
          
          trailAges.current[i] = 0
          trailIndex++
        } else {
          if (trailAges.current[i] < 0.15) {
            trailAges.current[i] += deltaTime
          } else {
            trailPositions[i3] = 1000
            trailPositions[i3 + 1] = 1000
            trailPositions[i3 + 2] = 1000
            trailAges.current[i] = 0.2
          }
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={GREEN_ACCENT_COUNT}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
            count={GREEN_ACCENT_COUNT}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={0x2ed963}
          transparent
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </points>
      
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailParticles.positions, 3]}
            count={GREEN_ACCENT_TRAIL_COUNT}
            array={trailParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={0x2ed963}
          transparent
          opacity={0.13}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

// Yellow accent particles
const YELLOW_ACCENT_COUNT = 4
const YELLOW_ACCENT_TRAIL_COUNT = 5
const YELLOW_ACCENT_TRAILS_PER_GLITCH = 5

export function YellowAccentParticles({ mouseX = 0, mouseY = 0 }: WhirlpoolParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const trailRef = useRef<THREE.Points>(null)
  const prevPositions = useRef<Float32Array>(new Float32Array(YELLOW_ACCENT_COUNT * 3))
  const glitchStates = useRef<Float32Array>(new Float32Array(YELLOW_ACCENT_COUNT))
  const trailAges = useRef<Float32Array>(new Float32Array(YELLOW_ACCENT_TRAIL_COUNT))
  const fadeTimers = useRef<Float32Array>(new Float32Array(YELLOW_ACCENT_COUNT))
  const FADE_DURATION = 2.5

  const particles = useMemo(() => {
    const positions = new Float32Array(YELLOW_ACCENT_COUNT * 3)
    const colors = new Float32Array(YELLOW_ACCENT_COUNT * 3)
    const angles = new Float32Array(YELLOW_ACCENT_COUNT)
    const startRadii = new Float32Array(YELLOW_ACCENT_COUNT)
    const rotationSpeeds = new Float32Array(YELLOW_ACCENT_COUNT)
    const lifetimes = new Float32Array(YELLOW_ACCENT_COUNT)
    const zOffsets = new Float32Array(YELLOW_ACCENT_COUNT)
    const canGlitch = new Float32Array(YELLOW_ACCENT_COUNT)
    const sizes = new Float32Array(YELLOW_ACCENT_COUNT)
    const glitchRates = new Float32Array(YELLOW_ACCENT_COUNT)
    const glitchOffsets = new Float32Array(YELLOW_ACCENT_COUNT)

    for (let i = 0; i < YELLOW_ACCENT_COUNT; i++) {
      angles[i] = Math.random() * Math.PI * 2
      startRadii[i] = 6 + Math.random() * 8
      rotationSpeeds[i] = 0.008 + Math.random() * 0.015
      lifetimes[i] = Math.random() * 120
      zOffsets[i] = (Math.random() - 0.5) * 4
      const glitchChance = 0.2 + Math.random() * 0.15
      canGlitch[i] = Math.random() < glitchChance ? 1 : 0
      glitchRates[i] = 0.002 + Math.random() * 0.005
      glitchOffsets[i] = 0.08 + Math.random() * 0.04
      sizes[i] = 0.03 + Math.random() * 0.06

      const angle = angles[i]
      const radius = startRadii[i]
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = zOffsets[i]
      
      // Initialize colors to yellow
      colors[i * 3] = 0.98 // R
      colors[i * 3 + 1] = 0.91 // G
      colors[i * 3 + 2] = 0.27 // B
    }

    return { positions, colors, angles, startRadii, rotationSpeeds, lifetimes, zOffsets, canGlitch, sizes, glitchRates, glitchOffsets }
  }, [])

  const trailParticles = useMemo(() => {
    const positions = new Float32Array(YELLOW_ACCENT_TRAIL_COUNT * 3)
    const sourceIndices = new Uint16Array(YELLOW_ACCENT_TRAIL_COUNT)
    
    for (let i = 0; i < YELLOW_ACCENT_TRAIL_COUNT; i++) {
      sourceIndices[i] = Math.floor(Math.random() * YELLOW_ACCENT_COUNT)
      positions[i * 3] = 1000
      positions[i * 3 + 1] = 1000
      positions[i * 3 + 2] = 1000
    }
    
    return { positions, sourceIndices }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const deltaTime = state.clock.getDelta()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array

    for (let i = 0; i < YELLOW_ACCENT_COUNT; i++) {
      const i3 = i * 3
      const startRadius = particles.startRadii[i]
      const rotationSpeed = particles.rotationSpeeds[i]
      const lifetime = particles.lifetimes[i]
      
      if (fadeTimers.current[i] > 0) {
        fadeTimers.current[i] += deltaTime
        
        if (fadeTimers.current[i] >= FADE_DURATION) {
          fadeTimers.current[i] = 0
          particles.angles[i] = Math.random() * Math.PI * 2
          particles.startRadii[i] = 6 + Math.random() * 8
          particles.rotationSpeeds[i] = 0.008 + Math.random() * 0.015
          particles.lifetimes[i] = Math.random() * 120
          particles.zOffsets[i] = (Math.random() - 0.5) * 4
          const glitchChance = 0.2 + Math.random() * 0.15
          particles.canGlitch[i] = Math.random() < glitchChance ? 1 : 0
          particles.glitchRates[i] = 0.002 + Math.random() * 0.005
          particles.glitchOffsets[i] = 0.08 + Math.random() * 0.04
          particles.sizes[i] = 0.03 + Math.random() * 0.06
          colors[i3] = 0.98
          colors[i3 + 1] = 0.91
          colors[i3 + 2] = 0.27
        } else {
          const fadeProgress = fadeTimers.current[i] / FADE_DURATION
          const fadeOpacity = 1.0 - fadeProgress
          const isWeb = typeof window !== 'undefined' && window.innerWidth >= 768
          const opacityMultiplier = isWeb ? 0.7 + (mouseY + 1) * 0.15 : 1.0
          const finalOpacity = fadeOpacity * opacityMultiplier
          colors[i3] = 0.98 * finalOpacity
          colors[i3 + 1] = 0.91 * finalOpacity
          colors[i3 + 2] = 0.27 * finalOpacity
        }
      }
      
      prevPositions.current[i3] = positions[i3]
      prevPositions.current[i3 + 1] = positions[i3 + 1]
      prevPositions.current[i3 + 2] = positions[i3 + 2]
      
      const isWeb = typeof window !== 'undefined' && window.innerWidth >= 768
      const opacityMultiplier = isWeb ? 0.15 + (mouseY + 1) * 0.425 : 1.0
      const pullMultiplier = isWeb ? 1 + mouseY * 0.3 : 1
      const rotationDirection = isWeb ? mouseX * 1.2 : 1
      
      const cycleLength = 110
      const adjustedTime = (time + lifetime) % cycleLength
      const progress = adjustedTime / cycleLength
      const easedProgress = Math.pow(progress, 0.55) * pullMultiplier
      
      const minRadius = 0.3
      const currentRadius = startRadius - (startRadius - minRadius) * easedProgress
      
      if (currentRadius < 0.35 && fadeTimers.current[i] === 0) {
        fadeTimers.current[i] = 0.001
      }
      
      const rotationMultiplier = 1 + (1 - currentRadius / startRadius) * 1.6
      const currentAngle = particles.angles[i] + (time * rotationSpeed * rotationMultiplier * rotationDirection)
      
      let x = Math.cos(currentAngle) * currentRadius
      let y = Math.sin(currentAngle) * currentRadius
      let z = particles.zOffsets[i]
      
      if (particles.canGlitch[i] === 1 && fadeTimers.current[i] === 0) {
        if (Math.random() < particles.glitchRates[i]) {
          glitchStates.current[i] = 1
        }
        
        if (glitchStates.current[i] > 0) {
          const microOffset = particles.glitchOffsets[i]
          x += (Math.random() - 0.5) * microOffset
          y += (Math.random() - 0.5) * microOffset
          
          glitchStates.current[i] -= 0.25
          if (glitchStates.current[i] < 0) glitchStates.current[i] = 0
        }
      }
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      if (fadeTimers.current[i] === 0) {
        colors[i3] = 0.98 * opacityMultiplier
        colors[i3 + 1] = 0.91 * opacityMultiplier
        colors[i3 + 2] = 0.27 * opacityMultiplier
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    if (pointsRef.current.geometry.attributes.color) {
      pointsRef.current.geometry.attributes.color.needsUpdate = true
    }
    
    if (trailRef.current) {
      const trailPositions = trailRef.current.geometry.attributes.position.array as Float32Array
      const glitchingParticles: number[] = []
      for (let i = 0; i < YELLOW_ACCENT_COUNT; i++) {
        if (glitchStates.current[i] > 0) {
          glitchingParticles.push(i)
        }
      }
      
      let trailIndex = 0
      for (let i = 0; i < YELLOW_ACCENT_TRAIL_COUNT; i++) {
        const i3 = i * 3
        trailAges.current[i] += deltaTime
        
        if (glitchingParticles.length > 0 && trailIndex < glitchingParticles.length * YELLOW_ACCENT_TRAILS_PER_GLITCH) {
          const glitchIdx = Math.floor(trailIndex / YELLOW_ACCENT_TRAILS_PER_GLITCH) % glitchingParticles.length
          const sourceIdx = glitchingParticles[glitchIdx]
          const s3 = sourceIdx * 3
          
          const trailOffset = (trailIndex % YELLOW_ACCENT_TRAILS_PER_GLITCH) / YELLOW_ACCENT_TRAILS_PER_GLITCH
          const t = -0.2 + trailOffset * 1.4
          
          const dx = positions[s3] - prevPositions.current[s3]
          const dy = positions[s3 + 1] - prevPositions.current[s3 + 1]
          const dz = positions[s3 + 2] - prevPositions.current[s3 + 2]
          
          trailPositions[i3] = prevPositions.current[s3] + dx * t
          trailPositions[i3 + 1] = prevPositions.current[s3 + 1] + dy * t
          trailPositions[i3 + 2] = prevPositions.current[s3 + 2] + dz * t
          
          trailAges.current[i] = 0
          trailIndex++
        } else {
          if (trailAges.current[i] < 0.15) {
            trailAges.current[i] += deltaTime
          } else {
            trailPositions[i3] = 1000
            trailPositions[i3 + 1] = 1000
            trailPositions[i3 + 2] = 1000
            trailAges.current[i] = 0.2
          }
        }
      }
      
      trailRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={YELLOW_ACCENT_COUNT}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
            count={YELLOW_ACCENT_COUNT}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={0xfae845}
          transparent
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </points>
      
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailParticles.positions, 3]}
            count={YELLOW_ACCENT_TRAIL_COUNT}
            array={trailParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={0xfae845}
          transparent
          opacity={0.13}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

export const HomeParticles = WhirlpoolParticles

export default WhirlpoolParticles