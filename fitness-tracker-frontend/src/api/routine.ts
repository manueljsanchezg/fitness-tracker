
import axios from "axios"
import { server } from "./api"
import type { Routine } from "../views/user/RoutinesCreateView.vue"

export const getAllRoutines = async (limit: number, skip: number) => {
    try {
        const response = await server.get(`/routines?limit=${limit}&skip=${skip}`)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const getRoutine = async (routineId: string) => {
    try {
        const response = await server.get(`/routines/${routineId}`)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                case 404:
                    return { success: false, errorCode: 404, error: 'Not found' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const createRoutine = async (data: Routine) => {
    try {
        const response = await server.post('/routines', data)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 400:
                    return { success: false, error: 'Invalid routine data' }
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const updateRoutine = async (routineId: string, data: Routine) => {
    try {
        const response = await server.put(`/routines/${routineId}`, data)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 404:
                    return { success: false, error: 'routine not found' }
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const deleteRoutine = async (routineId: string) => {
    try {
        const response = await server.delete(`/routines/${routineId}`)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 404:
                    return { success: false, error: 'routine not found' }
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}