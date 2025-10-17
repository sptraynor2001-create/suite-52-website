import { ReactNode } from 'react'
import { activeFont } from '@/design/fonts'

interface PageLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      padding: '60px 20px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '40px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '20px',
        }}>
          <h1 style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '42px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            fontFamily: activeFont.family,
            margin: 0,
            textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
          }}>
            {title}
          </h1>
          
          {subtitle && (
            <p style={{
              color: 'rgba(255, 255, 255, 0.35)',
              fontSize: '13px',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              margin: '8px 0 0 0',
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageLayout

