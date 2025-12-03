import { describe, it, expect, beforeEach } from 'vitest'
import { useBookingStore } from './bookingStore'

describe('bookingStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useBookingStore.getState().resetBooking()
  })

  it('selectFlight sets flight, fare class, and resets step to 1', () => {
    const mockFlight = {
      id: 'FL-123',
      fares: {
        economy_standard: { price: 550 }
      }
    }

    useBookingStore.getState().selectFlight(mockFlight, 'economy_standard')

    const state = useBookingStore.getState()
    expect(state.selectedFlight).toEqual(mockFlight)
    expect(state.fareClass).toBe('economy_standard')
    expect(state.currentStep).toBe(1)
  })

  it('calculatePricing computes correct total with extras and taxes', () => {
    const mockFlight = {
      id: 'FL-123',
      fares: {
        economy_standard: { price: 500 }
      }
    }

    const store = useBookingStore.getState()
    store.selectFlight(mockFlight, 'economy_standard')
    store.setPassengers([{ name: 'John' }, { name: 'Jane' }])
    store.setExtras({ insurance: true, priorityBoarding: false, extraBaggage: 0 })

    const pricing = store.calculatePricing()

    // Base: 500 * 2 = 1000
    // Insurance: 29 * 2 = 58
    // Taxes: 1000 * 0.12 = 120
    // Total: 1000 + 58 + 0 + 120 = 1178
    expect(pricing.baseTotal).toBe(1000)
    expect(pricing.extrasTotal).toBe(58)
    expect(pricing.taxes).toBe(120)
    expect(pricing.total).toBe(1178)
  })

  it('nextStep and prevStep respect bounds 1-5', () => {
    const store = useBookingStore.getState()

    // Start at step 1
    expect(store.currentStep).toBe(1)

    // Can't go below 1
    store.prevStep()
    expect(useBookingStore.getState().currentStep).toBe(1)

    // Can advance to 5
    store.nextStep() // 2
    store.nextStep() // 3
    store.nextStep() // 4
    store.nextStep() // 5
    expect(useBookingStore.getState().currentStep).toBe(5)

    // Can't go above 5
    store.nextStep()
    expect(useBookingStore.getState().currentStep).toBe(5)
  })

  it('resetBooking clears all booking state', () => {
    const mockFlight = { id: 'FL-123', fares: { economy_standard: { price: 500 } } }

    const store = useBookingStore.getState()
    store.selectFlight(mockFlight, 'economy_standard')
    store.setPassengers([{ name: 'John' }])
    store.nextStep()

    // Reset
    store.resetBooking()

    const state = useBookingStore.getState()
    expect(state.selectedFlight).toBeNull()
    expect(state.passengers).toEqual([])
    expect(state.currentStep).toBe(1)
  })
})
