/**
 * FrequencyConstellation - Releases form constellations in frequency space
 * Particles connect releases showing musical relationships
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { breakpoints } from '@/themes/breakpoints'
import { Release } from '../types'

interface FrequencyConstellationProps {
  releases?: Release[]
  hoveredReleaseId?: string | null
}

// Calculate frequency position from release (use date as proxy for frequency)
function getFrequencyPosition(release: Release, index: number, total: number): THREE.Vector3 {
  // Distribute releases in 3D frequency space
  // Use release date and index to create unique positions
  const date = new Date(release.releaseDate)
  const timeValue = date.getTime() / 1000000000 // Normalize
  
  // Create frequency-based positioning
  const angle = (index / total) * Math.PI * 2
  const radius = 3 + (timeValue % 2) // Vary radius based on date
  const height = (index - total / 2) * 0.8
  
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  )
}

// Calculate connection strength between releases
function getConnectionStrength(release1: Release, release2: Release): number {
  // Releases closer in date have stronger connections
  const date1 = new Date(release1.releaseDate).getTime()
  const date2 = new Date(release2.releaseDate).getTime()
  const timeDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24 * 30) // Months
  return Math.max(0, 1 - timeDiff / 12) // Stronger if within 12 months
}

export function FrequencyConstellation({
  releases = [],
  hoveredReleaseId = null,
}: FrequencyConstellationProps) {
  const constellationRef = useRef<THREE.Group>(null)
  const connectionParticlesRef = useRef<THREE.Points>(null)
  const { settings, isMobile } = useQuality()
  
  // Detect mobile
  const isMobileDevice = typeof window !== 'undefined' && (
    window.innerWidth < breakpoints.tablet || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
  
  // Release positions
  const releasePositions = useMemo(() => {
    return releases.map((release, index) => ({
      release,
      position: getFrequencyPosition(release, index, releases.length),
      index,
    }))
  }, [releases])
  
  // Constellation clusters (particles around each release)
  const clusterParticleCount = useMemo(() => {
    return isMobileDevice
      ? particleConfig.frequencyConstellation.clusterParticles.mobile
      : particleConfig.frequencyConstellation.clusterParticles.desktop
  }, [isMobileDevice])
  
  const constellationParticles = useMemo(() => {
    const totalParticles = releasePositions.length * clusterParticleCount
    const positions = new Float32Array(totalParticles * 3)
    const baseOffsets = new Float32Array(totalParticles * 3)
    const phases = new Float32Array(totalParticles)
    const releaseIndices = new Uint16Array(totalParticles)
    
    let particleIndex = 0
    releasePositions.forEach((releasePos, releaseIndex) => {
      for (let i = 0; i < clusterParticleCount; i++) {
        const i3 = particleIndex * 3
        
        // Distribute particles in small sphere around release
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = 0.2 * Math.random()
        
        const offset = new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
        
        const finalPos = releasePos.position.clone().add(offset)
        
        positions[i3] = finalPos.x
        positions[i3 + 1] = finalPos.y
        positions[i3 + 2] = finalPos.z
        
        baseOffsets[i3] = offset.x
        baseOffsets[i3 + 1] = offset.y
        baseOffsets[i3 + 2] = offset.z
        
        phases[particleIndex] = Math.random() * Math.PI * 2
        releaseIndices[particleIndex] = releaseIndex
        
        particleIndex++
      }
    })
    
    return { positions, baseOffsets, phases, releaseIndices, totalCount: totalParticles }
  }, [releasePositions, clusterParticleCount])
  
  // Connection particles (flowing between releases)
  const connectionParticleCount = useMemo(() => {
    const target = isMobileDevice
      ? particleConfig.frequencyConstellation.connectionParticles.mobile
      : particleConfig.frequencyConstellation.connectionParticles.desktop
    return Math.min(target, settings.particleCount / 5)
  }, [settings.particleCount, isMobileDevice])
  
  const connectionParticles = useMemo(() => {
    if (releasePositions.length < 2) {
      return { positions: new Float32Array(0), progress: new Float32Array(0), connections: [] }
    }
    
    const positions = new Float32Array(connectionParticleCount * 3)
    const progress = new Float32Array(connectionParticleCount) // 0-1 along connection path
    const connections: Array<{ start: number; end: number; particleIndex: number }> = []
    
    // Create connections between releases
    const connectionPaths: Array<{ start: number; end: number; strength: number }> = []
    for (let i = 0; i < releasePositions.length; i++) {
      for (let j = i + 1; j < releasePositions.length; j++) {
        const strength = getConnectionStrength(
          releasePositions[i].release,
          releasePositions[j].release
        )
        if (strength > 0.3) { // Only show strong connections
          connectionPaths.push({ start: i, end: j, strength })
        }
      }
    }
    
    // Distribute particles across connections
    let particleIndex = 0
    connectionPaths.forEach((path) => {
      const particlesPerConnection = Math.ceil(connectionParticleCount / connectionPaths.length)
      for (let i = 0; i < particlesPerConnection && particleIndex < connectionParticleCount; i++) {
        const startPos = releasePositions[path.start].position
        const endPos = releasePositions[path.end].position
        
        const t = Math.random()
        const point = new THREE.Vector3().lerpVectors(startPos, endPos, t)
        
        const i3 = particleIndex * 3
        positions[i3] = point.x
        positions[i3 + 1] = point.y
        positions[i3 + 2] = point.z
        
        progress[particleIndex] = t
        connections.push({ start: path.start, end: path.end, particleIndex })
        
        particleIndex++
      }
    })
    
    return { positions, progress, connections, totalCount: particleIndex }
  }, [releasePositions, connectionParticleCount])
  
  // Animation frame
  useFrame((state) => {
    if (!constellationRef.current || !connectionParticlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    // Update constellation clusters (pulsing and orbiting)
    const clusterPositions = constellationRef.current.children[0]?.geometry?.attributes?.position?.array as Float32Array | undefined
    if (clusterPositions) {
      for (let i = 0; i < constellationParticles.totalCount; i++) {
        const i3 = i * 3
        const releaseIndex = constellationParticles.releaseIndices[i]
        const releasePos = releasePositions[releaseIndex]
        const isHovered = hoveredReleaseId === releasePos.release.id
        
        const baseOffset = new THREE.Vector3(
          constellationParticles.baseOffsets[i3],
          constellationParticles.baseOffsets[i3 + 1],
          constellationParticles.baseOffsets[i3 + 2]
        )
        
        // Pulse animation
        const pulse = 0.8 + Math.sin(time * particleConfig.frequencyConstellation.pulseSpeed + constellationParticles.phases[i]) * 0.2
        const scaledOffset = baseOffset.clone().multiplyScalar(pulse)
        
        // Hover enhancement - tighter cluster
        if (isHovered) {
          scaledOffset.multiplyScalar(0.7)
        }
        
        const finalPos = releasePos.position.clone().add(scaledOffset)
        
        clusterPositions[i3] = finalPos.x
        clusterPositions[i3 + 1] = finalPos.y
        clusterPositions[i3 + 2] = finalPos.z
      }
      ;(constellationRef.current.children[0] as THREE.Points)?.geometry?.attributes?.position?.needsUpdate && 
        ((constellationRef.current.children[0] as THREE.Points).geometry.attributes.position.needsUpdate = true)
    }
    
    // Update connection particles (flow along paths)
    const connectionPositions = connectionParticlesRef.current.geometry.attributes.position.array as Float32Array
    connectionParticles.connections.forEach((conn) => {
      const startPos = releasePositions[conn.start].position
      const endPos = releasePositions[conn.end].position
      const isStartHovered = hoveredReleaseId === releasePositions[conn.start].release.id
      const isEndHovered = hoveredReleaseId === releasePositions[conn.end].release.id
      const isConnectionHovered = isStartHovered || isEndHovered
      
      // Update progress along path
      connectionParticles.progress[conn.particleIndex] += particleConfig.frequencyConstellation.flowSpeed * 0.01
      if (connectionParticles.progress[conn.particleIndex] > 1) {
        connectionParticles.progress[conn.particleIndex] = 0
      }
      
      const t = connectionParticles.progress[conn.particleIndex]
      const point = new THREE.Vector3().lerpVectors(startPos, endPos, t)
      
      // Add slight arc to path
      const arcHeight = Math.sin(t * Math.PI) * 0.3
      point.y += arcHeight
      
      const i3 = conn.particleIndex * 3
      connectionPositions[i3] = point.x
      connectionPositions[i3 + 1] = point.y
      connectionPositions[i3 + 2] = point.z
    })
    
    connectionParticlesRef.current.geometry.attributes.position.needsUpdate = true
    
    // Rotate entire constellation slowly
    constellationRef.current.rotation.y = time * 0.05
  })
  
  if (releasePositions.length === 0) return null
  
  return (
    <group ref={constellationRef}>
      {/* Constellation clusters */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={constellationParticles.totalCount}
            array={constellationParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={hoveredReleaseId ? 0xe63946 : 0xffffff}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Connection particles */}
      {connectionParticles.totalCount > 0 && (
        <points ref={connectionParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={connectionParticles.totalCount}
              array={connectionParticles.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.015}
            color={0xe63946}
            transparent
            opacity={0.4}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  )
}

export default FrequencyConstellation
