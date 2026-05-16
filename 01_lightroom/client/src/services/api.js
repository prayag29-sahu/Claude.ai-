import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('lr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || 'Something went wrong'
    if (err.response?.status === 401) {
      localStorage.removeItem('lr_user')
      localStorage.removeItem('lr_token')
    }
    if (err.response?.status !== 401 && err.response?.status !== 404) {
      toast.error(msg)
    }
    return Promise.reject(err)
  }
)

export default api
