import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, {
    login,
    register,
    resetPassword,
    verifyOtp,
} from '@/store/slice/AuthSlice'

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

const buildStore = () =>
    configureStore({
        reducer: {
            auth: authReducer,
        },
    })

const fetchMock = vi.fn()
const originalFetch = globalThis.fetch

beforeAll(() => {
    globalThis.fetch = fetchMock as any
})

afterAll(() => {
    globalThis.fetch = originalFetch
})

beforeEach(() => {
    fetchMock.mockReset()
    secureStoreMocks.getItemAsyncMock.mockClear()
    secureStoreMocks.setItemAsyncMock.mockClear()
    secureStoreMocks.deleteItemAsyncMock.mockClear()
})

const mockResponse = (data: any, init?: { ok?: boolean; status?: number }) => ({
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    json: async () => data,
})

describe('authentication thunks', () => {
    describe('login flow', () => {
        it('trims credentials, persists them, and authenticates the user', async () => {
            const store = buildStore()

            fetchMock.mockResolvedValueOnce(
                mockResponse({
                    success: true,
                    result: {
                        userId: 'user-123',
                        userName: 'tester',
                        firstName: 'Test',
                        lastName: 'User',
                        accessToken: 'access-token',
                        refreshToken: 'refresh-token',
                    },
                })
            )

            const result = await store.dispatch(
                login({
                    email: ' user@example.com ',
                    password: ' secret ',
                    rememberMe: true,
                })
            )

            expect(result.meta.requestStatus).toBe('fulfilled')

            const [url, request] = fetchMock.mock.calls[0]
            expect(url).toMatch(/Authenticate$/)
            const body = JSON.parse((request?.body as string) ?? '{}')
            expect(body.userNameOrEmailAddress).toBe('user@example.com')
            expect(body.password).toBe('secret')
            expect(body.rememberClient).toBe(true)

            const state = store.getState().auth
            expect(state.isAuthenticated).toBe(true)
            expect(state.user?.id).toBe('user-123')
            expect(state.token).toBe('access-token')
            expect(secureStoreMocks.setItemAsyncMock).toHaveBeenCalledWith(
                'accessToken',
                'access-token'
            )
            expect(secureStoreMocks.setItemAsyncMock).toHaveBeenCalledWith(
                'refreshToken',
                'refresh-token'
            )
        })

        it('surfaces backend validation errors when login fails', async () => {
            const store = buildStore()

            fetchMock.mockResolvedValueOnce(
                mockResponse(
                    {
                        success: false,
                        error: { message: 'Invalid credentials' },
                    },
                    { ok: true }
                )
            )

            const result = await store.dispatch(
                login({
                    email: 'user@example.com',
                    password: 'wrong',
                })
            )

            expect(result.meta.requestStatus).toBe('rejected')
            expect(store.getState().auth.error?.message).toContain('Invalid credentials')
            expect(secureStoreMocks.setItemAsyncMock).not.toHaveBeenCalled()
        })
    })

    describe('registration', () => {
        it('registers and authenticates a new user', async () => {
            const store = buildStore()

            fetchMock.mockResolvedValueOnce(
                mockResponse({
                    result: {
                        userId: 'user-99',
                        sdfId: 42,
                        accessToken: 'access-token',
                        refreshToken: 'refresh-token',
                    },
                })
            )

            const payload = {
                email: ' person@example.com ',
                password: ' pass123 ',
                firstName: ' Jane ',
                lastName: ' Doe ',
                username: ' janedoe ',
            }

            const action = await store.dispatch(register(payload))

            expect(action.meta.requestStatus).toBe('fulfilled')

            const [, request] = fetchMock.mock.calls[0]
            const body = JSON.parse((request?.body as string) ?? '{}')
            expect(body.emailAddress).toBe('person@example.com')
            expect(body.password).toBe('pass123')
            expect(body.firstName).toBe('Jane')
            expect(body.lastName).toBe('Doe')
            expect(body.userName).toBe('janedoe')

            const state = store.getState().auth
            expect(state.isAuthenticated).toBe(true)
            expect(state.user?.id).toBe('user-99')
            expect(state.user?.sdfId).toBe(42)
        })

        it('captures API failures while registering', async () => {
            const store = buildStore()

            fetchMock.mockResolvedValueOnce(
                mockResponse(
                    {
                        error: {
                            message: 'Email already exists',
                        },
                    },
                    { ok: false, status: 409 }
                )
            )

            const result = await store.dispatch(
                register({
                    email: 'taken@example.com',
                    password: 'pass123',
                    firstName: 'Taken',
                    lastName: 'User',
                    username: 'taken',
                })
            )

            expect(result.meta.requestStatus).toBe('rejected')
            expect(result.payload).toMatchObject({
                code: 'REGISTRATION_ERROR',
            })
            expect(store.getState().auth.isAuthenticated).toBe(false)
        })
    })

    describe('forgot password + otp', () => {
        it('sends password reset code', async () => {
            const store = buildStore()

            fetchMock.mockResolvedValueOnce(
                mockResponse({
                    result: { message: 'Reset code sent' },
                })
            )

            const action = await store.dispatch(
                resetPassword({
                    email: 'candidate@example.com',
                })
            )

            expect(action.meta.requestStatus).toBe('fulfilled')
            expect(action.payload).toMatchObject({
                message: 'Reset code sent',
            })
            expect(store.getState().auth.error).toBeNull()
        })

        it('gracefully reports reset failures', async () => {
            const store = buildStore()

            fetchMock.mockResolvedValueOnce(
                mockResponse(
                    {
                        message: 'Password reset failed',
                    },
                    { ok: false, status: 404 }
                )
            )

            const action = await store.dispatch(
                resetPassword({
                    email: 'missing@example.com',
                })
            )

            expect(action.meta.requestStatus).toBe('rejected')
            expect(store.getState().auth.error?.code).toBe('RESET_PASSWORD_ERROR')
        })

        it('submits OTP and new password successfully', async () => {
            const store = buildStore()

            fetchMock.mockResolvedValueOnce(
                mockResponse({
                    result: { message: 'Password reset successfully' },
                })
            )

            const action = await store.dispatch(
                verifyOtp({
                    email: 'otp@example.com',
                    otp: '123456',
                    newPassword: 'new-pass',
                })
            )

            expect(action.meta.requestStatus).toBe('fulfilled')
            expect(store.getState().auth.error).toBeNull()
        })

        it('captures OTP verification errors', async () => {
            const store = buildStore()

            fetchMock.mockResolvedValueOnce(
                mockResponse(
                    {
                        message: 'OTP verification failed',
                    },
                    { ok: false, status: 400 }
                )
            )

            const action = await store.dispatch(
                verifyOtp({
                    email: 'otp@example.com',
                    otp: '000000',
                    newPassword: 'new-pass',
                })
            )

            expect(action.meta.requestStatus).toBe('rejected')
            expect(store.getState().auth.error?.code).toBe('OTP_VERIFICATION_ERROR')
        })
    })
})
