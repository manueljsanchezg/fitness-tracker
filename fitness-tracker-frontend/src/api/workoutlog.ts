
import axios from "axios"
import { server } from "./api"
import type { WorkoutLog } from "../views/user/WorkOutLogsCreateView.vue"

export const getMyWorkOutLogs = async (limit: number, skip: number) => {
    try {
        const response = await server.get(`/workoutlogs?limit=${limit}&skip=${skip}`)
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

export const getWorkoutlog = async (workOutLogId: string) => {
    try {
        const response = await server.get(`/workoutlogs/${workOutLogId}`)
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

export const createWorkoutLog = async (data: WorkoutLog) => {
    try {
        const response = await server.post('/workoutlogs', data)
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

export const updateWorkoutlog = async (workOutLogId: string, data: WorkoutLog) => {
    try {
        const response = await server.put(`/workoutlogs/${workOutLogId}`, data)
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

export const deleteWorkoutlog = async (workOutLogId: string) => {
    try {
        const response = await server.delete(`/workoutlogs/${workOutLogId}`)
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