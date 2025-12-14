/**
 * AboutScene - 3D background scene for the About page
 */

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { useQuality, Fog, MinimalPostProcessing } from '@/shared/components/3d'
import { QuantumField } from './QuantumField'

interface AboutSceneProps {
  visibleSections?: number
  hoveredSection?: number | null
}

function SceneContent({ visibleSections = 0, hoveredSection = null }: AboutSceneProps) {
  const { settings } = useQuality()

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 10, 5]} intensity={0.3} color={0xffffff} />
      <pointLight position={[-5, 5, 0]} intensity={0.2} color={0xe63946} />

      {/* Atmospheric fog */}
      <Fog color="#000000" density={0.03} />

      {/* Quantum Field Visualization */}
      <QuantumField 
        visibleSections={visibleSections}
        hoveredSection={hoveredSection}
        sectionCount={4}
      />

      {/* Post processing */}
      <MinimalPostProcessing />
    </>
  )
}

export function AboutScene({ visibleSections = 0, hoveredSection = null }: AboutSceneProps) {
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
        camera={{ position: [0, 2, 8], fov: 60, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent visibleSections={visibleSections} hoveredSection={hoveredSection} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default AboutScene

