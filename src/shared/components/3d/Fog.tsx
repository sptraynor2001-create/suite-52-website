/**
 * Fog - Atmospheric depth effects
 * Creates depth and atmosphere in 3D scenes
 */

import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import { useQuality } from './AdaptiveQuality'

interface FogProps {
  color?: string | number
  near?: number
  far?: number
  density?: number
  type?: 'linear' | 'exponential'
}

export function Fog({
  color = '#000000',
  near = 5,
  far = 30,
  density = 0.015,
  type = 'exponential',
}: FogProps) {
  const { scene } = useThree()
  const { settings } = useQuality()

  useEffect(() => {
    // Adjust fog density based on quality settings
    const adjustedDensity = density * (settings.fogDensity / 0.015)

    if (type === 'linear') {
      scene.fog = new THREE.Fog(color as THREE.ColorRepresentation, near, far)
    } else {
      scene.fog = new THREE.FogExp2(color as THREE.ColorRepresentation, adjustedDensity)
    }

    return () => {
      scene.fog = null
    }
  }, [scene, color, near, far, density, type, settings.fogDensity])

  return null
}

// Animated fog that pulses in density
interface AnimatedFogProps extends FogProps {
  pulseSpeed?: number
  pulseAmount?: number
}

export function AnimatedFog({
  color = '#000000',
  density = 0.015,
  pulseSpeed = 0.5,
  pulseAmount = 0.005,
}: AnimatedFogProps) {
  const { scene } = useThree()
  const { settings } = useQuality()

  useEffect(() => {
    const baseDensity = density * (settings.fogDensity / 0.015)
    const fog = new THREE.FogExp2(color as THREE.ColorRepresentation, baseDensity)
    scene.fog = fog

    let animationId: number

    const animate = () => {
      const time = Date.now() * 0.001 * pulseSpeed
      fog.density = baseDensity + Math.sin(time) * pulseAmount
      animationId = requestAnimationFrame(animate)
    }

    // Only animate on high quality
    if (settings.level === 'high') {
      animate()
    }

    return () => {
      cancelAnimationFrame(animationId)
      scene.fog = null
    }
  }, [scene, color, density, pulseSpeed, pulseAmount, settings])

  return null
}

// Gradient fog (simulated with multiple fog layers)
export function GradientFog({
  topColor = '#0a0a0a',
  bottomColor = '#000000',
  height = 10,
}: {
  topColor?: string
  bottomColor?: string
  height?: number
}) {
  const { scene } = useThree()

  useEffect(() => {
    // Create a gradient background
    const topColorThree = new THREE.Color(topColor)
    const bottomColorThree = new THREE.Color(bottomColor)

    // Set scene background to bottom color
    scene.background = bottomColorThree

    // Add fog for depth
    scene.fog = new THREE.FogExp2(bottomColor, 0.02)

    return () => {
      scene.background = null
      scene.fog = null
    }
  }, [scene, topColor, bottomColor, height])

  return null
}

export default Fog

