import { useEffect, useState, useRef } from 'react'

interface BouncingSquareProps {
  initialX?: number
  initialY?: number
  velocityX?: number
  velocityY?: number
  sizePercent?: number // Percentage of smaller viewport dimension (0.7 = 70%)
}

function BouncingSquare({ 
  initialX = 100, 
  initialY = 100, 
  velocityX = 0.25, 
  velocityY = 0.2,
  sizePercent = 0.8
}: BouncingSquareProps) {
  const [squareSize, setSquareSize] = useState(120)
  const [opacity, setOpacity] = useState(0) // Start at 0%, slowly increment to 1%
  const [position, setPosition] = useState(() => {
    // Calculate initial valid bounds
    const maxX = Math.max(0, window.innerWidth - squareSize)
    const maxY = Math.max(0, window.innerHeight - squareSize)
    return {
      x: Math.max(0, Math.min(maxX, initialX)),
      y: Math.max(0, Math.min(maxY, initialY))
    }
  })
  const velocityRef = useRef({ x: velocityX, y: velocityY }) // Constant velocity (pixels per frame)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Update square size based on smaller viewport dimension
    const updateSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Use specified percentage of the smaller dimension
      const smallerDimension = Math.min(width, height)
      const size = Math.round(smallerDimension * sizePercent)
      
      setSquareSize(size)
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [sizePercent])

  // Clamp position when square size changes
  useEffect(() => {
    setPosition(prev => {
      const maxX = Math.max(0, window.innerWidth - squareSize)
      const maxY = Math.max(0, window.innerHeight - squareSize)
      return {
        x: Math.max(0, Math.min(maxX, prev.x)),
        y: Math.max(0, Math.min(maxY, prev.y))
      }
    })
  }, [squareSize])

  // Wait for background to load (3s), then EXTREMELY slowly increment opacity by 0.0000001 each frame until it reaches 1%
  useEffect(() => {
    let animationId: number | undefined
    let timeoutId: NodeJS.Timeout
    
    const animateOpacity = () => {
      setOpacity(prev => {
        const newOpacity = prev + 0.0000001
        const capped = Math.min(newOpacity, 0.01)
        
        // Only continue animation if we haven't reached the target
        if (capped < 0.01) {
          animationId = requestAnimationFrame(animateOpacity)
        }
        
        return capped
      })
    }
    
    // Delay start until after background image loads (3 seconds)
    timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animateOpacity)
    }, 3000)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
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
  }, [squareSize])

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        backgroundColor: '#ffffff',
        opacity: opacity,
        pointerEvents: 'none',
        zIndex: 2,
        transition: 'width 0.3s ease-out, height 0.3s ease-out',
      }}
    />
  )
}

export default BouncingSquare

