import axios from "axios"

export const server = axios.create({ 
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true
 })

export type ApiResponse<T> = {
    success: boolean
    data?: T
    errorCode?: number
    error?: string
}

