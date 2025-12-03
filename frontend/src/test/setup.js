import '@testing-library/jest-dom'

// Reset zustand stores between tests
beforeEach(() => {
  // Clear localStorage to reset persisted stores
  localStorage.clear()
})
