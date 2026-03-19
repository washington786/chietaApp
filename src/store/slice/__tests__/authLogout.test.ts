import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { logout, setCredentials } from '@/store/slice/AuthSlice'
import type { UserDto } from '@/core/models/UserDto'

const secureStoreMocks = vi.hoisted(() => ({
    getItemAsyncMock: vi.fn(() => Promise.resolve(null)),
    setItemAsyncMock: vi.fn(() => Promise.resolve()),
    deleteItemAsyncMock: vi.fn(() => Promise.resolve()),
}))

vi.mock('expo-secure-store', () => ({
    getItemAsync: secureStoreMocks.getItemAsyncMock,
    setItemAsync: secureStoreMocks.setItemAsyncMock,
    deleteItemAsync: secureStoreMocks.deleteItemAsyncMock,
}))

const createUser = (): UserDto => ({
    id: 'user-1',
    email: 'user@example.com',
    firstName: 'Test',
    lastName: 'User',
    username: 'tester',
    isActive: true,
    isEmailConfirmed: true,
})

const buildStore = () =>
    configureStore({
        reducer: {
            auth: authReducer,
        },
    })

describe('auth logout flow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        secureStoreMocks.deleteItemAsyncMock.mockImplementation(() => Promise.resolve())
    })

    it('clears auth state only after secure store deletion completes', async () => {
        const store = buildStore()
        store.dispatch(
            setCredentials({
                user: createUser(),
                token: 'token-123',
                refreshToken: 'refresh-123',
                expiresIn: 3600,
            })
        )

        const resolver: Array<() => void> = []
        secureStoreMocks.deleteItemAsyncMock.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolver.push(resolve)
                })
        )

        const logoutPromise = store.dispatch(logout())
        expect(store.getState().auth.isLoading).toBe(true)

        resolver.forEach((resolve) => resolve())
        await logoutPromise

        const state = store.getState().auth
        expect(state.isAuthenticated).toBe(false)
        expect(state.user).toBeNull()
        expect(state.token).toBeNull()
        expect(state.isLoading).toBe(false)
        expect(secureStoreMocks.deleteItemAsyncMock).toHaveBeenCalledTimes(4)
        expect(secureStoreMocks.deleteItemAsyncMock.mock.calls.map((call) => call[0])).toEqual(
            expect.arrayContaining(['user', 'accessToken', 'refreshToken', 'expiresIn'])
        )
    })

    it('remains resilient when secure store deletion rejects', async () => {
        const store = buildStore()
        store.dispatch(
            setCredentials({
                user: createUser(),
                token: 'token-123',
                refreshToken: 'refresh-123',
                expiresIn: 3600,
            })
        )

        secureStoreMocks.deleteItemAsyncMock.mockImplementation(() => Promise.resolve())
        secureStoreMocks.deleteItemAsyncMock.mockImplementationOnce(() => Promise.reject(new Error('secure-store failure')))

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        await store.dispatch(logout())

        const state = store.getState().auth
        expect(state.user).toBeNull()
        expect(state.isAuthenticated).toBe(false)
        expect(consoleSpy).toHaveBeenCalled()

        consoleSpy.mockRestore()
    })
})
