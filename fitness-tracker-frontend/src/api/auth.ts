import axios from "axios"
import type { LoginUser } from "../views/general/LoginView.vue"
import type { RegisterUser } from "../views/general/RegisterView.vue"
import { server } from "./api"

export const registerUser = async (data: RegisterUser) => {
    try {
        const response = await server.post('/auth/register', data)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 400:
                    return { success: false, error: 'This email is already in use' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const loginUser = async (data: LoginUser) => {
    try {
        const response = await server.post('/auth/login', data)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 404:
                    return { success: false, error: 'User not found' }
                case 403:
                    return { success: false, error: 'Wrong credentials' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const validateRequest = async (data?: { roles?: string[] }) => {
    try {
        await server.post('/auth/validate', data)
        return { success: true }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 401:
                    return { success: false, errorCode: 401, error: 'jwt invalid or expired' }
                case 403:
                    return { success: false, errorCode: 403, error: 'Invalid role' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const refreshToken = async () => {
    try {
        const response = await server.post('/auth/refresh-token')
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 401:
                    return { success: false, errorCode: 401, error: 'Invalid refresh token' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}