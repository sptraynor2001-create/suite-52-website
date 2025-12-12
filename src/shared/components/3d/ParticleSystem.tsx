/**
 * ParticleSystem - Reusable particle field with presets
 * Organic/digital duality: some particles drift naturally, others follow grid patterns
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from './AdaptiveQuality'

interface ParticleSystemProps {
  count?: number
  size?: number
  color?: string | number
  opacity?: number
  speed?: number
  spread?: number
  organicRatio?: number // 0-1, how many particles are organic vs digital
  mouseInfluence?: number // How much particles react to mouse
  preset?: 'ambient' | 'portal' | 'dense' | 'sparse'
}

const presets = {
  ambient: { count: 2000, size: 0.02, speed: 0.3, spread: 15, organicRatio: 0.7 },
  portal: { count: 3000, size: 0.015, speed: 0.5, spread: 8, organicRatio: 0.5 },
  dense: { count: 5000, size: 0.01, speed: 0.2, spread: 10, organicRatio: 0.4 },
  sparse: { count: 1000, size: 0.03, speed: 0.4, spread: 20, organicRatio: 0.8 },
}

export function ParticleSystem({
  count: propCount,
  size = 0.02,
  color = 0xffffff,
  opacity = 0.6,
  speed = 0.3,
  spread = 15,
  organicRatio = 0.7,
  mouseInfluence = 0.5,
  preset,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { settings, isMobile } = useQuality()

  // Apply preset if provided
  const config = preset ? { ...presets[preset] } : { count: propCount, size, speed, spread, organicRatio }
  
  // Adjust count based on quality settings
  const particleCount = Math.min(
    config.count || settings.particleCount,
    settings.particleCount
  )

  // Generate particle positions and velocities
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)
    const isOrganic = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Position - spread in 3D space
      positions[i3] = (Math.random() - 0.5) * (config.spread || spread)
      positions[i3 + 1] = (Math.random() - 0.5) * (config.spread || spread)
      positions[i3 + 2] = (Math.random() - 0.5) * (config.spread || spread)

      // Velocity - organic particles drift, digital ones follow patterns
      const organic = Math.random() < (config.organicRatio || organicRatio)
      isOrganic[i] = organic ? 1 : 0

      if (organic) {
        // Organic: smooth, curved movements
        velocities[i3] = (Math.random() - 0.5) * 0.02
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02 + 0.005 // Slight upward drift
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
      } else {
        // Digital: grid-aligned, snappy movements
        velocities[i3] = (Math.random() > 0.5 ? 1 : -1) * 0.01
        velocities[i3 + 1] = 0
        velocities[i3 + 2] = (Math.random() > 0.5 ? 1 : -1) * 0.01
      }

      // Phase offset for animation variety
      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, velocities, phases, isOrganic }
  }, [particleCount, spread, organicRatio, config])

  // Animation
  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime() * (config.speed || speed)
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    // Mouse position in normalized coordinates
    const mouse = state.pointer

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const phase = particles.phases[i]
      const organic = particles.isOrganic[i] === 1

      if (organic) {
        // Organic movement: sine waves, drift
        positions[i3] += Math.sin(time + phase) * 0.002
        positions[i3 + 1] += Math.cos(time * 0.7 + phase) * 0.002 + 0.001
        positions[i3 + 2] += Math.sin(time * 0.5 + phase) * 0.002
      } else {
        // Digital movement: step-based, grid-like
        if (Math.random() < 0.01) {
          positions[i3] += particles.velocities[i3]
          positions[i3 + 2] += particles.velocities[i3 + 2]
        }
      }

      // Mouse influence (desktop only for performance)
      if (!isMobile && mouseInfluence > 0) {
        const dx = positions[i3] - mouse.x * 5
        const dy = positions[i3 + 1] - mouse.y * 5
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 3) {
          const force = (1 - dist / 3) * mouseInfluence * 0.01
          positions[i3] += dx * force
          positions[i3 + 1] += dy * force
        }
      }

      // Wrap around boundaries
      const halfSpread = (config.spread || spread) / 2
      if (positions[i3] > halfSpread) positions[i3] = -halfSpread
      if (positions[i3] < -halfSpread) positions[i3] = halfSpread
      if (positions[i3 + 1] > halfSpread) positions[i3 + 1] = -halfSpread
      if (positions[i3 + 1] < -halfSpread) positions[i3 + 1] = halfSpread
      if (positions[i3 + 2] > halfSpread) positions[i3 + 2] = -halfSpread
      if (positions[i3 + 2] < -halfSpread) positions[i3 + 2] = halfSpread
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={config.size || size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Specialized particle system for portal effect
export function PortalParticles({ radius = 3, count = 1000 }: { radius?: number, count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()
  
  const adjustedCount = Math.min(count, settings.particleCount)

  const particles = useMemo(() => {
    const positions = new Float32Array(adjustedCount * 3)
    const angles = new Float32Array(adjustedCount)
    const speeds = new Float32Array(adjustedCount)
    const radii = new Float32Array(adjustedCount)

    for (let i = 0; i < adjustedCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = radius * (0.8 + Math.random() * 0.4)
      
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = Math.sin(angle) * r
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2

      angles[i] = angle
      speeds[i] = 0.2 + Math.random() * 0.3
      radii[i] = r
    }

    return { positions, angles, speeds, radii }
  }, [adjustedCount, radius])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      const angle = particles.angles[i] + time * particles.speeds[i]
      const r = particles.radii[i] + Math.sin(time * 2 + i) * 0.2

      positions[i3] = Math.cos(angle) * r
      positions[i3 + 1] = Math.sin(angle) * r
      positions[i3 + 2] = Math.sin(time + particles.angles[i]) * 0.5
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={adjustedCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={0xe63946}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default ParticleSystem

