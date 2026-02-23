import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 20000
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('struk_auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || 'Network error'
    err.userMessage = msg

    // Handle unauthorized
    if (err?.response?.status === 401) {
      localStorage.removeItem('struk_auth_token')
      localStorage.removeItem('struk_auth_user')
      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

export default api
