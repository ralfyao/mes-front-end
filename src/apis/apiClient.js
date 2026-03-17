import axios from 'axios'
import { Constant } from '@/composables/Constant'

const apiClient = axios.create({
  timeout: 30000
})

apiClient.interceptors.request.use((config) => {
  const constant = Constant()
  if (!config.baseURL) {
    config.baseURL = constant.APIUrl
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central place for future error handling or logging
    return Promise.reject(error)
  }
)

export default apiClient
