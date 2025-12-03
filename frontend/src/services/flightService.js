import api from './api'

export const flightService = {
  search: async (params) => {
    const response = await api.get('/flights/search', { params })
    return response.data
  },

  getDetails: async (flightId) => {
    const response = await api.get(`/flights/${flightId}`)
    return response.data
  },

  getCalendarPrices: async (origin, destination, month) => {
    const response = await api.get('/flights/calendar', {
      params: { origin, destination, month }
    })
    return response.data
  }
}
