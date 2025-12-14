/**
 * ParticleDataStream - Particles flow in streams from contact points
 * Streams combine and split showing routing/connections
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { breakpoints } from '@/themes/breakpoints'

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
  const { settings, isMobile } = useQuality()
  
  // Detect mobile
  const isMobileDevice = typeof window !== 'undefined' && (
    window.innerWidth < breakpoints.tablet || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
  
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
  
  // Initialize particles
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const progress = new Float32Array(particleCount) // 0-1 progress along stream
    const streamIndices = new Uint16Array(particleCount) // Which stream this particle belongs to
    const speeds = new Float32Array(particleCount) // Individual particle speeds
    
    // Distribute particles across streams
    let particleIndex = 0
    streamSources.forEach((source, sourceIndex) => {
      const particlesPerStream = Math.ceil(particleCount / streamSources.length)
      
      for (let i = 0; i < particlesPerStream && particleIndex < particleCount; i++) {
        const i3 = particleIndex * 3
        
        // Start at source position
        positions[i3] = source.position.x
        positions[i3 + 1] = source.position.y
        positions[i3 + 2] = source.position.z
        
        // Random starting progress
        progress[particleIndex] = Math.random()
        streamIndices[particleIndex] = sourceIndex
        speeds[particleIndex] = particleConfig.particleDataStream.streamSpeed * (0.8 + Math.random() * 0.4)
        
        particleIndex++
      }
    })
    
    return { positions, progress, streamIndices, speeds, totalCount: particleIndex }
  }, [particleCount, streamSources])
  
  // Animation frame
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
        // Fade out particles in non-hovered streams
        continue
      }
      
      // Update progress along stream
      particles.progress[i] += particles.speeds[i] * 0.01
      
      // Reset when reaching end
      if (particles.progress[i] > 1) {
        particles.progress[i] = 0
      }
      
      // Calculate position along stream path
      const startPos = source.position
      const endPos = hubPosition
      
      // First part: from source to hub
      let currentPos: THREE.Vector3
      if (particles.progress[i] < particleConfig.particleDataStream.mergeIntensity) {
        // Before merge point
        const t = particles.progress[i] / particleConfig.particleDataStream.mergeIntensity
        currentPos = getStreamPoint(startPos, endPos, t, 0.3)
      } else {
        // After merge point - particles flow together
        const t = (particles.progress[i] - particleConfig.particleDataStream.mergeIntensity) / 
                  (1 - particleConfig.particleDataStream.mergeIntensity)
        
        // Flow from hub outward (or to another destination)
        const mergedPos = endPos.clone()
        const flowDirection = new THREE.Vector3(
          Math.sin(time * 0.5 + streamIndex),
          Math.cos(time * 0.3 + streamIndex),
          Math.sin(time * 0.4 + streamIndex)
        ).normalize()
        
        currentPos = mergedPos.clone().addScaledVector(flowDirection, t * 2)
      }
      
      // Hover enhancement - particles move faster and cluster tighter
      if (isHovered) {
        const hoverBoost = 1.5
        particles.progress[i] += particles.speeds[i] * 0.01 * (hoverBoost - 1)
        
        // Tighter stream width
        const streamWidth = particleConfig.particleDataStream.streamWidth * 0.5
        const perpendicular = new THREE.Vector3(
          Math.sin(time + i),
          Math.cos(time + i * 0.7),
          Math.sin(time * 0.5 + i)
        ).normalize()
        currentPos.addScaledVector(perpendicular, (Math.random() - 0.5) * streamWidth)
      } else {
        // Normal stream width
        const streamWidth = particleConfig.particleDataStream.streamWidth
        const perpendicular = new THREE.Vector3(
          Math.sin(time + i),
          Math.cos(time + i * 0.7),
          Math.sin(time * 0.5 + i)
        ).normalize()
        currentPos.addScaledVector(perpendicular, (Math.random() - 0.5) * streamWidth)
      }
      
      positions[i3] = currentPos.x
      positions[i3 + 1] = currentPos.y
      positions[i3 + 2] = currentPos.z
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
          size={0.02}
          color={hoveredContact ? 0xe63946 : 0xffffff}
          transparent
          opacity={hoveredContact ? 0.8 : 0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
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
              opacity={isOtherHovered ? 0.2 : isHovered ? 1 : 0.5}
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
          opacity={hoveredContact ? 0.8 : 0.4}
        />
      </mesh>
    </group>
  )
}

export default ParticleDataStream
