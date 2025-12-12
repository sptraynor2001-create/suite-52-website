/**
 * AudioVisualizer - Frequency-reactive visual elements
 * Responds to audio or simulates ambient visualization
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'

interface AudioVisualizerProps {
  barCount?: number
  radius?: number
  height?: number
  // audioData would come from Web Audio API in a real implementation
  audioData?: Float32Array | null
}

export function AudioVisualizer({
  barCount = 64,
  radius = 4,
  height = 3,
  audioData = null,
}: AudioVisualizerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { settings } = useQuality()

  const adjustedBarCount = settings.level === 'low' ? 32 : settings.level === 'medium' ? 48 : barCount

  // Create bar instances
  const bars = useMemo(() => {
    const arr = []
    for (let i = 0; i < adjustedBarCount; i++) {
      const angle = (i / adjustedBarCount) * Math.PI * 2
      arr.push({
        angle,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        phase: Math.random() * Math.PI * 2,
        frequency: 0.5 + Math.random() * 1.5,
      })
    }
    return arr
  }, [adjustedBarCount, radius])

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const bar = bars[i]
      if (!bar) return

      // Get audio data or simulate
      let amplitude: number
      if (audioData && audioData.length > 0) {
        const dataIndex = Math.floor((i / adjustedBarCount) * audioData.length)
        amplitude = (audioData[dataIndex] + 140) / 140 // Normalize dB to 0-1
      } else {
        // Ambient simulation - sine waves at different frequencies
        amplitude = 
          0.3 + 
          Math.sin(time * bar.frequency + bar.phase) * 0.3 +
          Math.sin(time * bar.frequency * 2.7 + bar.phase * 1.5) * 0.2 +
          Math.sin(time * bar.frequency * 0.5) * 0.2
      }

      // Scale bar height
      const targetScale = Math.max(0.1, amplitude * height)
      child.scale.y = THREE.MathUtils.lerp(child.scale.y, targetScale, 0.2)
      child.position.y = child.scale.y / 2

      // Color intensity based on amplitude
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      const intensity = amplitude * 0.8
      material.emissiveIntensity = intensity
    })

    // Slow rotation
    groupRef.current.rotation.y = time * 0.05
  })

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {bars.map((bar, i) => (
        <mesh
          key={i}
          position={[bar.x, 0, bar.z]}
          rotation={[0, -bar.angle, 0]}
        >
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? 0xe63946 : 0xffffff}
            emissive={i % 4 === 0 ? 0xe63946 : 0xffffff}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

// Particle cloud that reacts to audio
export function AudioParticles({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()

  const adjustedCount = Math.min(count, settings.particleCount / 3)

  const particles = useMemo(() => {
    const positions = new Float32Array(adjustedCount * 3)
    const velocities = new Float32Array(adjustedCount * 3)
    const basePositions = new Float32Array(adjustedCount * 3)

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 2

      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 1
      positions[i3 + 2] = r * Math.cos(phi)

      basePositions[i3] = positions[i3]
      basePositions[i3 + 1] = positions[i3 + 1]
      basePositions[i3 + 2] = positions[i3 + 2]

      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01
    }

    return { positions, velocities, basePositions }
  }, [adjustedCount])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    // Simulate audio amplitude
    const amplitude = 0.5 + Math.sin(time * 2) * 0.3 + Math.sin(time * 5.3) * 0.2

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3

      // Expand/contract based on amplitude
      const scale = 1 + amplitude * 0.5
      positions[i3] = particles.basePositions[i3] * scale + Math.sin(time + i * 0.01) * 0.1
      positions[i3 + 1] = particles.basePositions[i3 + 1] * scale + Math.cos(time * 0.7 + i * 0.01) * 0.1
      positions[i3 + 2] = particles.basePositions[i3 + 2] * scale + Math.sin(time * 0.5 + i * 0.01) * 0.1
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y = time * 0.05
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
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Waveform ring
export function WaveformRing({ segments = 128 }: { segments?: number }) {
  const lineRef = useRef<THREE.Line>(null)
  const { settings } = useQuality()

  const adjustedSegments = settings.level === 'low' ? 64 : segments

  const geometry = useMemo(() => {
    const points = []
    for (let i = 0; i <= adjustedSegments; i++) {
      const angle = (i / adjustedSegments) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(angle) * 3, 0, Math.sin(angle) * 3))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [adjustedSegments])

  useFrame((state) => {
    if (!lineRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = lineRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i <= adjustedSegments; i++) {
      const angle = (i / adjustedSegments) * Math.PI * 2
      const baseRadius = 3

      // Simulate waveform
      const wave = 
        Math.sin(time * 3 + angle * 8) * 0.2 +
        Math.sin(time * 5 + angle * 16) * 0.1 +
        Math.sin(time * 2 + angle * 4) * 0.15

      const radius = baseRadius + wave

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = wave * 0.5
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }

    lineRef.current.geometry.attributes.position.needsUpdate = true
    lineRef.current.rotation.y = time * 0.1
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={0xe63946}
        transparent
        opacity={0.6}
        linewidth={2}
      />
    </line>
  )
}

export default AudioVisualizer

