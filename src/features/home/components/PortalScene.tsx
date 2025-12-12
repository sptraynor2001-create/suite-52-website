/**
 * PortalScene - Whirlpool particle scene for the home page
 * Swirling particles that spiral inward and outward
 */

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { 
  QualityProvider, 
  useQuality,
  CameraController,
  Fog,
  PostProcessing,
} from '@/shared/components/3d'
import { 
  WhirlpoolParticles, 
  AccentParticles,
  BlueAccentParticles,
  GreenAccentParticles,
  YellowAccentParticles,
} from './HomeParticles'

interface PortalSceneProps {
  onEnter?: () => void
  mouseX?: number
  mouseY?: number
}

function SceneContent({ mouseX = 0, mouseY = 0 }: PortalSceneProps) {
  const { settings } = useQuality()

  return (
    <>
      {/* Soft lighting */}
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 0, 10]} intensity={0.2} color={0xffffff} />

      {/* Camera controller with subtle parallax */}
      <CameraController 
        enableParallax={!settings.isMobile} 
        parallaxIntensity={0.1} 
      />

      {/* Atmospheric fog */}
      <Fog color="#000000" density={0.025} />

      {/* Whirlpool particles */}
      <WhirlpoolParticles mouseX={mouseX} mouseY={mouseY} />
      
      {/* Subtle red accent particles */}
      <AccentParticles mouseX={mouseX} mouseY={mouseY} />
      
      {/* Blue accent particles */}
      <BlueAccentParticles mouseX={mouseX} mouseY={mouseY} />
      
      {/* Green accent particles */}
      <GreenAccentParticles mouseX={mouseX} mouseY={mouseY} />
      
      {/* Yellow accent particles */}
      <YellowAccentParticles mouseX={mouseX} mouseY={mouseY} />

      {/* Subtle post processing */}
      <PostProcessing
        bloom
        bloomIntensity={0.6}
        bloomThreshold={0.7}
        chromaticAberration={false}
        vignette
        vignetteIntensity={0.3}
      />
    </>
  )
}

export function PortalScene({ onEnter, mouseX = 0, mouseY = 0 }: PortalSceneProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2,
        opacity: 0,
        animation: 'fadeIn 1.5s ease-in forwards',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
      <QualityProvider>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.8,
          }}
          camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 100 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <SceneContent onEnter={onEnter} mouseX={mouseX} mouseY={mouseY} />
            <Preload all />
          </Suspense>
        </Canvas>
      </QualityProvider>
    </div>
  )
}

export default PortalScene
