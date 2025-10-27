import { getTextStyles } from '../../styles'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

function LoadingSpinner({ size = 'md', className = '', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-red-500 ${sizeClasses[size]}`}
        style={{ borderColor: 'rgba(230, 57, 70, 0.3)', borderTopColor: '#e63946' }}
      />
      {text && (
        <p style={{
          ...getTextStyles('sm', 'normal', 'muted'),
          marginTop: '8px',
          textAlign: 'center'
        }}>
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner
