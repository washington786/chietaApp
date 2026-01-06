import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface PasswordResetState {
    email: string | null
    otp: string | null
    otpExpiresAt: number | null // Timestamp when OTP expires
    otpRequestedAt: number | null // Timestamp when OTP was requested
    failedAttempts: number // Number of failed OTP verification attempts
    maxAttempts: number // Maximum allowed attempts before lockout
    isLockedOut: boolean // Whether user is locked out
    lockoutExpiresAt: number | null // When lockout expires
    resendAttempts: number // Number of times user requested resend
    maxResendAttempts: number // Maximum resend attempts
    lastResendAt: number | null // Timestamp of last resend
    resendCooldownSeconds: number // Seconds between resend attempts
    isLoading: boolean
    error: string | null
}

const initialState: PasswordResetState = {
    email: null,
    otp: null,
    otpExpiresAt: null,
    otpRequestedAt: null,
    failedAttempts: 0,
    maxAttempts: 5, // 5 failed attempts before lockout
    isLockedOut: false,
    lockoutExpiresAt: null,
    resendAttempts: 0,
    maxResendAttempts: 3, // 3 resend attempts maximum
    lastResendAt: null,
    resendCooldownSeconds: 60, // 60 seconds between resends
    isLoading: false,
    error: null,
}

const API_BASE_URL = 'https://ims.chieta.org.za:22743'
const OTP_EXPIRY_SECONDS = 10 * 60 // 10 minutes
const LOCKOUT_DURATION_SECONDS = 15 * 60 // 15 minutes lockout after failed attempts

/**
 * Verify OTP code with backend
 * Includes validation of OTP, attempt counting, and expiry checking
 */
export const verifyOtpBackend = createAsyncThunk<
    { message: string },
    { email: string; otp: string },
    { rejectValue: string; state: { passwordReset: PasswordResetState } }
>(
    'passwordReset/verifyOtp',
    async (payload, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const resetState = state.passwordReset

            // Check if user is locked out
            if (resetState.isLockedOut && resetState.lockoutExpiresAt) {
                const timeLeft = Math.ceil((resetState.lockoutExpiresAt - Date.now()) / 1000)
                return rejectWithValue(
                    `Too many failed attempts. Try again in ${timeLeft} seconds.`
                )
            }

            // Check if OTP has expired
            if (resetState.otpExpiresAt && Date.now() > resetState.otpExpiresAt) {
                return rejectWithValue(
                    'OTP has expired. Please request a new one.'
                )
            }

            // Send verification to backend
            const response = await fetch(
                `${API_BASE_URL}/api/services/app/Account/VerifyOtp`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        emailAddress: payload.email,
                        otp: payload.otp,
                    }),
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'OTP verification failed',
                }))

                // OTP verification failed - increment attempt counter
                return rejectWithValue(
                    errorData.message || 'Invalid OTP. Please try again.'
                )
            }

            const data = await response.json()
            return { message: data.result?.message || 'OTP verified successfully' }
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Network error occurred'
            )
        }
    }
)

/**
 * Resend OTP code with rate limiting
 */
export const resendOtpCode = createAsyncThunk<
    { message: string; expiresAt: number },
    { email: string },
    { rejectValue: string; state: { passwordReset: PasswordResetState } }
>(
    'passwordReset/resendOtp',
    async (payload, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const resetState = state.passwordReset

            // Check resend attempts limit
            if (resetState.resendAttempts >= resetState.maxResendAttempts) {
                return rejectWithValue(
                    'Maximum resend attempts exceeded. Please wait before trying again.'
                )
            }

            // Check cooldown between resends
            if (resetState.lastResendAt) {
                const timeSinceLastResend = Math.floor(
                    (Date.now() - resetState.lastResendAt) / 1000
                )
                if (timeSinceLastResend < resetState.resendCooldownSeconds) {
                    const timeToWait = resetState.resendCooldownSeconds - timeSinceLastResend
                    return rejectWithValue(
                        `Please wait ${timeToWait} seconds before requesting another OTP.`
                    )
                }
            }

            // Call backend to resend OTP
            const response = await fetch(
                `${API_BASE_URL}/api/services/app/Account/SendPasswordResetCode`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        emailAddress: payload.email,
                    }),
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Failed to resend OTP',
                }))
                return rejectWithValue(
                    errorData.message || 'Failed to resend OTP. Please try again.'
                )
            }

            const data = await response.json()
            const expiresAt = Date.now() + OTP_EXPIRY_SECONDS * 1000

            return {
                message: data.result?.message || 'OTP resent successfully',
                expiresAt,
            }
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Network error occurred'
            )
        }
    }
)

