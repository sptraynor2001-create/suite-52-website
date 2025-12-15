/**
 * SoundWaveInterference - Particles form sound waves that interfere
 * Each set creates waves that propagate and interfere with each other
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { LiveSet } from '../types'

interface SoundWaveInterferenceProps {
  liveSets?: LiveSet[]
  hoveredSetId?: string | null
}

// Position wave sources in 3D space
function getWaveSourcePosition(set: LiveSet, index: number, total: number): THREE.Vector3 {
  // Distribute sources in a circle
  const angle = (index / total) * Math.PI * 2
  const radius = 4
  const height = (index - total / 2) * 0.5
  
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  )
}

// Calculate wave displacement at a point
function calculateWaveDisplacement(
  point: THREE.Vector3,
  source: THREE.Vector3,
  time: number,
  frequency: number,
  speed: number
): number {
  const distance = point.distanceTo(source)
  const phase = (distance / speed - time) * frequency * Math.PI * 2
  return Math.sin(phase) / (1 + distance * 0.3) // Amplitude decreases with distance
}

export function SoundWaveInterference({
  liveSets = [],
  hoveredSetId = null,
}: SoundWaveInterferenceProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()
  const isMobileDevice = useIsMobile()
  
  // Wave source positions
  const waveSources = useMemo(() => {
    return liveSets.map((set, index) => ({
      set,
      position: getWaveSourcePosition(set, index, liveSets.length),
      index,
    }))
  }, [liveSets])
  
  // Particle count - less dense
  const particleCount = useMemo(() => {
    const target = isMobileDevice
      ? particleConfig.soundWaveInterference.waveParticles.mobile
      : particleConfig.soundWaveInterference.waveParticles.desktop
    // Reduce density by 60%
    return Math.min(Math.floor(target * 0.4), Math.floor(settings.particleCount * 0.4))
  }, [settings.particleCount, isMobileDevice])
  
  // Initialize particles in a grid - mostly still positions
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const basePositions = new Float32Array(particleCount * 3)
    const glitchPhases = new Float32Array(particleCount) // When to glitch
    const flashPhases = new Float32Array(particleCount) // When to flash
    const glitchIntensities = new Float32Array(particleCount) // How much to glitch
    const flashIntensities = new Float32Array(particleCount) // Flash intensity
    const sizes = new Float32Array(particleCount) // Random sizes
    
    // Create a grid of particles spread across entire XY plane
    const gridSize = Math.ceil(Math.sqrt(particleCount))
    const spacing = 0.5 // Increased spacing for less density
    const planeWidth = (gridSize - 1) * spacing // Total width of plane
    const planeHeight = (gridSize - 1) * spacing // Total height of plane
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Grid position spread across XY plane (Z is depth)
      const gridX = i % gridSize
      const gridY = Math.floor(i / gridSize)
      const x = (gridX - gridSize / 2) * spacing
      const y = (gridY - gridSize / 2) * spacing
      const z = (Math.random() - 0.5) * 1.5 // Small depth variation
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z
      
      // Random glitch/flash timing
      glitchPhases[i] = Math.random() * Math.PI * 2
      flashPhases[i] = Math.random() * Math.PI * 2
      glitchIntensities[i] = 0.05 + Math.random() * 0.1 // Glitch distance
      flashIntensities[i] = 0.3 + Math.random() * 0.7 // Flash intensity
      // Much more size variation - from very small to quite large
      sizes[i] = 0.01 + Math.random() * 0.06 // Random size between 0.01 and 0.07 (larger and more visible)
    }
    
    return { positions, basePositions, glitchPhases, flashPhases, glitchIntensities, flashIntensities, sizes }
  }, [particleCount])
  
  // Animation frame - glitch and flash effects
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const material = particlesRef.current.material as THREE.ShaderMaterial
    
    // Create opacity array for flashing
    const opacities = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      const basePos = new THREE.Vector3(
        particles.basePositions[i3],
        particles.basePositions[i3 + 1],
        particles.basePositions[i3 + 2]
      )
      
      // Glitch effect - slower, more random sudden position jumps
      // Use stored phase for consistent but random timing per particle
      const baseGlitchSpeed = 0.3 + particles.glitchPhases[i] * 0.2 // Slower base speed
      const randomVariation = Math.sin(time * 0.1 + i) * 0.15 // Slow random variation
      const glitchFrequency = baseGlitchSpeed + randomVariation
      const glitchTrigger = Math.sin(time * glitchFrequency + particles.glitchPhases[i] * Math.PI)
      
      // More random glitch timing - less frequent
      const randomGlitchChance = Math.random()
      const shouldGlitch = Math.abs(glitchTrigger) > 0.95 && randomGlitchChance > 0.85
      
      let glitchOffset = new THREE.Vector3(0, 0, 0)
      if (shouldGlitch) {
        // Sudden glitch displacement - random direction and intensity
        const glitchAmount = particles.glitchIntensities[i] * (0.8 + Math.random() * 0.8)
        const randomDir = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
        glitchOffset = randomDir.multiplyScalar(glitchAmount)
      }
      
      // Flash effect - slower, more random opacity changes
      const baseFlashSpeed = 1.5 + particles.flashPhases[i] * 0.5 // Much slower
      const flashVariation = Math.sin(time * 0.08 + i * 0.1) * 0.3
      const flashSpeed = baseFlashSpeed + flashVariation
      const flash = Math.sin(time * flashSpeed + particles.flashPhases[i] * Math.PI)
      const flashIntensity = particles.flashIntensities[i]
      
      // More random flash timing
      const randomFlashMod = Math.random() * 0.3 - 0.15
      const flashThreshold = 0.7 + randomFlashMod
      
      if (flash > flashThreshold) {
        opacities[i] = 0.4 + flashIntensity * 0.6 // Bright flash (more visible)
      } else if (flash < -flashThreshold) {
        opacities[i] = 0.2 + flashIntensity * 0.3 // Dim flash (more visible)
      } else {
        opacities[i] = 0.35 + flashIntensity * 0.45 // Normal (more visible)
      }
      
      // Very rare random extra flashes (much less frequent)
      if (Math.random() > 0.995) {
        opacities[i] = Math.min(1.0, opacities[i] * (1.5 + Math.random() * 0.5))
      }
      
      // Hover effect - particles near hovered set flash more intensely (but still random)
      if (hoveredSetId) {
        waveSources.forEach((source) => {
          if (hoveredSetId === source.set.id) {
            const distToSource = basePos.distanceTo(source.position)
            if (distToSource < 3.0) {
              // Increase flash intensity near source (randomly)
              if (Math.random() > 0.7) {
                opacities[i] = Math.min(1.0, opacities[i] * (1.3 + Math.random() * 0.4))
              }
              // Occasional glitches near source (less frequent)
              if (Math.random() > 0.96) {
                glitchOffset.multiplyScalar(1.5 + Math.random() * 0.5)
              }
            }
          }
        })
      }
      
      // Final position = base + glitch offset
      const finalPos = basePos.clone().add(glitchOffset)
      
      positions[i3] = finalPos.x
      positions[i3 + 1] = finalPos.y
      positions[i3 + 2] = finalPos.z
    }
    
    // Update positions
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    
    // Update opacity - make more visible
    const maxOpacity = Math.max(...Array.from(opacities))
    const avgOpacity = opacities.reduce((a, b) => a + b, 0) / particleCount
    // More visible flashing - blend max and avg with higher base
    const finalOpacity = hoveredSetId 
      ? Math.min(1.0, (maxOpacity * 0.5 + avgOpacity * 0.5) * 1.3)
      : Math.min(0.95, maxOpacity * 0.4 + avgOpacity * 0.6)
    material.opacity = finalOpacity
    
    // Update color based on hover
    material.uniforms.color.value.setHex(hoveredSetId ? 0xe63946 : 0xffffff)
  })
  
  if (waveSources.length === 0) return null
  
  return (
    <group>
      {/* Glitch particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={`
            attribute float size;
            varying vec3 vColor;
            
            void main() {
              vColor = vec3(1.0);
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            varying vec3 vColor;
            
            void main() {
              float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
              float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
              gl_FragColor = vec4(color * vColor, alpha);
            }
          `}
          uniforms={{
            color: { value: new THREE.Color(hoveredSetId ? 0xe63946 : 0xffffff) }
          }}
          transparent
          opacity={hoveredSetId ? 1.0 : 0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Wave source indicators */}
      {waveSources.map((source) => {
        const isHovered = hoveredSetId === source.set.id
        const isOtherHovered = hoveredSetId !== null && hoveredSetId !== source.set.id
        
        return (
          <mesh key={source.set.id} position={source.position}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial
              color={isHovered ? 0xe63946 : 0xffffff}
              transparent
              opacity={isOtherHovered ? 0.3 : isHovered ? 1 : 0.9}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default SoundWaveInterference
