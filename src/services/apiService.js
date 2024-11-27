import { isTokenExpired } from '@/utils/jwt' // Import the utility function
import axios from 'axios'

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 10000,
    })

    this.api.interceptors.request.use(this.addAuthHeader, (error) => Promise.reject(error))

    this.api.interceptors.response.use(this.handleResponse, this.handleError)
  }

  // Add the JWT token to headers for authenticated requests
  addAuthHeader(config) {
    const token = localStorage.getItem('jwt')
    if (token && !isTokenExpired(token)) {
      // If token exists and is not expired, add it to headers
      config.headers['Authorization'] = `Bearer ${token}`
    } else {
      // If token is expired or not present, remove it and redirect
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      // Redirect to login page if no valid token
      if (!config.url.includes('login')) {
        window.location.href = '/login'
      }
    }
    return config
  }

  // Handle the API response
  handleResponse(response) {
    return response.data // Adjust this as needed
  }

  // Handle API errors
  handleError(error) {
    if (error.response && error.response.status === 401) {
      // Handle expired token
      localStorage.removeItem('jwt')
      window.location.href = '/login' // Redirect to login page
    }
    return Promise.reject(error.response ? error.response : error)
  }

  async get(url) {
    return this.api.get(url)
  }

  async post(url, data) {
    return this.api.post(url, data)
  }

  async put(url, data) {
    return this.api.put(url, data)
  }

  async delete(url) {
    return this.api.delete(url)
  }
}

export default new ApiService()
