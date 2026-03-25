type NetworkState = {
    isConnected: boolean | null
    isInternetReachable?: boolean | null
}

type NetworkStateListener = (state: NetworkState) => void

export type NetworkStateSubscription = {
    remove: () => void
}

const listeners = new Set<NetworkStateListener>()

let currentState: NetworkState = {
    isConnected: true,
    isInternetReachable: true,
}

export const NetworkStateType = {
    UNKNOWN: 'UNKNOWN',
    NONE: 'NONE',
    WIFI: 'WIFI',
    CELLULAR: 'CELLULAR',
} as const

export const getNetworkStateAsync = async (): Promise<NetworkState> => ({
    ...currentState,
})

export const addNetworkStateListener = (
    listener: NetworkStateListener
): NetworkStateSubscription => {
    listeners.add(listener)
    return {
        remove: () => listeners.delete(listener),
    }
}

/**
 * Testing helpers so suites can control connectivity without touching global mocks.
 */
export const __setNetworkStateForTests = (next: NetworkState) => {
    currentState = { ...next }
    listeners.forEach((listener) => listener({ ...currentState }))
}

export const __resetNetworkStateForTests = () => {
    listeners.clear()
    currentState = {
        isConnected: true,
        isInternetReachable: true,
    }
}
