/**
 * ParticleDataStream - Particles flow in streams from contact points
 * Streams combine and split showing routing/connections
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { whiteParticleMaterial, redParticleMaterial } from '@/shared/components/3d/particleMaterials'

interface ContactMethod {
  id: string
  label: string
  value: string
  type: 'email' | 'social'
}

interface ParticleDataStreamProps {
  contactMethods?: ContactMethod[]
  hoveredContact?: string | null
}

// Position contact methods as stream sources
function getStreamSourcePosition(method: ContactMethod, index: number, total: number): THREE.Vector3 {
  // Distribute sources in a circle
  const angle = (index / total) * Math.PI * 2
  const radius = 3.5
  const height = (index - total / 2) * 0.6
  
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  )
}

// Calculate point on a curved stream path
function getStreamPoint(
  start: THREE.Vector3,
  end: THREE.Vector3,
  t: number, // 0-1 progress along path
  arcHeight: number = 0.5
): THREE.Vector3 {
  // Linear interpolation
  const linear = new THREE.Vector3().lerpVectors(start, end, t)
  
  // Add arc for curved path
  const arc = Math.sin(t * Math.PI) * arcHeight
  const up = new THREE.Vector3(0, 1, 0)
  linear.addScaledVector(up, arc)
  
  return linear
}

export function ParticleDataStream({
  contactMethods = [],
  hoveredContact = null,
}: ParticleDataStreamProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()
  const isMobileDevice = useIsMobile()
  
  // Stream source positions
  const streamSources = useMemo(() => {
    return contactMethods.map((method, index) => ({
      method,
      position: getStreamSourcePosition(method, index, contactMethods.length),
      index,
    }))
  }, [contactMethods])
  
  // Central hub position (where streams merge)
  const hubPosition = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  
  // Particle count
  const particleCount = useMemo(() => {
    const target = isMobileDevice
      ? particleConfig.particleDataStream.streamParticles.mobile
      : particleConfig.particleDataStream.streamParticles.desktop
    return Math.min(target, settings.particleCount)
  }, [settings.particleCount, isMobileDevice])
  
  // Initialize particles - simpler distribution
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const progress = new Float32Array(particleCount) // 0-1 progress along stream
    const streamIndices = new Uint16Array(particleCount) // Which stream this particle belongs to
    const speeds = new Float32Array(particleCount) // Individual particle speeds
    const phases = new Float32Array(particleCount) // For variation
    
    // Distribute particles across streams evenly
    let particleIndex = 0
    streamSources.forEach((source, sourceIndex) => {
      const particlesPerStream = Math.ceil(particleCount / streamSources.length)
      
      for (let i = 0; i < particlesPerStream && particleIndex < particleCount; i++) {
        const i3 = particleIndex * 3
        
        // Start at source position with slight offset
        const offset = (i / particlesPerStream) * 2 - 1 // -1 to 1
        positions[i3] = source.position.x
        positions[i3 + 1] = source.position.y
        positions[i3 + 2] = source.position.z
        
        // Random starting progress along stream
        progress[particleIndex] = Math.random()
        streamIndices[particleIndex] = sourceIndex
        speeds[particleIndex] = particleConfig.particleDataStream.streamSpeed * (0.7 + Math.random() * 0.6)
        phases[particleIndex] = Math.random() * Math.PI * 2
        
        particleIndex++
      }
    })
    
    return { positions, progress, streamIndices, speeds, phases, totalCount: particleIndex }
  }, [particleCount, streamSources])
  
  // Animation frame - simplified stream flow
  useFrame((state) => {
    if (!particlesRef.current || streamSources.length === 0) return
    
    const time = state.clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particles.totalCount; i++) {
      const i3 = i * 3
      const streamIndex = particles.streamIndices[i]
      const source = streamSources[streamIndex]
      const isHovered = hoveredContact === source.method.id
      const isOtherHovered = hoveredContact !== null && hoveredContact !== source.method.id
      
      // Skip non-hovered streams if another is hovered
      if (isOtherHovered) {
        continue
      }
      
      // Update progress along stream
      const speedMultiplier = isHovered ? 1.8 : 1.0
      particles.progress[i] += particles.speeds[i] * 0.01 * speedMultiplier
      
      // Reset when reaching end
      if (particles.progress[i] > 1) {
        particles.progress[i] = 0
      }
      
      // Simple stream: particles flow from source toward center (hub)
      const startPos = source.position
      const endPos = hubPosition
      const t = particles.progress[i]
      
      // Create curved stream path
      const streamPos = getStreamPoint(startPos, endPos, t, 0.4)
      
      // Add stream width variation (perpendicular to flow)
      const streamWidth = isHovered 
        ? particleConfig.particleDataStream.streamWidth * 0.4
        : particleConfig.particleDataStream.streamWidth
      
      // Perpendicular direction (perpendicular to stream direction)
      const streamDir = endPos.clone().sub(startPos).normalize()
      const perp1 = new THREE.Vector3(-streamDir.z, 0, streamDir.x).normalize()
      const perp2 = new THREE.Vector3(0, 1, 0)
      
      // Combine perpendiculars with phase for smooth variation
      const phase = particles.phases[i]
      const perpOffset = perp1.clone().multiplyScalar(
        Math.sin(time * 0.5 + phase) * streamWidth
      ).add(
        perp2.clone().multiplyScalar(
          Math.cos(time * 0.7 + phase) * streamWidth * 0.5
        )
      )
      
      const finalPos = streamPos.clone().add(perpOffset)
      
      positions[i3] = finalPos.x
      positions[i3 + 1] = finalPos.y
      positions[i3 + 2] = finalPos.z
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  if (streamSources.length === 0) return null
  
  return (
    <group>
      {/* Stream particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.totalCount}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          {...(hoveredContact ? redParticleMaterial : whiteParticleMaterial)}
        />
      </points>
      
      {/* Stream source indicators */}
      {streamSources.map((source) => {
        const isHovered = hoveredContact === source.method.id
        const isOtherHovered = hoveredContact !== null && hoveredContact !== source.method.id
        
        return (
          <mesh key={source.method.id} position={source.position}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial
              color={isHovered ? 0xe63946 : 0xffffff}
              transparent
              opacity={isOtherHovered ? 0.3 : isHovered ? 1 : 0.9}
            />
          </mesh>
        )
      })}
      
      {/* Central hub */}
      <mesh position={hubPosition}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={hoveredContact ? 0xe63946 : 0xffffff}
          transparent
          opacity={hoveredContact ? 1.0 : 0.85}
        />
      </mesh>
    </group>
  )
}

export default ParticleDataStream
