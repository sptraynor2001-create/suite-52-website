/**
 * EventGlobe - Interactive 3D globe showing event locations
 */

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'

interface EventMarker {
  name: string
  lat: number
  lon: number
  date: string
}

interface EventGlobeProps {
  events?: EventMarker[]
  radius?: number
  onEventHover?: (event: EventMarker | null) => void
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

export function EventGlobe({
  events = [],
  radius = 2,
  onEventHover,
}: EventGlobeProps) {
  const globeRef = useRef<THREE.Group>(null)
  const wireframeRef = useRef<THREE.LineSegments>(null)
  const markersRef = useRef<THREE.Group>(null)
  const { settings, isMobile } = useQuality()
  const [isDragging, setIsDragging] = useState(false)
  const [rotationVelocity, setRotationVelocity] = useState({ x: 0, y: 0.002 })

  // Globe resolution based on quality
  const segments = settings.level === 'high' ? 48 : settings.level === 'medium' ? 32 : 24

  // Create wireframe geometry
  const wireframeGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(radius, 2)
    return new THREE.WireframeGeometry(geo)
  }, [radius])

  // Event markers positions
  const markerPositions = useMemo(() => {
    return events.map(event => ({
      ...event,
      position: latLonToPosition(event.lat, event.lon, radius),
    }))
  }, [events, radius])

  useFrame((state) => {
    if (!globeRef.current) return

    const time = state.clock.getElapsedTime()

    // Auto-rotate when not dragging
    if (!isDragging) {
      globeRef.current.rotation.y += rotationVelocity.y
      
      // Dampen velocity
      setRotationVelocity(prev => ({
        x: prev.x * 0.98,
        y: prev.y * 0.995 + 0.0001,
      }))
    }

    // Pulse markers
    if (markersRef.current) {
      markersRef.current.children.forEach((marker, i) => {
        const scale = 1 + Math.sin(time * 2 + i * 0.5) * 0.2
        marker.scale.setScalar(scale)
      })
    }
  })

  // Drag handling for rotation
  const handlePointerDown = () => {
    if (!isMobile) setIsDragging(true)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  const handlePointerMove = (e: THREE.Event) => {
    if (isDragging && globeRef.current) {
      const movement = e.movementX || 0
      globeRef.current.rotation.y += movement * 0.005
      setRotationVelocity(prev => ({ ...prev, y: movement * 0.001 }))
    }
  }

  return (
    <group
      ref={globeRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      {/* Solid inner sphere */}
      <mesh>
        <sphereGeometry args={[radius * 0.98, segments, segments]} />
        <meshStandardMaterial
          color={0x0a0a0a}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wireframe globe */}
      <lineSegments ref={wireframeRef} geometry={wireframeGeometry}>
        <lineBasicMaterial
          color={0x3a3a3a}
          transparent
          opacity={0.5}
        />
      </lineSegments>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 16, 64]} />
        <meshBasicMaterial
          color={0xe63946}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Event markers */}
      <group ref={markersRef}>
        {markerPositions.map((marker, i) => (
          <group key={i} position={marker.position}>
            {/* Marker point */}
            <mesh
              onPointerEnter={() => onEventHover?.(marker)}
              onPointerLeave={() => onEventHover?.(null)}
            >
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color={0xe63946}
                emissive={0xe63946}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Marker glow */}
            <mesh>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial
                color={0xe63946}
                transparent
                opacity={0.3}
                depthWrite={false}
              />
            </mesh>

            {/* Marker beam */}
            <mesh
              position={[
                marker.position.x * 0.1,
                marker.position.y * 0.1,
                marker.position.z * 0.1,
              ]}
              scale={[1, 1, 0.3]}
            >
              <cylinderGeometry args={[0.005, 0.005, 0.4, 8]} />
              <meshBasicMaterial
                color={0xe63946}
                transparent
                opacity={0.4}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Connection lines between events */}
      {markerPositions.length > 1 && settings.level !== 'low' && (
        <ConnectionLines markers={markerPositions} radius={radius} />
      )}
    </group>
  )
}

// Connection lines between event markers
function ConnectionLines({ 
  markers, 
  radius 
}: { 
  markers: Array<{ position: THREE.Vector3 }>
  radius: number 
}) {
  const linesRef = useRef<THREE.Group>(null)

  const lines = useMemo(() => {
    const result = []
    for (let i = 0; i < markers.length - 1; i++) {
      const start = markers[i].position
      const end = markers[i + 1].position

      // Create arc between points
      const points = []
      const segments = 32
      for (let j = 0; j <= segments; j++) {
        const t = j / segments
        const point = new THREE.Vector3().lerpVectors(start, end, t)
        // Lift arc above surface
        const lift = Math.sin(t * Math.PI) * 0.3
        point.normalize().multiplyScalar(radius + lift)
        points.push(point)
      }

      result.push(points)
    }
    return result
  }, [markers, radius])

  useFrame((state) => {
    if (!linesRef.current) return
    
    // Animate line opacity
    const time = state.clock.getElapsedTime()
    linesRef.current.children.forEach((line, i) => {
      const material = (line as THREE.Line).material as THREE.LineBasicMaterial
      material.opacity = 0.2 + Math.sin(time + i) * 0.1
    })
  })

  return (
    <group ref={linesRef}>
      {lines.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={0xe63946}
            transparent
            opacity={0.3}
          />
        </line>
      ))}
    </group>
  )
}

// Ambient particles around globe
export function GlobeParticles({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const { settings } = useQuality()

  const adjustedCount = Math.min(count, settings.particleCount / 10)

  const particles = useMemo(() => {
    const positions = new Float32Array(adjustedCount * 3)
    const phases = new Float32Array(adjustedCount)

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 3 + Math.random() * 2

      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)

      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, phases }
  }, [adjustedCount])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < adjustedCount; i++) {
      const i3 = i * 3
      const phase = particles.phases[i]

      // Gentle orbital drift
      const angle = time * 0.1 + phase
      const x = positions[i3]
      const z = positions[i3 + 2]
      const r = Math.sqrt(x * x + z * z)
      
      positions[i3] = Math.cos(angle) * r
      positions[i3 + 2] = Math.sin(angle) * r
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
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
        size={0.02}
        color={0xffffff}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default EventGlobe

