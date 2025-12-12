/**
 * LiveSetsScene - 3D background for Live Sets page
 */

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { useQuality, Fog, MinimalPostProcessing } from '@/shared/components/3d'
import { FloatingPortals, PortalAmbientParticles } from './MediaPortals'

function SceneContent() {
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

      {/* Floating portal rings */}
      <FloatingPortals count={6} />

      {/* Ambient particles */}
      {settings.level !== 'low' && <PortalAmbientParticles count={250} />}

      {/* Post processing */}
      <MinimalPostProcessing />
    </>
  )
}

export function LiveSetsScene() {
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
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default LiveSetsScene

