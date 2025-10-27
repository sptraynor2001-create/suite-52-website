import { getTextStyles, getButtonStyles } from '../../styles'

interface ErrorFallbackProps {
  error?: Error | string
  onRetry?: () => void
  className?: string
}

function ErrorFallback({ error, onRetry, className = '' }: ErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : error || 'Something went wrong'

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 style={getTextStyles('xl', 'bold', 'primary')} className="mb-2">
          Oops! Something went wrong
        </h3>
        <p style={getTextStyles('base', 'normal', 'muted')} className="mb-6 max-w-md">
          {errorMessage}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          style={getButtonStyles('secondary', 'md')}
          className="px-4 py-2"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorFallback
