/**
 * QuantumField - Quantum field visualization with wave function collapse
 * Particles exist in superposition until sections are viewed, then collapse to defined states
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { whiteParticleMaterial } from '@/shared/components/3d/particleMaterials'

interface QuantumFieldProps {
  visibleSections?: number
  hoveredSection?: number | null
  sectionCount?: number
}

export function QuantumField({
  visibleSections = 0,
  hoveredSection = null,
  sectionCount = 4,
}: QuantumFieldProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()
  const isMobileDevice = useIsMobile()
  
  // Particle count based on quality
  const particleCount = useMemo(() => {
    const target = isMobileDevice 
      ? particleConfig.quantumField.baseParticles.mobile
      : particleConfig.quantumField.baseParticles.desktop
    return Math.min(target, settings.particleCount)
  }, [settings.particleCount, isMobileDevice])
  
  // Section regions - divide space into 4 quadrants
  const sectionRegions = useMemo(() => {
    const regions = []
    for (let i = 0; i < sectionCount; i++) {
      const angle = (i / sectionCount) * Math.PI * 2
      const radius = 3
      regions.push({
        center: new THREE.Vector3(
          Math.cos(angle) * radius,
          (i - sectionCount / 2) * 1.5,
          Math.sin(angle) * radius
        ),
        index: i,
      })
    }
    return regions
  }, [sectionCount])
  
  // Particle data - superposition positions and collapse targets
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const baseSuperPositions = new Float32Array(particleCount * 3) // Base superposition positions
    const targetPositions = new Float32Array(particleCount * 3) // Collapsed positions
    const collapseStates = new Float32Array(particleCount) // 0 = superposition, 1 = collapsed
    const sectionAssignments = new Uint8Array(particleCount) // Which section region
    const phases = new Float32Array(particleCount)
    const collapseProgress = new Float32Array(particleCount) // 0-1 collapse progress
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Assign particle to a section region
      const sectionIndex = i % sectionCount
      sectionAssignments[i] = sectionIndex
      const region = sectionRegions[sectionIndex]
      
      // Superposition position - start in a central cloud
      const spread = particleConfig.quantumField.superpositionSpread
      const superpositionPos = new THREE.Vector3(
        (Math.random() - 0.5) * spread * 4,
        (Math.random() - 0.5) * spread * 3,
        (Math.random() - 0.5) * spread * 4
      )
      
      // Collapsed position - clustered near section center
      const clusterRadius = particleConfig.quantumField.collapsedCluster
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * clusterRadius * 2,
        (Math.random() - 0.5) * clusterRadius * 2,
        (Math.random() - 0.5) * clusterRadius * 2
      )
      const collapsedPos = region.center.clone().add(offset)
      
      // Start in superposition
      positions[i3] = superpositionPos.x
      positions[i3 + 1] = superpositionPos.y
      positions[i3 + 2] = superpositionPos.z
      
      // Store base superposition position
      baseSuperPositions[i3] = superpositionPos.x
      baseSuperPositions[i3 + 1] = superpositionPos.y
      baseSuperPositions[i3 + 2] = superpositionPos.z
      
      // Store collapsed target position
      targetPositions[i3] = collapsedPos.x
      targetPositions[i3 + 1] = collapsedPos.y
      targetPositions[i3 + 2] = collapsedPos.z
      
      collapseStates[i] = 0 // Start in superposition
      collapseProgress[i] = 0
      phases[i] = Math.random() * Math.PI * 2
    }
    
    return { positions, baseSuperPositions, targetPositions, collapseStates, sectionAssignments, phases, collapseProgress }
  }, [particleCount, sectionRegions, sectionCount])
  
  // Animation frame
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const sectionIndex = particles.sectionAssignments[i]
      // Section is visible if visibleSections count includes this section (0-indexed)
      const isSectionVisible = visibleSections > sectionIndex
      const isHovered = hoveredSection === sectionIndex
      
      const currentPos = new THREE.Vector3(
        positions[i3],
        positions[i3 + 1],
        positions[i3 + 2]
      )
      
      const targetPos = new THREE.Vector3(
        particles.targetPositions[i3],
        particles.targetPositions[i3 + 1],
        particles.targetPositions[i3 + 2]
      )
      
      // Collapse when section becomes visible
      if (isSectionVisible) {
        // Increase collapse progress smoothly
        if (particles.collapseProgress[i] < 1) {
          particles.collapseProgress[i] = Math.min(1, particles.collapseProgress[i] + particleConfig.quantumField.collapseSpeed)
        }
        
        // Smooth lerp toward collapsed position
        const t = particles.collapseProgress[i]
        const collapsedPos = currentPos.clone().lerp(targetPos, t * 0.1) // Smooth transition
        
        // Add clustering force toward region center
        const region = sectionRegions[sectionIndex]
        const distToCenter = collapsedPos.distanceTo(region.center)
        if (distToCenter > 0.3) {
          const clusterForce = 0.03 * t
          const direction = region.center.clone().sub(collapsedPos).normalize()
          collapsedPos.addScaledVector(direction, clusterForce)
        }
        
        // Hover enhancement - tighter clustering and slight pulse
        if (isHovered) {
          const hoverForce = 0.04
          const direction = region.center.clone().sub(collapsedPos).normalize()
          collapsedPos.addScaledVector(direction, hoverForce)
          
          // Subtle pulse effect
          const pulse = Math.sin(time * 3) * 0.05
          collapsedPos.addScaledVector(direction, pulse)
        }
        
        positions[i3] = collapsedPos.x
        positions[i3 + 1] = collapsedPos.y
        positions[i3 + 2] = collapsedPos.z
      } else {
        // Superposition - particles exist in probability cloud
        // Get base superposition position
        const baseSuperPos = new THREE.Vector3(
          particles.baseSuperPositions[i3],
          particles.baseSuperPositions[i3 + 1],
          particles.baseSuperPositions[i3 + 2]
        )
        
        const phase = particles.phases[i]
        const uncertainty = particleConfig.quantumField.superpositionSpread
        
        // Quantum fluctuation - gentle movement in probability cloud
        const fluctuation = uncertainty * 0.25
        const quantumPos = new THREE.Vector3(
          baseSuperPos.x + Math.sin(time * 1.2 + phase) * fluctuation,
          baseSuperPos.y + Math.cos(time * 1.4 + phase) * fluctuation,
          baseSuperPos.z + Math.sin(time * 1.1 + phase * 0.8) * fluctuation
        )
        
        // Reset collapse progress when section becomes invisible
        if (particles.collapseProgress[i] > 0) {
          particles.collapseProgress[i] = Math.max(0, particles.collapseProgress[i] - 0.03)
          // Smoothly return toward superposition
          const t = particles.collapseProgress[i]
          const returnPos = currentPos.clone().lerp(quantumPos, 0.15)
          positions[i3] = returnPos.x
          positions[i3 + 1] = returnPos.y
          positions[i3 + 2] = returnPos.z
        } else {
          // Fully in superposition - use quantum position
          positions[i3] = quantumPos.x
          positions[i3 + 1] = quantumPos.y
          positions[i3 + 2] = quantumPos.z
        }
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial {...whiteParticleMaterial} />
    </points>
  )
}

export default QuantumField
