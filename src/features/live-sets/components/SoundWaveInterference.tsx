/**
 * SoundWaveInterference - Particles form sound waves that interfere
 * Each set creates waves that propagate and interfere with each other
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { LiveSet } from '../types'

interface SoundWaveInterferenceProps {
  liveSets?: LiveSet[]
  hoveredSetId?: string | null
}

// Position wave sources in 3D space
function getWaveSourcePosition(set: LiveSet, index: number, total: number): THREE.Vector3 {
  // Distribute sources in a circle
  const angle = (index / total) * Math.PI * 2
  const radius = 4
  const height = (index - total / 2) * 0.5
  
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  )
}

// Calculate wave displacement at a point
function calculateWaveDisplacement(
  point: THREE.Vector3,
  source: THREE.Vector3,
  time: number,
  frequency: number,
  speed: number
): number {
  const distance = point.distanceTo(source)
  const phase = (distance / speed - time) * frequency * Math.PI * 2
  return Math.sin(phase) / (1 + distance * 0.3) // Amplitude decreases with distance
}

export function SoundWaveInterference({
  liveSets = [],
  hoveredSetId = null,
}: SoundWaveInterferenceProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()
  const isMobileDevice = useIsMobile()
  
  // Wave source positions
  const waveSources = useMemo(() => {
    return liveSets.map((set, index) => ({
      set,
      position: getWaveSourcePosition(set, index, liveSets.length),
      index,
    }))
  }, [liveSets])
  
  // Particle count
  const particleCount = useMemo(() => {
    const target = isMobileDevice
      ? particleConfig.soundWaveInterference.waveParticles.mobile
      : particleConfig.soundWaveInterference.waveParticles.desktop
    return Math.min(target, settings.particleCount)
  }, [settings.particleCount, isMobileDevice])
  
  // Initialize particles in a grid - mostly still positions
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const basePositions = new Float32Array(particleCount * 3)
    const glitchPhases = new Float32Array(particleCount) // When to glitch
    const flashPhases = new Float32Array(particleCount) // When to flash
    const glitchIntensities = new Float32Array(particleCount) // How much to glitch
    const flashIntensities = new Float32Array(particleCount) // Flash intensity
    
    // Create a grid of particles
    const gridSize = Math.ceil(Math.sqrt(particleCount))
    const spacing = 0.3
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Grid position - mostly static
      const x = (i % gridSize - gridSize / 2) * spacing
      const z = (Math.floor(i / gridSize) - gridSize / 2) * spacing
      const y = (Math.random() - 0.5) * 2
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z
      
      // Random glitch/flash timing
      glitchPhases[i] = Math.random() * Math.PI * 2
      flashPhases[i] = Math.random() * Math.PI * 2
      glitchIntensities[i] = 0.05 + Math.random() * 0.1 // Glitch distance
      flashIntensities[i] = 0.3 + Math.random() * 0.7 // Flash intensity
    }
    
    return { positions, basePositions, glitchPhases, flashPhases, glitchIntensities, flashIntensities }
  }, [particleCount])
  
  // Animation frame - glitch and flash effects
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const material = particlesRef.current.material as THREE.PointsMaterial
    
    // Create opacity array for flashing
    const opacities = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      const basePos = new THREE.Vector3(
        particles.basePositions[i3],
        particles.basePositions[i3 + 1],
        particles.basePositions[i3 + 2]
      )
      
      // Glitch effect - sudden position jumps (more frequent and random)
      const glitchFrequency = 2.0 + Math.random() * 4.0
      const glitchTrigger = Math.sin(time * glitchFrequency + particles.glitchPhases[i])
      
      // Glitch when trigger crosses threshold (sudden jumps)
      let glitchOffset = new THREE.Vector3(0, 0, 0)
      if (Math.abs(glitchTrigger) > 0.85 || Math.random() > 0.98) {
        // Sudden glitch displacement - more pronounced
        const glitchAmount = particles.glitchIntensities[i] * 1.5
        glitchOffset.set(
          (Math.random() - 0.5) * glitchAmount,
          (Math.random() - 0.5) * glitchAmount,
          (Math.random() - 0.5) * glitchAmount
        )
      }
      
      // Flash effect - rapid opacity changes
      const flashSpeed = 8.0 + Math.random() * 6.0
      const flash = Math.sin(time * flashSpeed + particles.flashPhases[i])
      const flashIntensity = particles.flashIntensities[i]
      
      // Flash when crossing threshold - more dramatic
      if (flash > 0.8) {
        opacities[i] = 0.1 + flashIntensity * 1.0 // Bright flash
      } else if (flash < -0.8) {
        opacities[i] = 0.05 + flashIntensity * 0.2 // Dim flash
      } else {
        opacities[i] = 0.3 + flashIntensity * 0.4 // Normal
      }
      
      // Random extra flashes
      if (Math.random() > 0.97) {
        opacities[i] = Math.min(1.0, opacities[i] * 2.0)
      }
      
      // Hover effect - particles near hovered set flash more intensely
      if (hoveredSetId) {
        waveSources.forEach((source) => {
          if (hoveredSetId === source.set.id) {
            const distToSource = basePos.distanceTo(source.position)
            if (distToSource < 2.5) {
              // Increase flash intensity near source
              opacities[i] = Math.min(1.0, opacities[i] * 1.8)
              // More frequent glitches near source
              if (Math.random() > 0.92) {
                glitchOffset.multiplyScalar(2.0)
              }
            }
          }
        })
      }
      
      // Final position = base + glitch offset
      const finalPos = basePos.clone().add(glitchOffset)
      
      positions[i3] = finalPos.x
      positions[i3 + 1] = finalPos.y
      positions[i3 + 2] = finalPos.z
    }
    
    // Update positions
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    
    // Update opacity - use max for more dramatic flashing effect
    const maxOpacity = Math.max(...Array.from(opacities))
    const avgOpacity = opacities.reduce((a, b) => a + b, 0) / particleCount
    // Blend max and avg for visible flashing
    material.opacity = hoveredSetId 
      ? Math.min(1.0, (maxOpacity * 0.6 + avgOpacity * 0.4) * 1.3)
      : Math.min(0.9, maxOpacity * 0.5 + avgOpacity * 0.5)
  })
  
  if (waveSources.length === 0) return null
  
  return (
    <group>
      {/* Glitch particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color={hoveredSetId ? 0xe63946 : 0xffffff}
          transparent
          opacity={hoveredSetId ? 0.9 : 0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Wave source indicators */}
      {waveSources.map((source) => {
        const isHovered = hoveredSetId === source.set.id
        const isOtherHovered = hoveredSetId !== null && hoveredSetId !== source.set.id
        
        return (
          <mesh key={source.set.id} position={source.position}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial
              color={isHovered ? 0xe63946 : 0xffffff}
              transparent
              opacity={isOtherHovered ? 0.3 : isHovered ? 1 : 0.9}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default SoundWaveInterference
