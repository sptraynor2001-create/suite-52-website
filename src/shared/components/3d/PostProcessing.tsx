/**
 * PostProcessing - Visual effects for 3D scenes
 * Bloom, chromatic aberration, vignette, and other effects
 */

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import { useQuality } from './AdaptiveQuality'

interface PostProcessingProps {
  bloom?: boolean
  bloomIntensity?: number
  bloomThreshold?: number
  chromaticAberration?: boolean
  aberrationOffset?: number
  vignette?: boolean
  vignetteIntensity?: number
  noise?: boolean
  noiseIntensity?: number
}

export function PostProcessing({
  bloom = true,
  bloomIntensity = 1.5,
  bloomThreshold = 0.8,
  chromaticAberration = false,
  aberrationOffset = 0.002,
  vignette = true,
  vignetteIntensity = 0.4,
  noise = false,
  noiseIntensity = 0.1,
}: PostProcessingProps) {
  const { settings } = useQuality()

  // Skip post processing if quality doesn't support it
  if (!settings.postProcessing) {
    return null
  }

  return (
    <EffectComposer multisampling={settings.antialias ? 8 : 0}>
      {/* Bloom - red glow effect */}
      {bloom && settings.bloom && (
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.9}
          kernelSize={settings.level === 'high' ? KernelSize.LARGE : KernelSize.MEDIUM}
          mipmapBlur
        />
      )}

      {/* Chromatic Aberration - subtle color fringing */}
      {chromaticAberration && settings.chromaticAberration && (
        <ChromaticAberration
          offset={new THREE.Vector2(aberrationOffset, aberrationOffset)}
          radialModulation={true}
          modulationOffset={0.3}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Vignette - darkened edges */}
      {vignette && (
        <Vignette
          offset={0.3}
          darkness={vignetteIntensity}
          blendFunction={BlendFunction.NORMAL}
        />
      )}

      {/* Film grain/noise */}
      {noise && (
        <Noise
          premultiply
          blendFunction={BlendFunction.ADD}
          opacity={noiseIntensity}
        />
      )}
    </EffectComposer>
  )
}

// Specialized post processing for portal scene
export function PortalPostProcessing() {
  const { settings } = useQuality()

  if (!settings.postProcessing) {
    return null
  }

  return (
    <EffectComposer>
      <Bloom
        intensity={2}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />
      {settings.chromaticAberration && (
        <ChromaticAberration
          offset={new THREE.Vector2(0.003, 0.003)}
          radialModulation={true}
          modulationOffset={0.5}
        />
      )}
      <Vignette
        offset={0.2}
        darkness={0.5}
      />
    </EffectComposer>
  )
}

// Minimal post processing for performance-critical scenes
export function MinimalPostProcessing() {
  const { settings } = useQuality()

  if (!settings.postProcessing || !settings.bloom) {
    return null
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
        kernelSize={KernelSize.SMALL}
      />
    </EffectComposer>
  )
}

export default PostProcessing

