/**
 * TimelineVisualizer - Music-style bars representing show timeline
 * Similar to audio visualizer but represents show dates
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '@/shared/components/3d'

interface ShowMarker {
  name: string
  lat: number
  lon: number
  date: string
}

interface TimelineVisualizerProps {
  shows: ShowMarker[]
  radius?: number
  height?: number
}

// Parse date string (format: MM_DD_YY) to timestamp
function parseShowDate(dateStr: string): number {
  const [month, day, year] = dateStr.split('_').map(Number)
  // Assume 20XX for years < 100
  const fullYear = year < 100 ? 2000 + year : year
  return new Date(fullYear, month - 1, day).getTime()
}

export function TimelineVisualizer({
  shows,
  radius = 4,
  height = 2,
}: TimelineVisualizerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { settings } = useQuality()

  // Sort shows by date and create bars
  const bars = useMemo(() => {
    const sortedShows = [...shows].sort((a, b) => {
      const dateA = parseShowDate(a.date)
      const dateB = parseShowDate(b.date)
      return dateA - dateB
    })

    const now = Date.now()
    const bars = sortedShows.map((show, i) => {
      const showDate = parseShowDate(show.date)
      const daysUntil = Math.max(0, (showDate - now) / (1000 * 60 * 60 * 24))
      
      // Angle based on position in timeline
      const angle = (i / sortedShows.length) * Math.PI * 2
      
      return {
        show,
        angle,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        phase: Math.random() * Math.PI * 2,
        daysUntil,
        index: i,
      }
    })

    return bars
  }, [shows, radius])

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const bar = bars[i]
      if (!bar) return

      // Calculate amplitude based on proximity to show date
      // Closer shows = higher bars
      const daysUntil = bar.daysUntil
      const maxDays = 365 // Scale for shows within a year
      const proximity = Math.max(0, 1 - daysUntil / maxDays)
      
      // Add pulsing animation
      const pulse = Math.sin(time * 2 + bar.phase) * 0.2 + 0.8
      const amplitude = proximity * pulse

      // Scale bar height
      const targetScale = Math.max(0.1, amplitude * height)
      child.scale.y = THREE.MathUtils.lerp(child.scale.y, targetScale, 0.15)
      child.position.y = child.scale.y / 2

      // Color intensity - red for upcoming shows
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      const intensity = amplitude * 0.6
      material.emissiveIntensity = intensity
      
      // Red color for shows within 60 days
      if (daysUntil < 60) {
        material.color.setHex(0xe63946)
        material.emissive.setHex(0xe63946)
      } else {
        material.color.setHex(0xffffff)
        material.emissive.setHex(0xffffff)
      }
    })

    // Slow rotation
    groupRef.current.rotation.y = time * 0.03
  })

  return (
    <group ref={groupRef} position={[0, -3, 0]}>
      {bars.map((bar, i) => (
        <mesh
          key={`${bar.show.name}-${i}`}
          position={[bar.x, 0, bar.z]}
          rotation={[0, -bar.angle, 0]}
        >
          <boxGeometry args={[0.08, 1, 0.08]} />
          <meshStandardMaterial
            color={bar.daysUntil < 60 ? 0xe63946 : 0xffffff}
            emissive={bar.daysUntil < 60 ? 0xe63946 : 0xffffff}
            emissiveIntensity={0.3}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </group>
  )
}

// Connection arcs between shows (like waveform connections)
export function ShowConnections({ shows, radius = 2.5 }: { shows: ShowMarker[], radius?: number }) {
  const linesRef = useRef<THREE.Group>(null)
  const { settings } = useQuality()

  const connections = useMemo(() => {
    if (shows.length < 2) return []

    const sortedShows = [...shows].sort((a, b) => {
      const dateA = parseShowDate(a.date)
      const dateB = parseShowDate(b.date)
      return dateA - dateB
    })

    const result = []
    for (let i = 0; i < sortedShows.length - 1; i++) {
      const start = latLonToPosition(sortedShows[i].lat, sortedShows[i].lon, radius)
      const end = latLonToPosition(sortedShows[i + 1].lat, sortedShows[i + 1].lon, radius)

      // Create arc between points
      const points = []
      const segments = 32
      for (let j = 0; j <= segments; j++) {
        const t = j / segments
        const point = new THREE.Vector3().lerpVectors(start, end, t)
        // Lift arc above surface
        const lift = Math.sin(t * Math.PI) * 0.4
        point.normalize().multiplyScalar(radius + lift)
        points.push(point)
      }

      result.push({ points, index: i })
    }
    return result
  }, [shows, radius])

  useFrame((state) => {
    if (!linesRef.current) return
    
    const time = state.clock.getElapsedTime()
    linesRef.current.children.forEach((line, i) => {
      const material = (line as THREE.Line).material as THREE.LineBasicMaterial
      // Pulse opacity based on time
      material.opacity = 0.3 + Math.sin(time * 2 + i) * 0.2
    })
  })

  if (settings.level === 'low') return null

  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={conn.points.length}
              array={new Float32Array(conn.points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={0xe63946}
            transparent
            opacity={0.85}
            linewidth={2}
          />
        </line>
      ))}
    </group>
  )
}

// Helper function
function latLonToPosition(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

export default TimelineVisualizer
