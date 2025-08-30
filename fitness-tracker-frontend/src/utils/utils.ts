import { refreshToken } from "../api/auth"
import { router } from "../router"

let refreshTimeout: ReturnType<typeof setTimeout> | null = null

export function scheduleTokenRefresh(expiresInSeconds: number) {
    if(refreshTimeout) clearTimeout(refreshTimeout)

    const refreshTime = (expiresInSeconds -10) * 1000

    refreshTimeout = setTimeout(async () => {
        try {
            const { success, error, data } = await refreshToken()
            if(!success && error) return router.push('/login')
            
            if (data?.expiresIn) scheduleTokenRefresh(data.expiresIn)
        } catch (error) {
            router.push('/login')
        }
    }, refreshTime)
}