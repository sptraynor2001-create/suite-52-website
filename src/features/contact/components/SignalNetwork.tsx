/**
 * SignalNetwork - Neural network visualization for Contact page
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'

interface NetworkNode {
  position: THREE.Vector3
  label: string
  isCenter: boolean
}

export function SignalNetwork() {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.Group>(null)
  const { settings } = useQuality()

  // Define network nodes
  const nodes: NetworkNode[] = useMemo(() => [
    { position: new THREE.Vector3(0, 0, 0), label: 'SUITE 52', isCenter: true },
    { position: new THREE.Vector3(-3, 1.5, 0), label: 'INSTAGRAM', isCenter: false },
    { position: new THREE.Vector3(-2, -2, 1), label: 'SPOTIFY', isCenter: false },
    { position: new THREE.Vector3(3, 1, 0.5), label: 'SOUNDCLOUD', isCenter: false },
    { position: new THREE.Vector3(2.5, -1.5, -0.5), label: 'YOUTUBE', isCenter: false },
    { position: new THREE.Vector3(-1, 2.5, -1), label: 'TIKTOK', isCenter: false },
    { position: new THREE.Vector3(0.5, -2.5, 0.5), label: 'EMAIL', isCenter: false },
  ], [])

  // Create connections from center to all other nodes
  const connections = useMemo(() => {
    const center = nodes[0]
    return nodes.slice(1).map(node => ({
      start: center.position,
      end: node.position,
    }))
  }, [nodes])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Rotate entire network slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1
    }

    // Animate connection lines (data flow effect)
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        const material = (line as THREE.Line).material as THREE.LineDashedMaterial
        material.dashOffset = -time * 2
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          {/* Core sphere */}
          <mesh>
            <sphereGeometry args={[node.isCenter ? 0.3 : 0.15, 16, 16]} />
            <meshStandardMaterial
              color={node.isCenter ? 0xe63946 : 0xffffff}
              emissive={node.isCenter ? 0xe63946 : 0xffffff}
              emissiveIntensity={node.isCenter ? 0.8 : 0.3}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>

          {/* Glow */}
          <mesh>
            <sphereGeometry args={[node.isCenter ? 0.5 : 0.25, 8, 8]} />
            <meshBasicMaterial
              color={node.isCenter ? 0xe63946 : 0xffffff}
              transparent
              opacity={0.15}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Outer ring for center */}
          {node.isCenter && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.5, 0.02, 8, 32]} />
              <meshBasicMaterial
                color={0xe63946}
                transparent
                opacity={0.4}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Connection lines */}
      <group ref={linesRef}>
        {connections.map((conn, i) => {
          const points = [conn.start, conn.end]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)

          return (
            <line key={i} geometry={geometry}>
              <lineDashedMaterial
                color={0xe63946}
                transparent
                opacity={0.4}
                dashSize={0.1}
                gapSize={0.1}
                linewidth={1}
              />
            </line>
          )
        })}
      </group>

      {/* Pulse rings from center */}
      <PulseRings />

      {/* Ambient particles */}
      {settings.level !== 'low' && <NetworkParticles />}
    </group>
  )
}

// Expanding pulse rings from center
function PulseRings() {
  const ringsRef = useRef<THREE.Group>(null)
  const ringCount = 3

  useFrame((state) => {
    if (!ringsRef.current) return

    const time = state.clock.getElapsedTime()

    ringsRef.current.children.forEach((ring, i) => {
      const phase = (time * 0.5 + i * 0.33) % 1
      const scale = 1 + phase * 4
      const opacity = 0.3 * (1 - phase)

      ring.scale.setScalar(scale)
      const material = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial
      material.opacity = opacity
    })
  })

  return (
    <group ref={ringsRef}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.01, 8, 64]} />
          <meshBasicMaterial
            color={0xe63946}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// Particles flowing between nodes
function NetworkParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()

  const count = settings.level === 'high' ? 200 : 100

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const paths = new Float32Array(count) // Which connection path

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0

      phases[i] = Math.random()
      paths[i] = Math.floor(Math.random() * 6) // 6 connection paths
    }

    return { positions, phases, paths }
  }, [count])

  // Target positions for each path
  const targets = useMemo(() => [
    new THREE.Vector3(-3, 1.5, 0),
    new THREE.Vector3(-2, -2, 1),
    new THREE.Vector3(3, 1, 0.5),
    new THREE.Vector3(2.5, -1.5, -0.5),
    new THREE.Vector3(-1, 2.5, -1),
    new THREE.Vector3(0.5, -2.5, 0.5),
  ], [])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const phase = (particles.phases[i] + time * 0.3) % 1
      const pathIndex = particles.paths[i]
      const target = targets[pathIndex]

      // Interpolate along path
      positions[i3] = target.x * phase
      positions[i3 + 1] = target.y * phase
      positions[i3 + 2] = target.z * phase
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
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

export default SignalNetwork

