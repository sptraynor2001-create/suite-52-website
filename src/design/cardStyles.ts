// Shared card styling constants for consistent UI across the app

export const cardStyles = {
  // Base card styles
  base: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  
  // Hover state
  hover: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateX(4px)',
  },
  
  // Padding options
  padding: {
    default: '16px 20px',
    compact: '12px 16px',
    spacious: '20px 24px',
  },
  
  // Margin/spacing
  margin: {
    bottom: '20px',
    gap: '20px',
  },
}

export const cardColors = {
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    hover: 'rgba(255, 255, 255, 0.2)',
  },
  background: {
    default: 'rgba(255, 255, 255, 0.02)',
    hover: 'rgba(255, 255, 255, 0.05)',
    subtle: 'rgba(255, 255, 255, 0.05)',
  },
}

