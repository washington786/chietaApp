import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Network from 'expo-network'
import { logger } from '@/utils/logger'

const STORAGE_KEY = '@chieta/offline-queue/v1'
const MAX_ATTEMPTS = 5

type OfflineRequestType = 'notification'

export interface OfflineRequest {
    id: string
    type: OfflineRequestType
    payload: Record<string, any>
    attempts: number
    createdAt: number
}

type OfflineExecutor = (request: OfflineRequest) => Promise<void>

const executors = new Map<OfflineRequestType, OfflineExecutor>()
let isOnline = true
let initialized = false
let flushInFlight: Promise<void> | null = null
let networkSubscription: ReturnType<typeof Network.addNetworkStateListener> | null = null

const readQueue = async (): Promise<OfflineRequest[]> => {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEY)
        if (!value) {
            return []
        }
        return JSON.parse(value) as OfflineRequest[]
    } catch (error) {
        logger.error('Failed to read offline queue', error as Error)
        return []
    }
}

const writeQueue = async (queue: OfflineRequest[]) => {
    try {
        if (queue.length === 0) {
            await AsyncStorage.removeItem(STORAGE_KEY)
            return
        }
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
    } catch (error) {
        logger.error('Failed to persist offline queue', error as Error, {
            size: queue.length,
        })
    }
}

const delay = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms)
    })

const shouldRetry = (attempt: number) => attempt < MAX_ATTEMPTS

export const registerOfflineHandler = (
    type: OfflineRequestType,
    handler: OfflineExecutor
) => {
    executors.set(type, handler)
}

export const setupOfflineQueue = async () => {
    if (initialized) {
        return
    }

    initialized = true
    const status = await Network.getNetworkStateAsync()
    isOnline = Boolean(status.isConnected)

    networkSubscription = Network.addNetworkStateListener((state) => {
        const nextOnline = Boolean(state.isConnected)
        if (!isOnline && nextOnline) {
            flushOfflineQueue()
        }
        isOnline = nextOnline
    })

    if (isOnline) {
        flushOfflineQueue()
    }
}

export const teardownOfflineQueue = () => {
    networkSubscription?.remove()
    networkSubscription = null
    initialized = false
}

export const enqueueOfflineRequest = async (
    type: OfflineRequestType,
    payload: Record<string, any>
) => {
    const queue = await readQueue()
    const request: OfflineRequest = {
        id: `${type}-${Date.now()}`,
        type,
        payload,
        attempts: 0,
        createdAt: Date.now(),
    }
    queue.push(request)
    await writeQueue(queue)
    logger.warn('Queued request for offline replay', {
        type,
        queueLength: queue.length,
    })

    if (isOnline) {
        flushOfflineQueue()
    }
}

export const flushOfflineQueue = async () => {
    if (flushInFlight) {
        return flushInFlight
    }

    flushInFlight = (async () => {
        let queue = await readQueue()
        if (!queue.length) {
            flushInFlight = null
            return
        }

        const remaining: OfflineRequest[] = []

        for (const request of queue) {
            const executor = executors.get(request.type)

            if (!executor) {
                logger.warn('No executor registered for offline request', {
                    type: request.type,
                })
                remaining.push(request)
                continue
            }

            try {
                await executor(request)
                logger.info('Replayed offline request', {
                    id: request.id,
                    type: request.type,
                })
            } catch (error) {
                const nextAttempt = request.attempts + 1
                if (shouldRetry(nextAttempt)) {
                    logger.warn('Retrying offline request later', {
                        id: request.id,
                        attempts: nextAttempt,
                    })
                    remaining.push({ ...request, attempts: nextAttempt })
                    await delay(Math.min(2000 * nextAttempt, 10000))
                } else {
                    logger.error('Dropping offline request after max attempts', error, {
                        id: request.id,
                        type: request.type,
                    })
                }
            }
        }

        await writeQueue(remaining)
        flushInFlight = null
    })()

    return flushInFlight
}

/**
 * Testing utilities
 */
export const __dangerouslyResetOfflineQueueForTests = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY)
    executors.clear()
    isOnline = true
    initialized = false
    flushInFlight = null
    networkSubscription = null
}
