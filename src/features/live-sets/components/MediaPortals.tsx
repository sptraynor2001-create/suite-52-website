/**
 * MediaPortals - 3D portal frames for video/audio embeds
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'

interface PortalRingProps {
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

export function PortalRing({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PortalRingProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (ringRef.current) {
      // Subtle rotation
      ringRef.current.rotation.z = time * 0.1
    }

    if (glowRef.current) {
      // Pulsing glow
      const pulse = Math.sin(time * 2) * 0.2 + 0.3
      glowRef.current.material.opacity = pulse
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.05, 16, 64]} />
        <meshStandardMaterial
          color={0xffffff}
          emissive={0xffffff}
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <torusGeometry args={[2, 0.15, 8, 64]} />
        <meshBasicMaterial
          color={0xe63946}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner subtle glow */}
      <mesh>
        <circleGeometry args={[1.9, 64]} />
        <meshBasicMaterial
          color={0xe63946}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// Floating portal rings for background
export function FloatingPortals({ count = 5 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { settings } = useQuality()

  const adjustedCount = settings.level === 'low' ? 3 : count

  const portals = useMemo(() => {
    const arr = []
    for (let i = 0; i < adjustedCount; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          -10 - Math.random() * 10,
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI * 0.5,
          Math.random() * Math.PI * 2,
          0,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.5,
        speed: 0.1 + Math.random() * 0.2,
      })
    }
    return arr
  }, [adjustedCount])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const portal = portals[i]
      if (!portal) return

      // Gentle floating
      child.position.y = portal.position[1] + Math.sin(time * portal.speed) * 0.5
      child.rotation.y = portal.rotation[1] + time * 0.05
    })
  })

  return (
    <group ref={groupRef}>
      {portals.map((portal, i) => (
        <PortalRing
          key={i}
          position={portal.position}
          rotation={portal.rotation}
          scale={portal.scale}
        />
      ))}
    </group>
  )
}

// Ambient particles
export function PortalAmbientParticles({ count = 300 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()

  const adjustedCount = Math.min(count, settings.particleCount / 5)

  const particles = useMemo(() => {
    const positions = new Float32Array(adjustedCount * 3)
    const phases = new Float32Array(adjustedCount)

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 25
      positions[i3 + 1] = (Math.random() - 0.5) * 15
      positions[i3 + 2] = (Math.random() - 0.5) * 20 - 5

      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, phases }
  }, [adjustedCount])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      const phase = particles.phases[i]

      positions[i3] += Math.sin(time * 0.5 + phase) * 0.002
      positions[i3 + 1] += Math.cos(time * 0.3 + phase) * 0.002
      positions[i3 + 2] += 0.005

      // Reset when past camera
      if (positions[i3 + 2] > 10) {
        positions[i3 + 2] = -15
      }
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
        color={0xffffff}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default PortalRing

