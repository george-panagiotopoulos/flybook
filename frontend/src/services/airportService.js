import api from './api'

export const airportService = {
  search: async (query) => {
    const response = await api.get('/airports/search', { params: { q: query } })
    return response.data
  },

  getAll: async () => {
    const response = await api.get('/airports')
    return response.data
  }
}
