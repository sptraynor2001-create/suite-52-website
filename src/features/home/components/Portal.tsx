/**
 * Portal - The gateway ring geometry
 * A subtle, elegant ring that serves as the entrance to the site
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'

interface PortalProps {
  radius?: number
  tube?: number
  onClick?: () => void
  isHovered?: boolean
}

export function Portal({ radius = 2.5, tube = 0.06, onClick, isHovered = false }: PortalProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const innerGlowRef = useRef<THREE.Mesh>(null)
  const { settings } = useQuality()

  // Segment count based on quality
  const segments = settings.level === 'high' ? 128 : settings.level === 'medium' ? 64 : 32

  // Animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (ringRef.current) {
      // Very subtle rotation
      ringRef.current.rotation.z = time * 0.05
      
      // Subtle pulse scale when hovered
      const targetScale = isHovered ? 1.02 : 1
      ringRef.current.scale.x = THREE.MathUtils.lerp(ringRef.current.scale.x, targetScale, 0.08)
      ringRef.current.scale.y = THREE.MathUtils.lerp(ringRef.current.scale.y, targetScale, 0.08)
    }

    if (glowRef.current) {
      // Gentle pulsing glow
      const pulse = Math.sin(time * 1.5) * 0.15 + 0.85
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = isHovered ? 0.15 : 0.08 * pulse
    }

    if (innerGlowRef.current) {
      // Subtle inner glow
      const innerPulse = Math.sin(time * 1.2 + 1) * 0.1 + 0.9
      const material = innerGlowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = isHovered ? 0.08 : 0.03 * innerPulse
    }
  })

  return (
    <group onClick={onClick}>
      {/* Main ring - thin white line */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, tube, 16, segments]} />
        <meshStandardMaterial
          color={0xffffff}
          emissive={0xffffff}
          emissiveIntensity={isHovered ? 0.4 : 0.15}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Soft outer glow - white/gray */}
      <mesh ref={glowRef}>
        <torusGeometry args={[radius, tube * 6, 8, segments]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Subtle inner disc - barely visible */}
      <mesh ref={innerGlowRef} rotation={[0, 0, 0]}>
        <circleGeometry args={[radius - tube * 2, segments]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Very subtle outer edge accent */}
      <mesh>
        <torusGeometry args={[radius + tube * 3, tube * 0.3, 8, segments]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default Portal
