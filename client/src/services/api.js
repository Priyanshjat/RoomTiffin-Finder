import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api',
})

// Add Bearer token to request headers
API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  } catch (e) {
    localStorage.removeItem('user')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor to auto-purge stale/invalid tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const msg = (error.response.data?.message || '').toLowerCase()
      if (
        msg.includes('signature') ||
        msg.includes('expired') ||
        msg.includes('malformed') ||
        msg.includes('invalid user') ||
        msg.includes('invalid token')
      ) {
        localStorage.removeItem('user')
      }
    }
    return Promise.reject(error)
  }
)

export default API

