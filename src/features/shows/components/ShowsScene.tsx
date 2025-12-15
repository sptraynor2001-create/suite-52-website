/**
 * ShowsScene - 3D globe background for Shows page
 */

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { useQuality, Fog, MinimalPostProcessing } from '@/shared/components/3d'
import { ParticleConstellationGlobe } from './ParticleConstellationGlobe'

// Event locations (approximate coordinates)
const eventLocations = [
  { name: 'NEW_YORK', lat: 40.7128, lon: -74.0060, date: '10_18_25' },
  { name: 'BROOKLYN', lat: 40.6782, lon: -73.9442, date: '11_01_25' },
  { name: 'BOSTON', lat: 42.3601, lon: -71.0589, date: '12_06_25' },
  { name: 'CDMX', lat: 19.4326, lon: -99.1332, date: '12_11_25' },
  { name: 'MADRID', lat: 40.4168, lon: -3.7038, date: '12_13_25' },
  { name: 'MARBELLA', lat: 36.5099, lon: -4.8860, date: '12_14_25' },
  { name: 'BARCELONA', lat: 41.3851, lon: 2.1734, date: '01_12_26' },
  { name: 'CASABLANCA', lat: 33.5731, lon: -7.5898, date: '01_19_26' },
  { name: 'LISBON', lat: 38.7223, lon: -9.1393, date: '01_21_26' },
  { name: 'DUBAI', lat: 25.2048, lon: 55.2708, date: '01_30_26' },
  { name: 'BEIRUT', lat: 33.8938, lon: 35.5018, date: '01_31_26' },
]

interface ShowsSceneProps {
}

function SceneContent({}: ShowsSceneProps) {
  const { settings } = useQuality()

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color={0xffffff} />
      <pointLight position={[-10, -10, 5]} intensity={0.2} color={0xe63946} />

      {/* Fog */}
      <Fog color="#000000" density={0.03} />

      {/* Particle Constellation Globe */}
      <ParticleConstellationGlobe 
        shows={eventLocations}
        radius={2.5}
      />

      {/* Post processing */}
      <MinimalPostProcessing />
    </>
  )
}

export function ShowsScene({}: ShowsSceneProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'default',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default ShowsScene

