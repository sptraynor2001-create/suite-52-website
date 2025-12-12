/**
 * MorphingGeometry - Shape-shifting background element
 * Transitions between organic blob and crystalline form
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'
import { useQuality } from '@/shared/components/3d'

interface MorphingGeometryProps {
  position?: [number, number, number]
  scale?: number
  morphSpeed?: number
  organicness?: number // 0-1, how organic vs crystalline
}

export function MorphingGeometry({
  position = [0, 0, -5],
  scale = 3,
  morphSpeed = 0.3,
  organicness = 0.5,
}: MorphingGeometryProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { settings } = useQuality()

  // Create noise function
  const noise3D = useMemo(() => createNoise3D(), [])

  // Geometry detail based on quality
  const detail = settings.level === 'high' ? 64 : settings.level === 'medium' ? 32 : 16

  // Create geometry and store original positions together
  const { geometry, originalPositions } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, detail)
    const origPositions = Float32Array.from(geo.attributes.position.array)
    return { geometry: geo, originalPositions: origPositions }
  }, [detail])

  // Clean up geometry on unmount or when it changes
  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime() * morphSpeed
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array

    // Ensure arrays are the same length before processing
    if (positions.length !== originalPositions.length) return

    // Animate morph between organic and crystalline
    const morphCycle = (Math.sin(time * 0.5) + 1) / 2 // 0-1
    const currentOrganicness = organicness * morphCycle + (1 - organicness) * (1 - morphCycle)

    for (let i = 0; i < positions.length; i += 3) {
      const ox = originalPositions[i]
      const oy = originalPositions[i + 1]
      const oz = originalPositions[i + 2]

      // Organic displacement using noise
      const organicDisplacement = noise3D(
        ox * 2 + time,
        oy * 2 + time * 0.7,
        oz * 2 + time * 0.5
      ) * 0.3

      // Crystalline displacement - step function
      const crystallineDisplacement = Math.round(
        noise3D(ox * 3, oy * 3, oz * 3) * 4
      ) / 4 * 0.2

      // Blend between organic and crystalline
      const displacement = 
        organicDisplacement * currentOrganicness +
        crystallineDisplacement * (1 - currentOrganicness)

      // Calculate direction from center
      const length = Math.sqrt(ox * ox + oy * oy + oz * oz)
      const nx = ox / length
      const ny = oy / length
      const nz = oz / length

      // Apply displacement along normal
      positions[i] = ox + nx * displacement
      positions[i + 1] = oy + ny * displacement
      positions[i + 2] = oz + nz * displacement
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()

    // Slow rotation
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color={0x1a1a1a}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

// Floating crystalline shards
export function FloatingShards({ count = 20 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { settings } = useQuality()

  const adjustedCount = Math.min(count, settings.level === 'low' ? 10 : settings.level === 'medium' ? 15 : 20)

  // Generate shard data
  const shards = useMemo(() => {
    const arr = []
    for (let i = 0; i < adjustedCount; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10 - 5,
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
        scale: 0.1 + Math.random() * 0.3,
        rotationSpeed: [
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
        ],
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [adjustedCount])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const shard = shards[i]
      if (!shard) return

      // Rotate
      child.rotation.x += shard.rotationSpeed[0] * 0.01
      child.rotation.y += shard.rotationSpeed[1] * 0.01
      child.rotation.z += shard.rotationSpeed[2] * 0.01

      // Float
      child.position.y = shard.position[1] + Math.sin(time * shard.floatSpeed + shard.floatOffset) * 0.5
    })
  })

  return (
    <group ref={groupRef}>
      {shards.map((shard, i) => (
        <mesh
          key={i}
          position={shard.position}
          rotation={shard.rotation}
          scale={shard.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? 0xe63946 : 0xffffff}
            transparent
            opacity={0.15}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

export default MorphingGeometry
