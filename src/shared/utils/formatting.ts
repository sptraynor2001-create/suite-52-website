/**
 * Formatting utilities
 */

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const month = d.getMonth() + 1 // getMonth() returns 0-11
  const day = d.getDate()
  const year = d.getFullYear()
  return `${month}/${day}/${year}`
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}
