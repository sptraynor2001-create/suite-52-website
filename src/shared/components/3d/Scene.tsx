/**
 * Scene - R3F Canvas wrapper with adaptive quality
 * Provides a consistent 3D scene setup with quality-aware configuration
 */

import { Suspense, ReactNode } from 'react'
import { Canvas, CanvasProps } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { useQuality } from './AdaptiveQuality'

interface SceneProps extends Omit<CanvasProps, 'children'> {
  children: ReactNode
  className?: string
  interactive?: boolean
  fallback?: ReactNode
}

// Loading placeholder - invisible, just fades in naturally
function SceneLoader() {
  return null
}

export function Scene({ 
  children, 
  className = '', 
  interactive = false,
  fallback,
  ...props 
}: SceneProps) {
  const { settings, isLoading } = useQuality()

  if (isLoading) {
    return fallback || <SceneLoader />
  }

  return (
    <div 
      className={`canvas-container ${interactive ? 'interactive' : ''} ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      <Canvas
        dpr={settings.pixelRatio}
        gl={{
          antialias: settings.antialias,
          alpha: true,
          powerPreference: settings.level === 'high' ? 'high-performance' : 'default',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
        style={{ background: 'transparent' }}
        {...props}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Standalone scene without quality provider (for simple use cases)
export function SimpleScene({ children, className = '', interactive = false, ...props }: SceneProps) {
  return (
    <div 
      className={`canvas-container ${interactive ? 'interactive' : ''} ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'default',
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        {...props}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Scene

