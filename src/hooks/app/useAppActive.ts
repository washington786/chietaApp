import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

/**
 * Returns true while the app is in the foreground (state === 'active').
 * Automatically updates when the app enters or leaves the background.
 * Use this to pause/resume polling or side-effects that should only run when visible.
 */
export function useAppActive(): boolean {
    const [isActive, setIsActive] = useState<boolean>(AppState.currentState === 'active')

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (next: AppStateStatus) => {
            setIsActive(next === 'active')
        })
        return () => subscription.remove()
    }, [])

    return isActive
}
