import { beforeEach, describe, expect, it, vi } from 'vitest'

const networkMocks = vi.hoisted(() => {
    const listeners: Array<(state: { isConnected: boolean }) => void> = []
    const getNetworkStateAsyncMock = vi.fn(() => Promise.resolve({ isConnected: true }))
    const addNetworkStateListenerMock = vi.fn(
        (callback: (state: { isConnected: boolean }) => void) => {
            listeners.push(callback)
            return {
                remove: () => {
                    const index = listeners.indexOf(callback)
                    if (index >= 0) {
                        listeners.splice(index, 1)
                    }
                },
            }
        }
    )

    return {
        listeners,
        getNetworkStateAsyncMock,
        addNetworkStateListenerMock,
    }
})

const { listeners, getNetworkStateAsyncMock, addNetworkStateListenerMock } = networkMocks

vi.mock(
    'expo-network',
    () => ({
        __esModule: true,
        getNetworkStateAsync: networkMocks.getNetworkStateAsyncMock,
        addNetworkStateListener: networkMocks.addNetworkStateListenerMock,
    }),
    { virtual: true }
)

const asyncStore: Record<string, string | null> = {}

vi.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: vi.fn((key: string) => Promise.resolve(asyncStore[key] ?? null)),
        setItem: vi.fn((key: string, value: string) => {
            asyncStore[key] = value
            return Promise.resolve()
        }),
        removeItem: vi.fn((key: string) => {
            delete asyncStore[key]
            return Promise.resolve()
        }),
    },
}))

import {
    enqueueOfflineRequest,
    flushOfflineQueue,
    registerOfflineHandler,
    setupOfflineQueue,
    __dangerouslyResetOfflineQueueForTests,
} from '@/core/services/offlineQueue'

describe('offline queue', () => {
    beforeEach(async () => {
        for (const key of Object.keys(asyncStore)) {
            delete asyncStore[key]
        }
        listeners.length = 0
        getNetworkStateAsyncMock.mockReset()
        getNetworkStateAsyncMock.mockResolvedValue({ isConnected: true })
        addNetworkStateListenerMock.mockClear()
        await __dangerouslyResetOfflineQueueForTests()
    })

    it('replays queued requests when handler succeeds', async () => {
        const handler = vi.fn(() => Promise.resolve())
        registerOfflineHandler('notification', handler)

        await enqueueOfflineRequest('notification', { title: 'Queued' })
        await flushOfflineQueue()

        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('keeps request in queue when handler fails and drops after retries', async () => {
        vi.useFakeTimers()
        let attempts = 0
        registerOfflineHandler('notification', () => {
            attempts += 1
            if (attempts < 3) {
                return Promise.reject(new Error('network down'))
            }
            return Promise.resolve()
        })

        await enqueueOfflineRequest('notification', { title: 'Retry me' })

        try {
            for (let i = 0; i < 3; i++) {
                const flushPromise = flushOfflineQueue()
                await vi.runAllTimersAsync()
                await flushPromise
            }
        } finally {
            vi.useRealTimers()
        }

        expect(attempts).toBeGreaterThanOrEqual(3)
    })

    it('flushes again when connectivity resumes', async () => {
        const handler = vi.fn(() => Promise.resolve())
        registerOfflineHandler('notification', handler)

        getNetworkStateAsyncMock.mockResolvedValueOnce({ isConnected: false })
        await setupOfflineQueue()
        await enqueueOfflineRequest('notification', { title: 'Pending' })
        expect(handler).not.toHaveBeenCalled()

        const listener = listeners[0]
        listener?.({ isConnected: true })
        await flushOfflineQueue()

        expect(handler).toHaveBeenCalledTimes(1)
    })
})
