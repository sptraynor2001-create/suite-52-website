/**
 * ParticleConstellationGlobe - Particle-based globe with continent clustering and show constellations
 * Original implementation: Entire globe is particles that cluster to form continents
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { useIsMobile } from '@/shared/hooks/useIsMobile'

interface ShowMarker {
  name: string
  lat: number
  lon: number
  date: string
}

interface ParticleConstellationGlobeProps {
  shows?: ShowMarker[]
  radius?: number
}

// Convert lat/lon to 3D position on sphere
function latLonToPosition(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

// Simplified continent density map (major landmasses)
// Returns density value 0-1 for a given lat/lon
function getContinentDensity(lat: number, lon: number): number {
  // North America
  if (lat > 15 && lat < 70 && lon > -170 && lon < -50) return 0.8
  // South America
  if (lat > -55 && lat < 15 && lon > -85 && lon < -30) return 0.7
  // Europe
  if (lat > 35 && lat < 70 && lon > -10 && lon < 40) return 0.9
  // Africa
  if (lat > -35 && lat < 35 && lon > -20 && lon < 50) return 0.7
  // Asia
  if (lat > 10 && lat < 70 && lon > 40 && lon < 180) return 0.8
  // Australia
  if (lat > -45 && lat < -10 && lon > 110 && lon < 155) return 0.6
  // Middle East
  if (lat > 12 && lat < 45 && lon > 25 && lon < 60) return 0.7
  
  // Ocean areas have lower density
  return 0.2
}

// Convert 3D position back to lat/lon for density lookup
function positionToLatLon(pos: THREE.Vector3): { lat: number; lon: number } {
  const normalized = pos.clone().normalize()
  const lat = 90 - (Math.acos(normalized.y) * 180 / Math.PI)
  const lon = (Math.atan2(normalized.z, -normalized.x) * 180 / Math.PI) - 180
  return { lat, lon }
}

export function ParticleConstellationGlobe({
  shows = [],
  radius = 2.5,
}: ParticleConstellationGlobeProps) {
  const globeRef = useRef<THREE.Group>(null)
  const baseParticlesRef = useRef<THREE.Points>(null)
  const constellationParticlesRef = useRef<THREE.Points>(null)
  const plasmaParticlesRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()
  const isMobileDevice = useIsMobile()
  
  // Particle counts based on quality
  const baseParticleCount = useMemo(() => {
    const target = isMobileDevice 
      ? particleConfig.constellationGlobe.baseParticles.mobile
      : particleConfig.constellationGlobe.baseParticles.desktop
    return Math.min(target, settings.particleCount)
  }, [settings.particleCount, isMobileDevice])
  
  const constellationParticleCount = useMemo(() => {
    return isMobileDevice
      ? particleConfig.constellationGlobe.constellationParticles.mobile
      : particleConfig.constellationGlobe.constellationParticles.desktop
  }, [isMobileDevice])
  
  // Show positions
  const showPositions = useMemo(() => {
    return shows.map(show => ({
      ...show,
      position: latLonToPosition(show.lat, show.lon, radius),
    }))
  }, [shows, radius])
  
  // Base particles - distributed on sphere surface with bias toward continents
  const baseParticles = useMemo(() => {
    const positions = new Float32Array(baseParticleCount * 3)
    const velocities = new Float32Array(baseParticleCount * 3)
    const basePositions = new Float32Array(baseParticleCount * 3) // Original sphere positions
    const phases = new Float32Array(baseParticleCount)
    const densities = new Float32Array(baseParticleCount)
    
    const continentBias = particleConfig.constellationGlobe.continentBias || 0.7
    
    for (let i = 0; i < baseParticleCount; i++) {
      const i3 = i * 3
      
      let theta, phi, lat, lon, density
      let attempts = 0
      
      // Bias distribution toward continents
      do {
        // Distribute on sphere surface
        theta = Math.random() * Math.PI * 2
        phi = Math.acos(2 * Math.random() - 1)
        
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)
        
        // Get continent density for this position
        const pos = new THREE.Vector3(x, y, z)
        const coords = positionToLatLon(pos)
        lat = coords.lat
        lon = coords.lon
        density = getContinentDensity(lat, lon)
        
        attempts++
        // Accept position if it's in a continent area, or randomly based on bias
        if (density > 0.5 || Math.random() > continentBias || attempts > 50) {
          break
        }
      } while (true)
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z
      
      densities[i] = density
      
      // Initial velocities (small random, slower in continents for stability)
      const speed = density > 0.5 ? 0.0003 : 0.001
      velocities[i3] = (Math.random() - 0.5) * speed
      velocities[i3 + 1] = (Math.random() - 0.5) * speed
      velocities[i3 + 2] = (Math.random() - 0.5) * speed
      
      phases[i] = Math.random() * Math.PI * 2
    }
    
    return { positions, velocities, basePositions, phases, densities }
  }, [baseParticleCount, radius])
  
  // Constellation particles (red clusters at show locations)
  const constellationParticles = useMemo(() => {
    const totalConstellationParticles = showPositions.length * constellationParticleCount
    const positions = new Float32Array(totalConstellationParticles * 3)
    const baseOffsets = new Float32Array(totalConstellationParticles * 3)
    const phases = new Float32Array(totalConstellationParticles)
    const showIndices = new Uint16Array(totalConstellationParticles)
    const sizes = new Float32Array(totalConstellationParticles)
    const pulseSpeeds = new Float32Array(totalConstellationParticles)
    const orbitalSpeeds = new Float32Array(totalConstellationParticles)
    const pulseAmplitudes = new Float32Array(totalConstellationParticles)
    
    let particleIndex = 0
    showPositions.forEach((show, showIndex) => {
      for (let i = 0; i < constellationParticleCount; i++) {
        const i3 = particleIndex * 3
        
        // Much more variation in distribution - mix of patterns
        const patternType = Math.random()
        let r, theta, phi
        
        if (patternType < 0.3) {
          // Tight cluster
          r = 0.1 + Math.random() * 0.2
          theta = Math.random() * Math.PI * 2
          phi = Math.acos(2 * Math.random() - 1)
        } else if (patternType < 0.6) {
          // Medium spread
          r = 0.2 + Math.random() * 0.3
          theta = Math.random() * Math.PI * 2
          phi = Math.acos(2 * Math.random() - 1)
        } else if (patternType < 0.85) {
          // Wide spread
          r = 0.3 + Math.random() * 0.4
          theta = Math.random() * Math.PI * 2
          phi = Math.acos(2 * Math.random() - 1)
        } else {
          // Very wide outliers
          r = 0.5 + Math.random() * 0.5
          theta = Math.random() * Math.PI * 2
          phi = Math.acos(2 * Math.random() - 1)
        }
        
        const offset = new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
        
        // Rotate offset to align with show position
        const showDir = show.position.clone().normalize()
        const up = new THREE.Vector3(0, 1, 0)
        const right = new THREE.Vector3().crossVectors(up, showDir).normalize()
        const localUp = new THREE.Vector3().crossVectors(showDir, right).normalize()
        
        const rotatedOffset = new THREE.Vector3()
          .addScaledVector(right, offset.x)
          .addScaledVector(localUp, offset.y)
          .addScaledVector(showDir, offset.z)
        
        const finalPos = show.position.clone().add(rotatedOffset)
        
        positions[i3] = finalPos.x
        positions[i3 + 1] = finalPos.y
        positions[i3 + 2] = finalPos.z
        
        baseOffsets[i3] = offset.x
        baseOffsets[i3 + 1] = offset.y
        baseOffsets[i3 + 2] = offset.z
        
        phases[particleIndex] = Math.random() * Math.PI * 2
        showIndices[particleIndex] = showIndex
        
        // Much more size variation - from small to large
        sizes[particleIndex] = 0.04 + Math.random() * 0.12 // 0.04 to 0.16 (4x variation)
        
        // Variation in pulse speeds
        pulseSpeeds[particleIndex] = 1.0 + Math.random() * 3.0 // 1.0 to 4.0
        
        // Variation in orbital speeds
        orbitalSpeeds[particleIndex] = 0.1 + Math.random() * 0.6 // 0.1 to 0.7
        
        // Variation in pulse amplitude
        pulseAmplitudes[particleIndex] = 0.15 + Math.random() * 0.35 // 0.15 to 0.5
        
        particleIndex++
      }
    })
    
    return { 
      positions, 
      baseOffsets, 
      phases, 
      showIndices, 
      sizes,
      pulseSpeeds,
      orbitalSpeeds,
      pulseAmplitudes,
      totalCount: totalConstellationParticles 
    }
  }, [showPositions, constellationParticleCount])
  
  // Plasma particles - spin out from globe like solar flares
  const plasmaParticleCount = useMemo(() => {
    return isMobileDevice ? 300 : 600
  }, [isMobileDevice])

  const plasmaParticles = useMemo(() => {
    const positions = new Float32Array(plasmaParticleCount * 3)
    const velocities = new Float32Array(plasmaParticleCount * 3)
    const startPositions = new Float32Array(plasmaParticleCount * 3)
    const phases = new Float32Array(plasmaParticleCount)
    const speeds = new Float32Array(plasmaParticleCount)
    const maxDistances = new Float32Array(plasmaParticleCount)
    const returnTypes = new Uint8Array(plasmaParticleCount) // 0 = permanent, 1 = returns
    
    for (let i = 0; i < plasmaParticleCount; i++) {
      const i3 = i * 3
      
      // Start on sphere surface
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      const startX = radius * Math.sin(phi) * Math.cos(theta)
      const startY = radius * Math.cos(phi)
      const startZ = radius * Math.sin(phi) * Math.sin(theta)
      
      startPositions[i3] = startX
      startPositions[i3 + 1] = startY
      startPositions[i3 + 2] = startZ
      
      // Initial position (start at surface)
      positions[i3] = startX
      positions[i3 + 1] = startY
      positions[i3 + 2] = startZ
      
      // Velocity direction (outward from surface)
      const direction = new THREE.Vector3(startX, startY, startZ).normalize()
      const speed = 0.01 + Math.random() * 0.02
      speeds[i] = speed
      
      velocities[i3] = direction.x * speed
      velocities[i3 + 1] = direction.y * speed
      velocities[i3 + 2] = direction.z * speed
      
      // Max distance (some go far, some stay closer) - closer but still varied
      maxDistances[i] = radius * (1.1 + Math.random() * 0.5) // 1.1x to 1.6x radius (closer, but varied)
      
      // 60% return, 40% permanent
      returnTypes[i] = Math.random() < 0.6 ? 1 : 0
      
      phases[i] = Math.random() * Math.PI * 2
    }
    
    return { positions, velocities, startPositions, phases, speeds, maxDistances, returnTypes }
  }, [plasmaParticleCount, radius])
  
  // Animation frame
  useFrame((state) => {
    if (!globeRef.current || !baseParticlesRef.current || !plasmaParticlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const delta = state.clock.getDelta()
    
    // Continuous rotation
    globeRef.current.rotation.y += particleConfig.constellationGlobe.rotationSpeed
    
    // Update base particles
    const basePositions = baseParticlesRef.current.geometry.attributes.position.array as Float32Array
    const baseVelocities = baseParticles.velocities
    
    for (let i = 0; i < baseParticleCount; i++) {
      const i3 = i * 3
      const pos = new THREE.Vector3(
        basePositions[i3],
        basePositions[i3 + 1],
        basePositions[i3 + 2]
      )
      
      // Get base sphere position
      const basePos = new THREE.Vector3(
        baseParticles.basePositions[i3],
        baseParticles.basePositions[i3 + 1],
        baseParticles.basePositions[i3 + 2]
      )
      
      // Continent attraction - particles cluster based on density
      const density = baseParticles.densities[i]
      const attractionStrength = particleConfig.constellationGlobe.continentAttraction.base
      
      // Attract particles toward continent areas
      const { lat, lon } = positionToLatLon(basePos)
      const targetDensity = getContinentDensity(lat, lon)
      const densityDiff = targetDensity - 0.5 // Center around 0.5
      
      // Much stronger attraction for continent areas to create dense pixel-like clusters
      if (targetDensity > 0.5) {
        // Strong attraction toward continent center - creates dense clustering
        const force = densityDiff * attractionStrength * 0.08
        const direction = basePos.clone().normalize()
        pos.addScaledVector(direction, force)
        
        // Additional inward pull to create tighter clusters (like dense pixels)
        const inwardForce = targetDensity * attractionStrength * 0.03
        pos.addScaledVector(direction, inwardForce)
      } else {
        // Ocean particles - push away from continents, spread out more
        const force = Math.abs(densityDiff) * attractionStrength * 0.02
        const direction = basePos.clone().normalize()
        // Push ocean particles slightly outward
        pos.addScaledVector(direction, -force * 0.5)
      }
      
      // Keep particles on sphere surface
      pos.normalize().multiplyScalar(radius)
      
      // Add subtle drift (less in continents for stability)
      const phase = baseParticles.phases[i]
      const driftAmount = density > 0.5 ? 0.0003 : 0.001
      pos.addScaledVector(
        new THREE.Vector3(
          Math.sin(time * 0.5 + phase) * driftAmount,
          Math.cos(time * 0.7 + phase) * driftAmount,
          Math.sin(time * 0.3 + phase) * driftAmount
        ),
        1
      )
      
      // Renormalize to sphere
      pos.normalize().multiplyScalar(radius)
      
      basePositions[i3] = pos.x
      basePositions[i3 + 1] = pos.y
      basePositions[i3 + 2] = pos.z
    }
    
    baseParticlesRef.current.geometry.attributes.position.needsUpdate = true
    
    // Update constellation particles (red clusters)
    if (constellationParticlesRef.current && constellationParticles.totalCount > 0) {
      const constellationPositions = constellationParticlesRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < constellationParticles.totalCount; i++) {
      const i3 = i * 3
      const showIndex = constellationParticles.showIndices[i]
      const show = showPositions[showIndex]
      
      if (!show) continue
      
      // Base offset from show position
      const baseOffset = new THREE.Vector3(
        constellationParticles.baseOffsets[i3],
        constellationParticles.baseOffsets[i3 + 1],
        constellationParticles.baseOffsets[i3 + 2]
      )
      
      // Pulse animation (breathing effect) - varied per particle
      const pulseSpeed = constellationParticles.pulseSpeeds[i]
      const pulseAmp = constellationParticles.pulseAmplitudes[i]
      const pulse = 0.7 + Math.sin(time * pulseSpeed + constellationParticles.phases[i]) * pulseAmp
      const scaledOffset = baseOffset.clone().multiplyScalar(pulse)
      
      // Rotate offset around show position (orbital motion) - varied per particle
      const showDir = show.position.clone().normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const right = new THREE.Vector3().crossVectors(up, showDir).normalize()
      const localUp = new THREE.Vector3().crossVectors(showDir, right).normalize()
      
      const orbitalSpeed = constellationParticles.orbitalSpeeds[i]
      const angle = time * orbitalSpeed + constellationParticles.phases[i]
      const rotatedOffset = new THREE.Vector3()
        .addScaledVector(right, scaledOffset.x * Math.cos(angle))
        .addScaledVector(localUp, scaledOffset.y)
        .addScaledVector(showDir, scaledOffset.z * Math.sin(angle))
      
      const finalPos = show.position.clone().add(rotatedOffset)
      
        constellationPositions[i3] = finalPos.x
        constellationPositions[i3 + 1] = finalPos.y
        constellationPositions[i3 + 2] = finalPos.z
      }
      
      constellationParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    // Update plasma particles
    const plasmaPositions = plasmaParticlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < plasmaParticleCount; i++) {
      const i3 = i * 3
      
      const pos = new THREE.Vector3(
        plasmaPositions[i3],
        plasmaPositions[i3 + 1],
        plasmaPositions[i3 + 2]
      )
      
      const startPos = new THREE.Vector3(
        plasmaParticles.startPositions[i3],
        plasmaParticles.startPositions[i3 + 1],
        plasmaParticles.startPositions[i3 + 2]
      )
      
      const velocity = new THREE.Vector3(
        plasmaParticles.velocities[i3],
        plasmaParticles.velocities[i3 + 1],
        plasmaParticles.velocities[i3 + 2]
      )
      
      const maxDist = plasmaParticles.maxDistances[i]
      const returnType = plasmaParticles.returnTypes[i]
      const currentDist = pos.length()
      
      if (returnType === 0) {
        // Permanent - keep going out
        if (currentDist < maxDist) {
          pos.add(velocity.clone().multiplyScalar(delta * 60))
        }
        // Slow down as it reaches max distance
        if (currentDist >= maxDist * 0.9) {
          velocity.multiplyScalar(0.98)
        }
      } else {
        // Returns - go out then come back
        const phase = (time * 0.3 + plasmaParticles.phases[i]) % (Math.PI * 2)
        const distance = radius + (maxDist - radius) * Math.sin(phase)
        
        const direction = startPos.clone().normalize()
        const basePos = direction.clone().multiplyScalar(distance)
        
        // Add spiral motion
        const spiralAngle = time * 0.5 + plasmaParticles.phases[i]
        const spiralRadius = (distance - radius) * 0.3
        const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x).normalize()
        const up = new THREE.Vector3().crossVectors(direction, perpendicular).normalize()
        
        const spiralOffset = perpendicular
          .clone()
          .multiplyScalar(Math.cos(spiralAngle) * spiralRadius)
          .add(up.clone().multiplyScalar(Math.sin(spiralAngle) * spiralRadius))
        
        pos.copy(basePos.add(spiralOffset))
      }
      
      // Update velocity for next frame
      plasmaParticles.velocities[i3] = velocity.x
      plasmaParticles.velocities[i3 + 1] = velocity.y
      plasmaParticles.velocities[i3 + 2] = velocity.z
      
      plasmaPositions[i3] = pos.x
      plasmaPositions[i3 + 1] = pos.y
      plasmaPositions[i3 + 2] = pos.z
    }
    
    plasmaParticlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <group ref={globeRef} scale={[0.75, 0.75, 0.75]}>
      {/* Base particles (white, forming globe and continents) */}
      <points ref={baseParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={baseParticleCount}
            array={baseParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color={0xffffff}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Constellation particles (red clusters at show locations) */}
      {constellationParticles.totalCount > 0 && (
        <points ref={constellationParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={constellationParticles.totalCount}
              array={constellationParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={constellationParticles.totalCount}
              array={constellationParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={`
              attribute float size;
              varying vec3 vColor;
              
              void main() {
                vColor = vec3(1.0, 0.227, 0.278); // Red color
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
                gl_FragColor = vec4(vColor, alpha);
              }
            `}
            uniforms={{
              color: { value: new THREE.Color(0xe63946) }
            }}
            transparent
            opacity={1.0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
      
      {/* Plasma particles (solar flare effect) */}
      <points ref={plasmaParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={plasmaParticleCount}
            array={plasmaParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={0xffaa44}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default ParticleConstellationGlobe
