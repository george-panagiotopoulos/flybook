import { describe, it, expect } from 'vitest'
import { formatDuration, formatPrice, formatDate } from './formatters'

describe('formatDuration', () => {
  it('converts minutes to hours and minutes format', () => {
    expect(formatDuration(435)).toBe('7h 15m')
    expect(formatDuration(60)).toBe('1h 0m')
    expect(formatDuration(90)).toBe('1h 30m')
    expect(formatDuration(0)).toBe('0h 0m')
  })
})

describe('formatPrice', () => {
  it('formats price with currency symbol', () => {
    expect(formatPrice(450)).toBe('$450')
    expect(formatPrice(0)).toBe('$0')
    expect(formatPrice(1234)).toBe('$1,234')
  })
})

describe('formatDate', () => {
  it('formats date to readable string', () => {
    const date = new Date('2024-12-15')
    const formatted = formatDate(date)
    expect(formatted).toContain('Dec')
    expect(formatted).toContain('15')
  })
})
