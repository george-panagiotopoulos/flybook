import { create } from 'zustand'

export const useSearchStore = create((set) => ({
  origin: null,
  destination: null,
  departureDate: null,
  returnDate: null,
  passengers: { adults: 1, children: 0, infants: 0 },
  cabinClass: 'economy',
  tripType: 'roundtrip',
  results: null,
  loading: false,
  error: null,

  setSearchParams: (params) => set((state) => ({ ...state, ...params })),

  setResults: (results) => set({ results, loading: false, error: null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  swapAirports: () => set((state) => ({
    origin: state.destination,
    destination: state.origin
  })),

  clearSearch: () => set({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    results: null,
    error: null
  })
}))
