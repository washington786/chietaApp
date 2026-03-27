import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import passwordResetReducer, {
    initializeReset,
    incrementFailedAttempts,
    resendOtpCode,
    verifyOtpBackend,
} from '@/store/slice/PasswordResetSlice'

const buildStore = (preloadedState?: ReturnType<typeof passwordResetReducer>) =>
    configureStore({
        reducer: {
            passwordReset: passwordResetReducer,
        },
        preloadedState: preloadedState
            ? { passwordReset: preloadedState }
            : undefined,
    })

const fetchMock = vi.fn()
const originalFetch = globalThis.fetch

beforeEach(() => {
    globalThis.fetch = fetchMock as any
})

afterEach(() => {
    globalThis.fetch = originalFetch
    fetchMock.mockReset()
})

const mockResponse = (data: any, init?: { ok?: boolean; status?: number }) => ({
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    json: async () => data,
})

describe('password reset slice', () => {
    const baseTime = 1_700_000_000_000
    let now = baseTime
    let dateNowSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        now = baseTime
        dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now)
    })

    afterEach(() => {
        dateNowSpy?.mockRestore()
    })

    it('initializes reset flow with future expiry windows', () => {
        const store = buildStore()
        const email = 'reset@example.com'

        store.dispatch(initializeReset({ email }))
        const state = store.getState().passwordReset

        expect(state.email).toBe(email)
        expect(state.otpExpiresAt).toBe(baseTime + 10 * 60 * 1000)
        expect(state.otpRequestedAt).toBe(baseTime)
        expect(state.lastResendAt).toBe(baseTime)
        expect(state.failedAttempts).toBe(0)
        expect(state.error).toBeNull()
    })

    it('verifies OTP with backend and clears errors', async () => {
        const store = buildStore()
        store.dispatch(initializeReset({ email: 'verify@example.com' }))

        fetchMock.mockResolvedValueOnce(
            mockResponse({
                result: { message: 'OTP verified successfully' },
            })
        )

        const action = await store.dispatch(
            verifyOtpBackend({
                email: 'verify@example.com',
                otp: '123456',
            })
        )

        expect(action.meta.requestStatus).toBe('fulfilled')
        const state = store.getState().passwordReset
        expect(state.failedAttempts).toBe(0)
        expect(state.error).toBeNull()
    })

    it('locks the user after repeated OTP failures and blocks further attempts', async () => {
        const store = buildStore()
        store.dispatch(initializeReset({ email: 'lock@example.com' }))

        const maxAttempts =
            store.getState().passwordReset.maxAttempts ?? 5

        for (let i = 0; i < maxAttempts - 1; i++) {
            store.dispatch(incrementFailedAttempts())
        }

        fetchMock.mockResolvedValueOnce(
            mockResponse(
                {
                    message: 'Invalid OTP',
                },
                { ok: false, status: 400 }
            )
        )

        const firstAttempt = await store.dispatch(
            verifyOtpBackend({
                email: 'lock@example.com',
                otp: '000000',
            })
        )

        expect(firstAttempt.meta.requestStatus).toBe('rejected')
        const lockedState = store.getState().passwordReset
        expect(lockedState.isLockedOut).toBe(true)
        expect(lockedState.lockoutExpiresAt).toBe(baseTime + 15 * 60 * 1000)

        fetchMock.mockClear()

        const secondAttempt = await store.dispatch(
            verifyOtpBackend({
                email: 'lock@example.com',
                otp: '000000',
            })
        )

        expect(secondAttempt.meta.requestStatus).toBe('rejected')
        expect(secondAttempt.payload).toMatch(/Too many failed attempts/)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('enforces resend cooldown before calling backend', async () => {
        const store = buildStore()
        store.dispatch(initializeReset({ email: 'cooldown@example.com' }))

        const action = await store.dispatch(
            resendOtpCode({ email: 'cooldown@example.com' })
        )

        expect(action.meta.requestStatus).toBe('rejected')
        expect(action.payload).toBe(
            'Please wait 60 seconds before requesting another OTP.'
        )
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('resends OTP after cooldown, updating expiry and counters', async () => {
        const store = buildStore()

        now = baseTime - 120_000
        store.dispatch(initializeReset({ email: 'resend@example.com' }))
        now = baseTime

        fetchMock.mockResolvedValueOnce(
            mockResponse({
                result: { message: 'OTP resent successfully' },
            })
        )

        const action = await store.dispatch(
            resendOtpCode({ email: 'resend@example.com' })
        )

        expect(action.meta.requestStatus).toBe('fulfilled')
        const state = store.getState().passwordReset
        expect(state.resendAttempts).toBe(1)
        expect(state.lastResendAt).toBe(baseTime)
        expect(state.otpExpiresAt).toBe(baseTime + 10 * 60 * 1000)
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })
})