const passwordResetSlice = createSlice({
    name: 'passwordReset',
    initialState,
    reducers: {
        /**
         * Initialize password reset flow
         */
        initializeReset: (state, action: PayloadAction<{ email: string }>) => {
            state.email = action.payload.email
            state.otp = null
            state.otpExpiresAt = Date.now() + OTP_EXPIRY_SECONDS * 1000
            state.otpRequestedAt = Date.now()
            state.failedAttempts = 0
            state.isLockedOut = false
            state.lockoutExpiresAt = null
            state.resendAttempts = 0
            state.lastResendAt = Date.now()
            state.error = null
        },

        /**
         * Set OTP value (store from user input)
         */
        setOtp: (state, action: PayloadAction<string>) => {
            state.otp = action.payload
            state.error = null
        },

        /**
         * Clear password reset state
         */
        clearResetState: (state) => {
            state.email = null
            state.otp = null
            state.otpExpiresAt = null
            state.otpRequestedAt = null
            state.failedAttempts = 0
            state.isLockedOut = false
            state.lockoutExpiresAt = null
            state.resendAttempts = 0
            state.lastResendAt = null
            state.error = null
        },

        /**
         * Increment failed attempt counter
         */
        incrementFailedAttempts: (state) => {
            state.failedAttempts += 1
            state.error = `Incorrect OTP. ${state.maxAttempts - state.failedAttempts
                } attempts remaining.`

            // Lock out after max attempts
            if (state.failedAttempts >= state.maxAttempts) {
                state.isLockedOut = true
                state.lockoutExpiresAt = Date.now() + LOCKOUT_DURATION_SECONDS * 1000
                state.error = 'Too many failed attempts. Please wait 15 minutes before trying again.'
            }
        },

        /**
         * Check and clear lockout if it has expired
         */
        checkLockoutExpiry: (state) => {
            if (
                state.isLockedOut &&
                state.lockoutExpiresAt &&
                Date.now() > state.lockoutExpiresAt
            ) {
                state.isLockedOut = false
                state.lockoutExpiresAt = null
                state.failedAttempts = 0
                state.error = null
            }
        },

        /**
         * Check if OTP has expired
         */
        checkOtpExpiry: (state) => {
            if (state.otpExpiresAt && Date.now() > state.otpExpiresAt) {
                state.error = 'OTP has expired. Please request a new one.'
            }
        },
    },
    extraReducers: (builder) => {
        // Verify OTP Backend
        builder
            .addCase(verifyOtpBackend.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(verifyOtpBackend.fulfilled, (state) => {
                state.isLoading = false
                state.failedAttempts = 0
                state.error = null
            })
            .addCase(verifyOtpBackend.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || 'OTP verification failed'
                state.failedAttempts += 1

                // Lock out after max attempts
                if (state.failedAttempts >= state.maxAttempts) {
                    state.isLockedOut = true
                    state.lockoutExpiresAt = Date.now() + LOCKOUT_DURATION_SECONDS * 1000
                    state.error = `Too many failed attempts. Account locked for 15 minutes.`
                }
            })

        // Resend OTP
        builder
            .addCase(resendOtpCode.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(resendOtpCode.fulfilled, (state, action) => {
                state.isLoading = false
                state.otpExpiresAt = action.payload.expiresAt
                state.otpRequestedAt = Date.now()
                state.lastResendAt = Date.now()
                state.resendAttempts += 1
                state.failedAttempts = 0
                state.error = null
            })
            .addCase(resendOtpCode.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || 'Failed to resend OTP'
            })
    },
})

export const {
    initializeReset,
    setOtp,
    clearResetState,
    incrementFailedAttempts,
    checkLockoutExpiry,
    checkOtpExpiry,
} = passwordResetSlice.actions

const PasswordResetReducer = passwordResetSlice.reducer

export default PasswordResetReducer
