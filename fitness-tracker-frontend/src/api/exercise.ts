import axios from "axios"
import { server } from "./api"

export const getAllExercises = async (limit: number, skip: number) => {
    try {
        const response = await server.get(`/exercises?limit=${limit}&skip=${skip}`)
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

export const getExercise = async (exerciseId: string) => {
    try {
        const response = await server.get(`/exercises/${exerciseId}`)
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

export const createExercise = async (data: { name: string, muscles_involved: string[] }) => {
    try {
        const response = await server.post('/exercises', data)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 400:
                    return { success: false, error: 'Invalid exercise data' }
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const updateExercise = async (exerciseId: string, data: { name?: string, muscles_involved?: string[] }) => {
    try {
        const response = await server.put(`/exercises/${exerciseId}`, data)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 404:
                    return { success: false, error: 'Exercise not found' }
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}

export const deleteExercise = async (exerciseId: string) => {
    try {
        const response = await server.delete(`/exercises/${exerciseId}`)
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 404:
                    return { success: false, error: 'Exercise not found' }
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}