/**
 * LiveSetsScene - 3D background for Live Sets page
 */

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { useQuality, Fog, MinimalPostProcessing } from '@/shared/components/3d'
import { SoundWaveInterference } from './SoundWaveInterference'

interface LiveSet {
  id: string
  title: string
  date?: string
  venue?: string
  city?: string
  duration?: string
  thumbnail?: string
  youtubeUrl?: string
  soundcloudUrl?: string
  mixcloudUrl?: string
  spotifyUrl?: string
  description?: string
  setlist?: string[]
  type?: string
  embedUrl?: string
}

interface LiveSetsSceneProps {
  liveSets?: LiveSet[]
  hoveredSetId?: string | null
}

function SceneContent({ liveSets = [], hoveredSetId = null }: LiveSetsSceneProps) {
  const { settings } = useQuality()

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 5, 5]} intensity={0.3} color={0xffffff} />
      <pointLight position={[5, 0, 0]} intensity={0.2} color={0xe63946} />
      <pointLight position={[-5, 0, 0]} intensity={0.15} color={0xff6b6b} />

      {/* Fog */}
      <Fog color="#000000" density={0.03} />

      {/* Sound Wave Interference */}
      <SoundWaveInterference liveSets={liveSets} hoveredSetId={hoveredSetId} />

      {/* Post processing */}
      <MinimalPostProcessing />
    </>
  )
}

export function LiveSetsScene({ liveSets = [], hoveredSetId = null }: LiveSetsSceneProps) {
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
        zIndex: 0,
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
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent liveSets={liveSets} hoveredSetId={hoveredSetId} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default LiveSetsScene

