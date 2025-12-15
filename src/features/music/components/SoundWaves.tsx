/**
 * SoundWaves - Particles form sound waves emanating from each release
 * Each release creates concentric wave patterns like ripples in water
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { Release } from '../types'

interface SoundWavesProps {
  releases?: Release[]
  hoveredReleaseId?: string | null
}

// Calculate release position in 3D space
function getReleasePosition(release: Release, index: number, total: number): THREE.Vector3 {
  // Distribute releases in a circle
  const angle = (index / total) * Math.PI * 2
  const radius = 2.5
  const height = (index - total / 2) * 0.6
  
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  )
}

export function SoundWaves({
  releases = [],
  hoveredReleaseId = null,
}: SoundWavesProps) {
  const wavesRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()
  const isMobileDevice = useIsMobile()
  
  // Release positions
  const releasePositions = useMemo(() => {
    return releases.map((release, index) => ({
      release,
      position: getReleasePosition(release, index, releases.length),
      index,
    }))
  }, [releases])
  
  // Particles per release (4 releases = 4 wave sources)
  const particlesPerRelease = useMemo(() => {
    return isMobileDevice ? 200 : 400
  }, [isMobileDevice])
  
  const totalParticles = releases.length * particlesPerRelease
  
  // Initialize wave particles
  const waveParticles = useMemo(() => {
    const positions = new Float32Array(totalParticles * 3)
    const phases = new Float32Array(totalParticles)
    const releaseIndices = new Uint16Array(totalParticles)
    const waveRadii = new Float32Array(totalParticles)
    const waveSpeeds = new Float32Array(totalParticles)
    const angles = new Float32Array(totalParticles) // Angle around release
    
    let particleIndex = 0
    
    releasePositions.forEach((releasePos, releaseIndex) => {
      for (let i = 0; i < particlesPerRelease; i++) {
        const i3 = particleIndex * 3
        
        // Distribute particles in waves around release
        const angle = (i / particlesPerRelease) * Math.PI * 2 * 3 // 3 full rotations
        const baseRadius = 0.3 + (i % 4) * 0.15 // Multiple wave rings
        const waveRadius = baseRadius + Math.sin(angle * 2) * 0.1
        
        // Start position on XY plane (2D wave pattern)
        const x = releasePos.position.x + Math.cos(angle) * waveRadius
        const y = releasePos.position.y + Math.sin(angle) * waveRadius
        const z = releasePos.position.z
        
        positions[i3] = x
        positions[i3 + 1] = y
        positions[i3 + 2] = z
        
        phases[particleIndex] = Math.random() * Math.PI * 2
        releaseIndices[particleIndex] = releaseIndex
        waveRadii[particleIndex] = baseRadius
        waveSpeeds[particleIndex] = 0.3 + Math.random() * 0.2
        angles[particleIndex] = angle
        particleIndex++
      }
    })
    
    return {
      positions,
      phases,
      releaseIndices,
      waveRadii,
      waveSpeeds,
      angles,
    }
  }, [releasePositions, particlesPerRelease, totalParticles])
  
  // Animation
  useFrame((state) => {
    if (!wavesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = wavesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < totalParticles; i++) {
      const i3 = i * 3
      const releaseIndex = waveParticles.releaseIndices[i]
      const releasePos = releasePositions[releaseIndex]
      
      if (!releasePos) continue
      
      const phase = waveParticles.phases[i]
      const baseRadius = waveParticles.waveRadii[i]
      const waveSpeed = waveParticles.waveSpeeds[i]
      const angle = waveParticles.angles[i]
      
      // Create expanding wave effect
      const waveProgress = (time * waveSpeed + phase) % (Math.PI * 2)
      const currentRadius = baseRadius + Math.sin(waveProgress) * 0.4
      
      // Wave amplitude varies with distance (like sound waves)
      const amplitude = Math.sin(waveProgress * 2) * 0.15
      const verticalOffset = Math.sin(waveProgress * 3 + phase) * amplitude
      
      // Position on wave ring
      const x = releasePos.position.x + Math.cos(angle) * currentRadius
      const y = releasePos.position.y + Math.sin(angle) * currentRadius + verticalOffset
      const z = releasePos.position.z + Math.cos(waveProgress + phase) * 0.1
      
      // Hover effect - intensify waves
      const isHovered = hoveredReleaseId === releasePos.release.id
      if (isHovered) {
        const hoverAmplitude = Math.sin(time * 4 + phase) * 0.2
        positions[i3 + 1] = y + hoverAmplitude
        positions[i3 + 2] = z + hoverAmplitude * 0.5
      } else {
        positions[i3 + 1] = y
        positions[i3 + 2] = z
      }
      
      positions[i3] = x
    }
    
    wavesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  if (totalParticles === 0) return null
  
  return (
    <points ref={wavesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={totalParticles}
          array={waveParticles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={hoveredReleaseId ? 0xe63946 : 0xffffff}
        transparent
        opacity={hoveredReleaseId ? 0.9 : 0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default SoundWaves
