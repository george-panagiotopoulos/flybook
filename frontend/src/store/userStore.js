import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Stubbed user data for demo
const DEMO_USERS = [
  {
    id: 'USR-001',
    email: 'demo@skybook.com',
    password: 'demo123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-555-123-4567'
  }
]

// Stubbed bookings
const DEMO_BOOKINGS = [
  {
    id: 'BK-ABC123',
    status: 'confirmed',
    createdAt: '2024-12-01T10:30:00Z',
    flight: {
      flight_number: 'AA100',
      airline_name: 'American Airlines',
      departure: { airport: 'JFK', city: 'New York', local_time: '08:30' },
      arrival: { airport: 'LHR', city: 'London', local_time: '20:45' },
      duration_minutes: 435
    },
    passengers: [{ firstName: 'John', lastName: 'Doe' }],
    pricing: { total: 705, currency: 'USD' }
  },
  {
    id: 'BK-XYZ789',
    status: 'completed',
    createdAt: '2024-11-15T14:20:00Z',
    flight: {
      flight_number: 'BA456',
      airline_name: 'British Airways',
      departure: { airport: 'LHR', city: 'London', local_time: '10:00' },
      arrival: { airport: 'CDG', city: 'Paris', local_time: '12:15' },
      duration_minutes: 75
    },
    passengers: [{ firstName: 'John', lastName: 'Doe' }],
    pricing: { total: 189, currency: 'USD' }
  }
]

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      bookings: [],

      login: (email, password) => {
        const user = DEMO_USERS.find(u => u.email === email && u.password === password)
        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            bookings: DEMO_BOOKINGS
          })
          return { success: true }
        }
        return { success: false, error: 'Invalid email or password' }
      },

      register: (userData) => {
        // In real app, would call API
        const newUser = {
          id: `USR-${Date.now()}`,
          ...userData
        }
        set({
          user: newUser,
          isAuthenticated: true,
          bookings: []
        })
        return { success: true }
      },

      logout: () => set({
        user: null,
        isAuthenticated: false,
        bookings: []
      }),

      updateProfile: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),

      addBooking: (booking) => set((state) => ({
        bookings: [booking, ...state.bookings]
      })),

      getBookingById: (id) => {
        const state = get()
        return state.bookings.find(b => b.id === id)
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        bookings: state.bookings
      })
    }
  )
)
