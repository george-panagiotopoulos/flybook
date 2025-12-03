import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBookingStore = create(
  persist(
    (set, get) => ({
      // Selected flight
      selectedFlight: null,
      fareClass: 'economy_standard',

      // Booking data
      bookingId: null,
      passengers: [],
      seatAssignments: {},
      extras: {
        insurance: false,
        priorityBoarding: false,
        extraBaggage: 0,
        meals: []
      },
      contactInfo: {
        email: '',
        phone: ''
      },

      // Pricing
      pricing: null,

      // Current step (1-5)
      currentStep: 1,

      // Actions
      selectFlight: (flight, fareClass = 'economy_standard') => set({
        selectedFlight: flight,
        fareClass,
        currentStep: 1
      }),

      setPassengers: (passengers) => set({ passengers }),

      assignSeat: (passengerIndex, seat) => set((state) => ({
        seatAssignments: {
          ...state.seatAssignments,
          [passengerIndex]: seat
        }
      })),

      setExtras: (extras) => set((state) => ({
        extras: { ...state.extras, ...extras }
      })),

      setContactInfo: (info) => set((state) => ({
        contactInfo: { ...state.contactInfo, ...info }
      })),

      setBookingId: (bookingId) => set({ bookingId }),

      setPricing: (pricing) => set({ pricing }),

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),

      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      calculatePricing: () => {
        const state = get()
        if (!state.selectedFlight) return null

        const baseFare = state.selectedFlight.fares[state.fareClass]?.price || 0
        const passengerCount = state.passengers.length || 1
        const baseTotal = baseFare * passengerCount

        // Calculate extras
        let extrasTotal = 0
        if (state.extras.insurance) extrasTotal += 29 * passengerCount
        if (state.extras.priorityBoarding) extrasTotal += 15 * passengerCount
        extrasTotal += state.extras.extraBaggage * 35

        // Seat fees
        const seatFees = Object.values(state.seatAssignments).reduce((sum, seat) => {
          if (seat?.price) return sum + seat.price
          return sum
        }, 0)

        const taxes = Math.round(baseTotal * 0.12)
        const total = baseTotal + extrasTotal + seatFees + taxes

        const pricing = {
          baseFare,
          passengerCount,
          baseTotal,
          extrasTotal,
          seatFees,
          taxes,
          total,
          currency: 'USD'
        }

        set({ pricing })
        return pricing
      },

      resetBooking: () => set({
        selectedFlight: null,
        fareClass: 'economy_standard',
        bookingId: null,
        passengers: [],
        seatAssignments: {},
        extras: {
          insurance: false,
          priorityBoarding: false,
          extraBaggage: 0,
          meals: []
        },
        contactInfo: { email: '', phone: '' },
        pricing: null,
        currentStep: 1
      })
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        selectedFlight: state.selectedFlight,
        fareClass: state.fareClass,
        passengers: state.passengers,
        seatAssignments: state.seatAssignments,
        extras: state.extras,
        contactInfo: state.contactInfo,
        currentStep: state.currentStep
      })
    }
  )
)
