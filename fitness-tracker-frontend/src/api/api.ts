import axios from "axios"
import { router } from "../router"

export const server = axios.create({ 
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
 })

export type ApiResponse<T> = {
    success: boolean
    data?: T
    errorCode?: number
    error?: string
}

server.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 429) {
      router.push('/too-many-requests')
      return Promise.reject(new Error("Too many requests, espera a que pase el cooldown"))
    }
    return Promise.reject(error)
  }
)
