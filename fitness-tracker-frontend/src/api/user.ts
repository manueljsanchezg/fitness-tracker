import axios from "axios"
import { server } from "./api"

export const getMyProfile = async () => {
    try {
        const response = await server.get('/users/profile')
        return { success: true, data: response.data }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            switch (status) {
                case 401:
                    return { success: false, errorCode: 401, error: 'Unauthorized' }
                case 404:
                    return { success: false, errorCode: 404, error: 'User not found' }
                default:
                    return { success: false, error: 'Server error' }
            }
        }
        return { success: false, error: 'Unexpected error' }
    }
}
