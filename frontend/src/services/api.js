import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:2345/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export default api
