import { useEffect } from 'react'
import UseAuth from './UseAuth'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

/**
 * Initialize user session on app startup
 * Restores user session from secure storage if available
 * and token hasn't expired
 */
const useInitializeSession = () => {
    const { restoreUserSession } = UseAuth()
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

    useEffect(() => {
        // Only restore if not already authenticated
        if (!isAuthenticated) {
            restoreUserSession()
        }
    }, [])

    return {
        isInitialized: true,
    }
}

export default useInitializeSession
