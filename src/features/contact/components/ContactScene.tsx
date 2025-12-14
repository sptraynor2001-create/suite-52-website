/**
 * ContactScene - 3D background for Contact page
 */

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { Fog, MinimalPostProcessing } from '@/shared/components/3d'
import { ParticleDataStream } from './ParticleDataStream'

interface ContactMethod {
  id: string
  label: string
  value: string
  type: 'email' | 'social'
}

interface ContactSceneProps {
  contactMethods?: ContactMethod[]
  hoveredContact?: string | null
}

function SceneContent({ contactMethods = [], hoveredContact = null }: ContactSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color={0xffffff} />
      <pointLight position={[-5, -5, 5]} intensity={0.2} color={0xe63946} />

      {/* Fog */}
      <Fog color="#000000" density={0.04} />

      {/* Particle Data Stream */}
      <ParticleDataStream contactMethods={contactMethods} hoveredContact={hoveredContact} />

      {/* Post processing */}
      <MinimalPostProcessing />
    </>
  )
}

export function ContactScene({ contactMethods = [], hoveredContact = null }: ContactSceneProps) {
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
        camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent contactMethods={contactMethods} hoveredContact={hoveredContact} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default ContactScene

