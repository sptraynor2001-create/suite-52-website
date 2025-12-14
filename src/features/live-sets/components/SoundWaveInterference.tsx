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
  
  // Initialize particles in a grid
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const basePositions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    
    // Create a grid of particles
    const gridSize = Math.ceil(Math.sqrt(particleCount))
    const spacing = 0.3
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Grid position
      const x = (i % gridSize - gridSize / 2) * spacing
      const z = (Math.floor(i / gridSize) - gridSize / 2) * spacing
      const y = (Math.random() - 0.5) * 2
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z
      
      // Random velocity for initial motion
      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01
    }
    
    return { positions, basePositions, velocities }
  }, [particleCount])
  
  // Animation frame
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      const basePos = new THREE.Vector3(
        particles.basePositions[i3],
        particles.basePositions[i3 + 1],
        particles.basePositions[i3 + 2]
      )
      
      // Calculate total wave displacement from all sources
      let totalDisplacement = 0
      let maxAmplitude = 0
      
      waveSources.forEach((source) => {
        const isHovered = hoveredSetId === source.set.id
        const isOtherHovered = hoveredSetId !== null && hoveredSetId !== source.set.id
        
        // If hovering, fade out other waves
        if (isOtherHovered) {
          return // Skip this source
        }
        
        const displacement = calculateWaveDisplacement(
          basePos,
          source.position,
          time,
          particleConfig.soundWaveInterference.waveFrequency,
          particleConfig.soundWaveInterference.waveSpeed
        )
        
        // Interference: add waves together
        totalDisplacement += displacement
        maxAmplitude = Math.max(maxAmplitude, Math.abs(displacement))
      })
      
      // Apply interference strength
      const interference = totalDisplacement * particleConfig.soundWaveInterference.interferenceStrength
      
      // Calculate displacement direction (toward/away from sources)
      const displacementVector = new THREE.Vector3()
      waveSources.forEach((source) => {
        if (hoveredSetId !== null && hoveredSetId !== source.set.id) {
          return // Skip non-hovered sources
        }
        
        const direction = basePos.clone().sub(source.position).normalize()
        const distance = basePos.distanceTo(source.position)
        const waveStrength = Math.sin(
          (distance / particleConfig.soundWaveInterference.waveSpeed - time) *
          particleConfig.soundWaveInterference.waveFrequency * Math.PI * 2
        ) / (1 + distance * 0.3)
        
        displacementVector.addScaledVector(direction, waveStrength * 0.5)
      })
      
      // Final position = base + displacement
      const finalPos = basePos.clone().add(displacementVector.multiplyScalar(interference))
      
      // Add some vertical oscillation for wave effect
      finalPos.y += Math.sin(time * particleConfig.soundWaveInterference.waveFrequency + basePos.x * 0.5) * 0.1
      
      positions[i3] = finalPos.x
      positions[i3 + 1] = finalPos.y
      positions[i3 + 2] = finalPos.z
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  if (waveSources.length === 0) return null
  
  return (
    <group>
      {/* Wave particles */}
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
          size={0.02}
          color={hoveredSetId ? 0xe63946 : 0xffffff}
          transparent
          opacity={hoveredSetId ? 1.0 : 0.9}
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
