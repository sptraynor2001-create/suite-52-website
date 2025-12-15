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
      
      // Superposition position - spread out in probability cloud
      const spread = particleConfig.quantumField.superpositionSpread
      const superpositionPos = new THREE.Vector3(
        (Math.random() - 0.5) * spread * 6,
        (Math.random() - 0.5) * spread * 6,
        (Math.random() - 0.5) * spread * 6
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
      
      targetPositions[i3] = collapsedPos.x
      targetPositions[i3 + 1] = collapsedPos.y
      targetPositions[i3 + 2] = collapsedPos.z
      
      collapseStates[i] = 0 // Start in superposition
      collapseProgress[i] = 0
      phases[i] = Math.random() * Math.PI * 2
    }
    
    return { positions, targetPositions, collapseStates, sectionAssignments, phases, collapseProgress }
  }, [particleCount, sectionRegions, sectionCount])
  
  // Animation frame
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const sectionIndex = particles.sectionAssignments[i]
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
        // Increase collapse progress
        particles.collapseProgress[i] = Math.min(1, particles.collapseProgress[i] + particleConfig.quantumField.collapseSpeed)
        particles.collapseStates[i] = particles.collapseProgress[i]
        
        // Lerp toward collapsed position
        const collapsedPos = currentPos.clone().lerp(targetPos, particles.collapseProgress[i])
        
        // Add subtle clustering force when collapsed
        if (particles.collapseProgress[i] > 0.5) {
          const region = sectionRegions[sectionIndex]
          const distToCenter = collapsedPos.distanceTo(region.center)
          if (distToCenter > 0.2) {
            const clusterForce = 0.02
            const direction = region.center.clone().sub(collapsedPos).normalize()
            collapsedPos.addScaledVector(direction, clusterForce)
          }
        }
        
        // Hover enhancement - tighter clustering
        if (isHovered) {
          const region = sectionRegions[sectionIndex]
          const hoverForce = 0.03
          const direction = region.center.clone().sub(collapsedPos).normalize()
          collapsedPos.addScaledVector(direction, hoverForce)
        }
        
        positions[i3] = collapsedPos.x
        positions[i3 + 1] = collapsedPos.y
        positions[i3 + 2] = collapsedPos.z
      } else {
        // Superposition - particles exist in probability cloud
        // Add quantum uncertainty (Heisenberg uncertainty principle)
        const phase = particles.phases[i]
        const uncertainty = particleConfig.quantumField.superpositionSpread
        
        // Quantum fluctuation - particles "jump" between possible positions
        const fluctuation = Math.sin(time * 2 + phase) * uncertainty * 0.3
        const quantumPos = new THREE.Vector3(
          currentPos.x + Math.sin(time * 1.5 + phase) * fluctuation,
          currentPos.y + Math.cos(time * 1.7 + phase) * fluctuation,
          currentPos.z + Math.sin(time * 1.3 + phase * 0.7) * fluctuation
        )
        
        positions[i3] = quantumPos.x
        positions[i3 + 1] = quantumPos.y
        positions[i3 + 2] = quantumPos.z
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
