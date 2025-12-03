import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from './userStore'

describe('userStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useUserStore.getState().logout()
  })

  it('login succeeds with demo credentials', () => {
    const result = useUserStore.getState().login('demo@skybook.com', 'demo123')

    expect(result.success).toBe(true)

    const state = useUserStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toBeDefined()
    expect(state.user.email).toBe('demo@skybook.com')
    expect(state.user.firstName).toBe('John')
  })

  it('login fails with wrong credentials', () => {
    const result = useUserStore.getState().login('wrong@email.com', 'wrongpass')

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()

    const state = useUserStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })

  it('logout clears authentication state', () => {
    // First login
    useUserStore.getState().login('demo@skybook.com', 'demo123')
    expect(useUserStore.getState().isAuthenticated).toBe(true)

    // Then logout
    useUserStore.getState().logout()

    const state = useUserStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.bookings).toEqual([])
  })
})
