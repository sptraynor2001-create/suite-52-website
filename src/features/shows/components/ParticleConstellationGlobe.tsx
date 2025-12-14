/**
 * ParticleConstellationGlobe - Particle-based globe with continent clustering and show constellations
 * Original implementation: Entire globe is particles that cluster to form continents
 */

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'
import { particleConfig } from '@/config/particles'
import { breakpoints } from '@/themes/breakpoints'

interface ShowMarker {
  name: string
  lat: number
  lon: number
  date: string
}

interface ParticleConstellationGlobeProps {
  shows?: ShowMarker[]
  radius?: number
  onShowHover?: (show: ShowMarker | null) => void
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
  onShowHover,
}: ParticleConstellationGlobeProps) {
  const globeRef = useRef<THREE.Group>(null)
  const baseParticlesRef = useRef<THREE.Points>(null)
  const constellationParticlesRef = useRef<THREE.Points>(null)
  const { settings, isMobile } = useQuality()
  const { pointer } = useThree()
  
  const [mouseHover, setMouseHover] = useState(false)
  const [hoveredShow, setHoveredShow] = useState<number | null>(null)
  
  // Detect mobile
  const isMobileDevice = typeof window !== 'undefined' && (
    window.innerWidth < breakpoints.tablet || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
  
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
  
  // Base particles - distributed on sphere surface
  const baseParticles = useMemo(() => {
    const positions = new Float32Array(baseParticleCount * 3)
    const velocities = new Float32Array(baseParticleCount * 3)
    const basePositions = new Float32Array(baseParticleCount * 3) // Original sphere positions
    const phases = new Float32Array(baseParticleCount)
    const densities = new Float32Array(baseParticleCount)
    
    for (let i = 0; i < baseParticleCount; i++) {
      const i3 = i * 3
      
      // Distribute evenly on sphere surface
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)
      
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      
      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z
      
      // Get continent density for this position
      const { lat, lon } = positionToLatLon(new THREE.Vector3(x, y, z))
      densities[i] = getContinentDensity(lat, lon)
      
      // Initial velocities (small random)
      velocities[i3] = (Math.random() - 0.5) * 0.001
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.001
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001
      
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
    
    let particleIndex = 0
    showPositions.forEach((show, showIndex) => {
      for (let i = 0; i < constellationParticleCount; i++) {
        const i3 = particleIndex * 3
        
        // Distribute particles in small sphere around show location
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = 0.15 * Math.random() // Small radius around show
        
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
        
        particleIndex++
      }
    })
    
    return { positions, baseOffsets, phases, showIndices, totalCount: totalConstellationParticles }
  }, [showPositions, constellationParticleCount])
  
  // Wave system - track active waves
  const wavesRef = useRef<Array<{
    showIndex: number
    startTime: number
    radius: number
  }>>([])
  
  const lastWaveTimeRef = useRef<number>(0)
  
  // Initialize waves
  useEffect(() => {
    const interval = particleConfig.constellationGlobe.waveInterval * 1000
    let waveIndex = 0
    
    const startWave = () => {
      if (showPositions.length > 0) {
        wavesRef.current.push({
          showIndex: waveIndex % showPositions.length,
          startTime: Date.now(),
          radius: 0,
        })
        waveIndex++
      }
    }
    
    // Start first wave after delay
    const initialTimeout = setTimeout(() => {
      startWave()
      const intervalId = setInterval(startWave, interval)
      return () => clearInterval(intervalId)
    }, 2000)
    
    return () => {
      clearTimeout(initialTimeout)
    }
  }, [showPositions.length])
  
  // Animation frame
  useFrame((state) => {
    if (!globeRef.current || !baseParticlesRef.current || !constellationParticlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const delta = state.clock.getDelta()
    
    // Auto-rotate globe
    globeRef.current.rotation.y += particleConfig.constellationGlobe.rotationSpeed
    
    // Get mouse position in 3D space (projected onto sphere)
    const mouse3D = new THREE.Vector3(
      pointer.x * 5,
      pointer.y * 5,
      6
    ).normalize().multiplyScalar(radius)
    
    // Check hover over show constellations
    if (!isMobileDevice) {
      let closestShow: number | null = null
      let closestDist = Infinity
      
      showPositions.forEach((show, index) => {
        const dist = mouse3D.distanceTo(show.position)
        if (dist < 0.8 && dist < closestDist) {
          closestDist = dist
          closestShow = index
        }
      })
      
      if (closestShow !== hoveredShow) {
        setHoveredShow(closestShow)
        onShowHover?.(closestShow !== null ? shows[closestShow] : null)
      }
      
      // Update mouse hover state based on pointer movement
      const mouseMoving = Math.abs(pointer.x) > 0.01 || Math.abs(pointer.y) > 0.01
      if (mouseMoving && !mouseHover) {
        setMouseHover(true)
      }
    }
    
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
      const attractionStrength = mouseHover 
        ? particleConfig.constellationGlobe.continentAttraction.hover
        : particleConfig.constellationGlobe.continentAttraction.base
      
      // Attract particles toward continent areas
      const { lat, lon } = positionToLatLon(basePos)
      const targetDensity = getContinentDensity(lat, lon)
      const densityDiff = targetDensity - 0.5 // Center around 0.5
      
      // Apply attraction force based on density
      const force = densityDiff * attractionStrength * 0.01
      const direction = basePos.clone().normalize()
      pos.addScaledVector(direction, force)
      
      // Mouse interaction - particles near mouse cluster more
      if (!isMobileDevice) {
        const mouseDist = pos.distanceTo(mouse3D)
        if (mouseDist < radius * 0.5) {
          const mouseForce = (1 - mouseDist / (radius * 0.5)) * 0.02
          const mouseDir = pos.clone().sub(mouse3D).normalize()
          pos.addScaledVector(mouseDir, -mouseForce) // Attract toward mouse
        }
      }
      
      // Wave effects - particles pushed outward by waves
      wavesRef.current.forEach((wave) => {
        const waveAge = (Date.now() - wave.startTime) / 1000
        const waveRadius = waveAge * particleConfig.constellationGlobe.waveSpeed
        const wavePos = showPositions[wave.showIndex]?.position
        
        if (wavePos) {
          const distToWave = pos.distanceTo(wavePos)
          const waveDist = Math.abs(distToWave - waveRadius)
          
          if (waveDist < 0.3 && waveAge < 5) {
            const waveStrength = (1 - waveAge / 5) * (1 - waveDist / 0.3) * 0.05
            const waveDir = pos.clone().sub(wavePos).normalize()
            pos.addScaledVector(waveDir, waveStrength)
          }
        }
      })
      
      // Keep particles on sphere surface
      pos.normalize().multiplyScalar(radius)
      
      // Add subtle drift
      const phase = baseParticles.phases[i]
      pos.addScaledVector(
        new THREE.Vector3(
          Math.sin(time * 0.5 + phase) * 0.001,
          Math.cos(time * 0.7 + phase) * 0.001,
          Math.sin(time * 0.3 + phase) * 0.001
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
      
      // Pulse animation (breathing effect)
      const pulse = 0.8 + Math.sin(time * 2 + constellationParticles.phases[i]) * 0.2
      const scaledOffset = baseOffset.clone().multiplyScalar(pulse)
      
      // Rotate offset around show position (orbital motion)
      const showDir = show.position.clone().normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const right = new THREE.Vector3().crossVectors(up, showDir).normalize()
      const localUp = new THREE.Vector3().crossVectors(showDir, right).normalize()
      
      const angle = time * 0.3 + constellationParticles.phases[i]
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
    
    // Clean up old waves
    wavesRef.current = wavesRef.current.filter(
      wave => (Date.now() - wave.startTime) / 1000 < 5
    )
  })
  
  const handlePointerMove = () => {
    if (!isMobileDevice) {
      setMouseHover(true)
    }
  }
  
  const handlePointerLeave = () => {
    setMouseHover(false)
    setHoveredShow(null)
    onShowHover?.(null)
  }
  
  return (
    <group
      ref={globeRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
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
          size={0.02}
          color={0xffffff}
          transparent
          opacity={0.4}
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
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color={0xe63946}
            transparent
            opacity={0.8}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  )
}

export default ParticleConstellationGlobe
