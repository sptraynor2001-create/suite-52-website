/**
 * BioTerrain - Procedural terrain for the About page
 * Digital landscape with wireframe aesthetic
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'
import { useQuality } from '@/shared/components/3d'

interface BioTerrainProps {
  width?: number
  depth?: number
  amplitude?: number
  speed?: number
}

export function BioTerrain({
  width = 30,
  depth = 20,
  amplitude = 2,
  speed = 0.3,
}: BioTerrainProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { settings } = useQuality()

  const noise2D = useMemo(() => createNoise2D(), [])

  // Grid resolution based on quality
  const segmentsX = settings.level === 'high' ? 80 : settings.level === 'medium' ? 50 : 30
  const segmentsZ = settings.level === 'high' ? 60 : settings.level === 'medium' ? 40 : 25

  // Create geometry and store original positions together
  const { geometry, originalPositions } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ)
    geo.rotateX(-Math.PI / 2)
    const origPositions = Float32Array.from(geo.attributes.position.array)
    return { geometry: geo, originalPositions: origPositions }
  }, [width, depth, segmentsX, segmentsZ])

  // Clean up geometry on unmount or when it changes
  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime() * speed
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array

    // Ensure arrays are the same length before processing
    if (positions.length !== originalPositions.length) return

    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i]
      const z = originalPositions[i + 2]

      // Layer multiple noise frequencies
      const noise1 = noise2D(x * 0.1 + time * 0.5, z * 0.1) * amplitude
      const noise2 = noise2D(x * 0.2 + time * 0.3, z * 0.2 + time * 0.2) * amplitude * 0.5
      const noise3 = noise2D(x * 0.4, z * 0.4 + time * 0.1) * amplitude * 0.25

      // Combine for organic terrain
      positions[i + 1] = noise1 + noise2 + noise3

      // Add "digital" step quantization to some areas
      const digitalZone = Math.abs(noise2D(x * 0.05, z * 0.05))
      if (digitalZone > 0.5) {
        positions[i + 1] = Math.round(positions[i + 1] * 2) / 2
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <mesh ref={meshRef} position={[0, -3, -5]} receiveShadow geometry={geometry}>
      <meshStandardMaterial
        color={0x1a1a1a}
        wireframe
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Ambient particles that drift over terrain with collision detection
export function TerrainParticles({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()

  const adjustedCount = Math.floor(Math.min(count, settings.particleCount / 10))

  // Boundary box (X, Y, Z ranges)
  const BOUNDS = {
    minX: -12.5,
    maxX: 12.5,
    minY: -1,
    maxY: 4,
    minZ: -10,
    maxZ: 5,
  }
  const COLLISION_RADIUS = 0.3 // Distance at which particles collide
  const BOUNCE_DAMPING = 0.95 // Slight energy loss on bounce

  const positions = useMemo(() => {
    const pos = new Float32Array(adjustedCount * 3)
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      // Random initial positions within bounds
      pos[i3] = BOUNDS.minX + Math.random() * (BOUNDS.maxX - BOUNDS.minX)
      pos[i3 + 1] = BOUNDS.minY + Math.random() * (BOUNDS.maxY - BOUNDS.minY)
      pos[i3 + 2] = BOUNDS.minZ + Math.random() * (BOUNDS.maxZ - BOUNDS.minZ)
    }
    return pos
  }, [adjustedCount])

  const velocitiesRef = useRef<Float32Array | null>(null)
  
  // Initialize velocities once
  if (!velocitiesRef.current || velocitiesRef.current.length !== adjustedCount * 3) {
    velocitiesRef.current = new Float32Array(adjustedCount * 3)
    const vel = velocitiesRef.current
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      // Random initial velocities (increased for visibility)
      vel[i3] = (Math.random() - 0.5) * 0.5
      vel[i3 + 1] = (Math.random() - 0.5) * 0.4
      vel[i3 + 2] = (Math.random() - 0.5) * 0.45
    }
  }

  useFrame((state) => {
    if (!pointsRef.current || !velocitiesRef.current) return

    const deltaTime = Math.min(state.clock.getDelta(), 0.1) // Cap deltaTime for stability
    const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const currentVelocities = velocitiesRef.current!

    // Update positions based on velocities
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      // Use deltaTime directly (already in seconds)
      currentPositions[i3] += currentVelocities[i3] * deltaTime
      currentPositions[i3 + 1] += currentVelocities[i3 + 1] * deltaTime
      currentPositions[i3 + 2] += currentVelocities[i3 + 2] * deltaTime
    }

    // Collision detection between particles
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      const x1 = currentPositions[i3]
      const y1 = currentPositions[i3 + 1]
      const z1 = currentPositions[i3 + 2]

      for (let j = i + 1; j < adjustedCount; j++) {
        const j3 = j * 3
        const x2 = currentPositions[j3]
        const y2 = currentPositions[j3 + 1]
        const z2 = currentPositions[j3 + 2]

        const dx = x2 - x1
        const dy = y2 - y1
        const dz = z2 - z1
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < COLLISION_RADIUS && distance > 0.001) {
          // Collision detected - calculate bounce
          const normalX = dx / distance
          const normalY = dy / distance
          const normalZ = dz / distance

          // Relative velocity
          const relVelX = currentVelocities[j3] - currentVelocities[i3]
          const relVelY = currentVelocities[j3 + 1] - currentVelocities[i3 + 1]
          const relVelZ = currentVelocities[j3 + 2] - currentVelocities[i3 + 2]

          // Velocity along normal
          const velAlongNormal = relVelX * normalX + relVelY * normalY + relVelZ * normalZ

          // Don't resolve if velocities are separating
          if (velAlongNormal > 0) continue

          // Calculate impulse (assuming equal mass)
          const impulse = velAlongNormal * BOUNCE_DAMPING

          // Apply impulse
          currentVelocities[i3] += impulse * normalX
          currentVelocities[i3 + 1] += impulse * normalY
          currentVelocities[i3 + 2] += impulse * normalZ

          currentVelocities[j3] -= impulse * normalX
          currentVelocities[j3 + 1] -= impulse * normalY
          currentVelocities[j3 + 2] -= impulse * normalZ

          // Separate particles slightly to prevent overlap
          const overlap = COLLISION_RADIUS - distance
          const separationX = normalX * overlap * 0.5
          const separationY = normalY * overlap * 0.5
          const separationZ = normalZ * overlap * 0.5

          currentPositions[i3] -= separationX
          currentPositions[i3 + 1] -= separationY
          currentPositions[i3 + 2] -= separationZ

          currentPositions[j3] += separationX
          currentPositions[j3 + 1] += separationY
          currentPositions[j3 + 2] += separationZ
        }
      }
    }

    // Boundary collision and bouncing
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3

      // X boundaries
      if (currentPositions[i3] < BOUNDS.minX) {
        currentPositions[i3] = BOUNDS.minX
        currentVelocities[i3] *= -BOUNCE_DAMPING
      } else if (currentPositions[i3] > BOUNDS.maxX) {
        currentPositions[i3] = BOUNDS.maxX
        currentVelocities[i3] *= -BOUNCE_DAMPING
      }

      // Y boundaries
      if (currentPositions[i3 + 1] < BOUNDS.minY) {
        currentPositions[i3 + 1] = BOUNDS.minY
        currentVelocities[i3 + 1] *= -BOUNCE_DAMPING
      } else if (currentPositions[i3 + 1] > BOUNDS.maxY) {
        currentPositions[i3 + 1] = BOUNDS.maxY
        currentVelocities[i3 + 1] *= -BOUNCE_DAMPING
      }

      // Z boundaries
      if (currentPositions[i3 + 2] < BOUNDS.minZ) {
        currentPositions[i3 + 2] = BOUNDS.minZ
        currentVelocities[i3 + 2] *= -BOUNCE_DAMPING
      } else if (currentPositions[i3 + 2] > BOUNDS.maxZ) {
        currentPositions[i3 + 2] = BOUNDS.maxZ
        currentVelocities[i3 + 2] *= -BOUNCE_DAMPING
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (adjustedCount === 0) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* @ts-expect-error - React Three Fiber bufferAttribute API */}
        <bufferAttribute
          attach="attributes-position"
          count={adjustedCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
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

// Red accent particles with collision detection
export function AccentParticles({ count = 50 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()

  const adjustedCount = Math.floor(Math.min(count, settings.particleCount / 20))

  // Boundary box (X, Y, Z ranges) - slightly tighter for accent particles
  const BOUNDS = {
    minX: -10,
    maxX: 10,
    minY: -0.5,
    maxY: 3.5,
    minZ: -8,
    maxZ: 4,
  }
  const COLLISION_RADIUS = 0.4 // Slightly larger for red particles
  const BOUNCE_DAMPING = 0.95 // Slight energy loss on bounce

  const positions = useMemo(() => {
    const pos = new Float32Array(adjustedCount * 3)
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      // Random initial positions within bounds
      pos[i3] = BOUNDS.minX + Math.random() * (BOUNDS.maxX - BOUNDS.minX)
      pos[i3 + 1] = BOUNDS.minY + Math.random() * (BOUNDS.maxY - BOUNDS.minY)
      pos[i3 + 2] = BOUNDS.minZ + Math.random() * (BOUNDS.maxZ - BOUNDS.minZ)
    }
    return pos
  }, [adjustedCount])

  const velocitiesRef = useRef<Float32Array | null>(null)
  
  // Initialize velocities once
  if (!velocitiesRef.current || velocitiesRef.current.length !== adjustedCount * 3) {
    velocitiesRef.current = new Float32Array(adjustedCount * 3)
    const vel = velocitiesRef.current
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      // Random initial velocities (slightly faster than white particles, increased for visibility)
      vel[i3] = (Math.random() - 0.5) * 0.6
      vel[i3 + 1] = (Math.random() - 0.5) * 0.5
      vel[i3 + 2] = (Math.random() - 0.5) * 0.55
    }
  }

  useFrame((state) => {
    if (!pointsRef.current || !velocitiesRef.current) return

    const deltaTime = Math.min(state.clock.getDelta(), 0.1) // Cap deltaTime for stability
    const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const currentVelocities = velocitiesRef.current!

    // Update positions based on velocities
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      // Use deltaTime directly (already in seconds)
      currentPositions[i3] += currentVelocities[i3] * deltaTime
      currentPositions[i3 + 1] += currentVelocities[i3 + 1] * deltaTime
      currentPositions[i3 + 2] += currentVelocities[i3 + 2] * deltaTime
    }

    // Collision detection between particles
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      const x1 = currentPositions[i3]
      const y1 = currentPositions[i3 + 1]
      const z1 = currentPositions[i3 + 2]

      for (let j = i + 1; j < adjustedCount; j++) {
        const j3 = j * 3
        const x2 = currentPositions[j3]
        const y2 = currentPositions[j3 + 1]
        const z2 = currentPositions[j3 + 2]

        const dx = x2 - x1
        const dy = y2 - y1
        const dz = z2 - z1
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < COLLISION_RADIUS && distance > 0.001) {
          // Collision detected - calculate bounce
          const normalX = dx / distance
          const normalY = dy / distance
          const normalZ = dz / distance

          // Relative velocity
          const relVelX = currentVelocities[j3] - currentVelocities[i3]
          const relVelY = currentVelocities[j3 + 1] - currentVelocities[i3 + 1]
          const relVelZ = currentVelocities[j3 + 2] - currentVelocities[i3 + 2]

          // Velocity along normal
          const velAlongNormal = relVelX * normalX + relVelY * normalY + relVelZ * normalZ

          // Don't resolve if velocities are separating
          if (velAlongNormal > 0) continue

          // Calculate impulse (assuming equal mass)
          const impulse = velAlongNormal * BOUNCE_DAMPING

          // Apply impulse
          currentVelocities[i3] += impulse * normalX
          currentVelocities[i3 + 1] += impulse * normalY
          currentVelocities[i3 + 2] += impulse * normalZ

          currentVelocities[j3] -= impulse * normalX
          currentVelocities[j3 + 1] -= impulse * normalY
          currentVelocities[j3 + 2] -= impulse * normalZ

          // Separate particles slightly to prevent overlap
          const overlap = COLLISION_RADIUS - distance
          const separationX = normalX * overlap * 0.5
          const separationY = normalY * overlap * 0.5
          const separationZ = normalZ * overlap * 0.5

          currentPositions[i3] -= separationX
          currentPositions[i3 + 1] -= separationY
          currentPositions[i3 + 2] -= separationZ

          currentPositions[j3] += separationX
          currentPositions[j3 + 1] += separationY
          currentPositions[j3 + 2] += separationZ
        }
      }
    }

    // Boundary collision and bouncing
    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3

      // X boundaries
      if (currentPositions[i3] < BOUNDS.minX) {
        currentPositions[i3] = BOUNDS.minX
        currentVelocities[i3] *= -BOUNCE_DAMPING
      } else if (currentPositions[i3] > BOUNDS.maxX) {
        currentPositions[i3] = BOUNDS.maxX
        currentVelocities[i3] *= -BOUNCE_DAMPING
      }

      // Y boundaries
      if (currentPositions[i3 + 1] < BOUNDS.minY) {
        currentPositions[i3 + 1] = BOUNDS.minY
        currentVelocities[i3 + 1] *= -BOUNCE_DAMPING
      } else if (currentPositions[i3 + 1] > BOUNDS.maxY) {
        currentPositions[i3 + 1] = BOUNDS.maxY
        currentVelocities[i3 + 1] *= -BOUNCE_DAMPING
      }

      // Z boundaries
      if (currentPositions[i3 + 2] < BOUNDS.minZ) {
        currentPositions[i3 + 2] = BOUNDS.minZ
        currentVelocities[i3 + 2] *= -BOUNCE_DAMPING
      } else if (currentPositions[i3 + 2] > BOUNDS.maxZ) {
        currentPositions[i3 + 2] = BOUNDS.maxZ
        currentVelocities[i3 + 2] *= -BOUNCE_DAMPING
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (adjustedCount === 0) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* @ts-expect-error - React Three Fiber bufferAttribute API */}
        <bufferAttribute
          attach="attributes-position"
          count={adjustedCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={0xe63946}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default BioTerrain
