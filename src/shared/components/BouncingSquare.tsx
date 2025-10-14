import { useEffect, useState, useRef } from 'react'

interface BouncingSquareProps {
  initialX?: number
  initialY?: number
  velocityX?: number
  velocityY?: number
  opacity?: number
}

function BouncingSquare({ 
  initialX = 100, 
  initialY = 100, 
  velocityX = 0.25, 
  velocityY = 0.2,
  opacity = 0.015
}: BouncingSquareProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const [squareSize, setSquareSize] = useState(120)
  const velocityRef = useRef({ x: velocityX, y: velocityY }) // Constant velocity (pixels per frame)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Update square size based on viewport width - scale continuously
    const updateSize = () => {
      const width = window.innerWidth
      // Scale from 120px at 1920px width down to 40px at 375px (mobile)
      // Using linear interpolation
      const minSize = 40
      const maxSize = 120
      const minWidth = 375
      const maxWidth = 1920
      
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width))
      const scale = (clampedWidth - minWidth) / (maxWidth - minWidth)
      const size = minSize + (maxSize - minSize) * scale
      
      setSquareSize(Math.round(size))
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      setPosition(prev => {
        const newX = prev.x + velocityRef.current.x
        const newY = prev.y + velocityRef.current.y

        // Get viewport dimensions
        const maxX = window.innerWidth - squareSize
        const maxY = window.innerHeight - squareSize

        // Check boundaries and reflect
        if (newX <= 0 || newX >= maxX) {
          velocityRef.current.x *= -1 // Reverse horizontal direction
        }
        if (newY <= 0 || newY >= maxY) {
          velocityRef.current.y *= -1 // Reverse vertical direction
        }

        // Clamp position to boundaries
        return {
          x: Math.max(0, Math.min(maxX, newX)),
          y: Math.max(0, Math.min(maxY, newY))
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        backgroundColor: '#000000',
        opacity: opacity,
        pointerEvents: 'none',
        zIndex: 2,
        transition: 'none',
      }}
    />
  )
}

export default BouncingSquare

