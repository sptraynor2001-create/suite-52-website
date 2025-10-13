import { useEffect } from 'react'
import { activeFont } from '@/design/fonts'

function Home() {
  useEffect(() => {
    console.log('🏠 Home page mounted')
    console.log('📱 Viewport:', {
      width: window.innerWidth,
      height: window.innerHeight
    })
    console.log('🔤 Active font:', activeFont.name)

    // Load Ubuntu Mono font
    const link = document.createElement('link')
    link.href = activeFont.googleFontsUrl
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    
    link.onload = () => {
      console.log('✅ Font loaded:', activeFont.name)
    }

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        width: '100%'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 
          style={{ 
            color: '#ffffff',
            fontSize: '96px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            fontFamily: activeFont.family,
            marginBottom: '24px',
            marginTop: 0
          }}
          onMouseEnter={() => console.log('🎵 Hovering Suite 52 title')}
        >
          Suite 52
        </h1>
        
        <p 
          style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '20px',
            letterSpacing: '0.05em',
            fontFamily: activeFont.family,
            margin: 0
          }}
        >
          Producer / DJ / Artist
        </p>
      </div>
    </div>
  )
}

export default Home
