export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

export function formatTime(timeString) {
  return timeString
}
