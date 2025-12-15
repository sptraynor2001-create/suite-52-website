/**
 * CameraController - Smooth camera movements
 * Supports cursor parallax, scroll-driven motion, and fly-through transitions
 */

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useQuality } from './AdaptiveQuality'

interface CameraControllerProps {
  enableParallax?: boolean
  parallaxIntensity?: number
  enableOrbit?: boolean
  enableZoom?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  minDistance?: number
  maxDistance?: number
  target?: [number, number, number]
}

export function CameraController({
  enableParallax = true,
  parallaxIntensity = 0.5,
  enableOrbit = false,
  enableZoom = false,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  minDistance = 2,
  maxDistance = 20,
  target = [0, 0, 0],
}: CameraControllerProps) {
  const { camera } = useThree()
  const { isMobile } = useQuality()
  const initialPosition = useRef(camera.position.clone())
  const targetPosition = useRef(new THREE.Vector3())
  const currentOffset = useRef(new THREE.Vector3())

  // Store initial camera position
  useEffect(() => {
    initialPosition.current.copy(camera.position)
  }, [camera])

  // Parallax effect - camera follows cursor slightly (constrained to stay near center)
  useFrame((state) => {
    if (!enableParallax || isMobile) return

    const mouse = state.pointer
    
    // Clamp mouse position to prevent extreme values (limit to ~70% of screen)
    const clampedX = Math.max(-0.7, Math.min(0.7, mouse.x))
    const clampedY = Math.max(-0.7, Math.min(0.7, mouse.y))
    
    // Calculate target offset based on clamped mouse position (reduced intensity)
    const reducedIntensity = parallaxIntensity * 0.6 // Make it more subtle
    targetPosition.current.set(
      clampedX * reducedIntensity,
      clampedY * reducedIntensity * 0.5,
      0
    )

    // Smoothly interpolate current offset (slower lerp for more subtle movement)
    currentOffset.current.lerp(targetPosition.current, 0.03)

    // Apply offset to camera
    camera.position.x = initialPosition.current.x + currentOffset.current.x
    camera.position.y = initialPosition.current.y + currentOffset.current.y
    camera.lookAt(target[0], target[1], target[2])
  })

  if (enableOrbit) {
    return (
      <OrbitControls
        enableZoom={enableZoom}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        minDistance={minDistance}
        maxDistance={maxDistance}
        target={new THREE.Vector3(...target)}
        enableDamping
        dampingFactor={0.05}
      />
    )
  }

  return null
}

// Scroll-driven camera movement
interface ScrollCameraProps {
  startPosition?: [number, number, number]
  endPosition?: [number, number, number]
  startTarget?: [number, number, number]
  endTarget?: [number, number, number]
}

export function ScrollCamera({
  startPosition = [0, 0, 10],
  endPosition = [0, 0, 3],
  startTarget = [0, 0, 0],
  endTarget = [0, 0, 0],
}: ScrollCameraProps) {
  const { camera } = useThree()
  const scrollProgress = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.current = Math.min(window.scrollY / maxScroll, 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    const t = scrollProgress.current

    // Interpolate camera position
    camera.position.x = THREE.MathUtils.lerp(startPosition[0], endPosition[0], t)
    camera.position.y = THREE.MathUtils.lerp(startPosition[1], endPosition[1], t)
    camera.position.z = THREE.MathUtils.lerp(startPosition[2], endPosition[2], t)

    // Interpolate look target
    const targetX = THREE.MathUtils.lerp(startTarget[0], endTarget[0], t)
    const targetY = THREE.MathUtils.lerp(startTarget[1], endTarget[1], t)
    const targetZ = THREE.MathUtils.lerp(startTarget[2], endTarget[2], t)
    
    camera.lookAt(targetX, targetY, targetZ)
  })

  return null
}

// Fly-through camera animation (for portal entrance)
interface FlyThroughCameraProps {
  active: boolean
  duration?: number
  startPosition?: [number, number, number]
  endPosition?: [number, number, number]
  onComplete?: () => void
}

export function FlyThroughCamera({
  active,
  duration = 2,
  startPosition = [0, 0, 5],
  endPosition = [0, 0, -10],
  onComplete,
}: FlyThroughCameraProps) {
  const { camera } = useThree()
  const startTime = useRef<number | null>(null)
  const hasCompleted = useRef(false)

  useEffect(() => {
    if (active) {
      startTime.current = null
      hasCompleted.current = false
    }
  }, [active])

  useFrame((state) => {
    if (!active || hasCompleted.current) return

    if (startTime.current === null) {
      startTime.current = state.clock.getElapsedTime()
      camera.position.set(...startPosition)
    }

    const elapsed = state.clock.getElapsedTime() - startTime.current
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-in-out cubic)
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    // Interpolate position
    camera.position.x = THREE.MathUtils.lerp(startPosition[0], endPosition[0], eased)
    camera.position.y = THREE.MathUtils.lerp(startPosition[1], endPosition[1], eased)
    camera.position.z = THREE.MathUtils.lerp(startPosition[2], endPosition[2], eased)

    // Look forward
    camera.lookAt(0, 0, endPosition[2] - 5)

    if (progress >= 1 && !hasCompleted.current) {
      hasCompleted.current = true
      onComplete?.()
    }
  })

  return null
}

export default CameraController

