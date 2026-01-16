import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
    UserDto,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    VerifyOtpRequest,
    ChangePasswordRequest,
    UpdateProfileRequest,
    RefreshTokenRequest,
    RefreshTokenResponse,
    AuthError,
} from '@/core/models/UserDto'
import * as SecureStore from 'expo-secure-store'
import { fetchPersonBySdfId } from './thunks/OrganizationThunks';

interface AuthState {
    user: UserDto | null
    token: string | null
    refreshToken: string | null
    expiresIn: number | null
    isLoading: boolean
    error: AuthError | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    expiresIn: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
}

const API_BASE_URL = 'https://ims.chieta.org.za:22743'

/**
 * Login with email and password
 */
const login = createAsyncThunk<
    LoginResponse,
    LoginRequest,
    { rejectValue: AuthError }
>('auth/login', async (payload, { rejectWithValue }) => {
    try {
        console.log('[LOGIN] Starting login request for:', payload.email);
        
        const response = await fetch(`${API_BASE_URL}/api/TokenAuth/Authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                userNameOrEmailAddress: payload.email,
                password: payload.password,
                rememberClient: payload.rememberMe || false,
            }),
        })

        console.log('[LOGIN] Response status:', response.status, response.ok);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: { message: 'Login failed' }
            }))
            console.error('[LOGIN] Error response:', response.status, errorData);
            
            // Extract error message from nested structure: error.message or error.details
            const errorMessage = errorData?.error?.message || 
                                errorData?.error?.details || 
                                errorData?.message || 
                                `Login failed with status ${response.status}`;
            
            return rejectWithValue({
                code: 'LOGIN_ERROR',
                message: errorMessage,
                details: errorData?.error?.details,
            })
        }

        const data = await response.json()
        console.log('[LOGIN] Success - received user data for:', data.result?.userId);

        // Decode JWT to get expiry
        const expiresIn = extractTokenExpiry(data.result?.accessToken)

        return {
            user: {
                id: data.result?.userId || '',
                email: payload.email,
                firstName: data.result?.firstName || '',
                lastName: data.result?.lastName || '',
                username: data.result?.userName || '',
                sdfId: data.result?.sdfId,
                isActive: true,
                isEmailConfirmed: true,
            },
            accessToken: data.result?.accessToken || '',
            refreshToken: data.result?.refreshToken || undefined,
            expiresIn: expiresIn || 3600,
        }
    } catch (error) {
        console.error('[LOGIN] Catch error:', error);
        return rejectWithValue({
            code: 'NETWORK_ERROR',
            message: error instanceof Error ? error.message : 'Network error occurred',
        })
    }
})

/**
 * Register new user
 */
const register = createAsyncThunk<
    RegisterResponse,
    RegisterRequest,
    { rejectValue: AuthError }
>('auth/register', async (payload, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/services/app/Account/Register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                firstName: payload.firstName,
                lastName: payload.lastName,
                emailAddress: payload.email,
                userName: payload.username,
                password: payload.password,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: { message: 'Registration failed' }
            }))
            
            // Extract error message from nested structure: error.message or error.details
            const errorMessage = errorData?.error?.message || 
                                errorData?.error?.details || 
                                errorData?.message || 
                                `Registration failed with status ${response.status}`;
            
            return rejectWithValue({
                code: 'REGISTRATION_ERROR',
                message: errorMessage,
                details: errorData?.error?.details,
            })
        }

        const data = await response.json()

        const expiresIn = extractTokenExpiry(data.result?.accessToken)

        return {
            user: {
                id: data.result?.userId || '',
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                username: payload.username,
                sdfId: data.result?.sdfId,
                isActive: true,
                isEmailConfirmed: false,
            },
            accessToken: data.result?.accessToken || '',
            refreshToken: data.result?.refreshToken || undefined,
            expiresIn: expiresIn || 3600,
        }
    } catch (error) {
        return rejectWithValue({
            code: 'NETWORK_ERROR',
            message: error instanceof Error ? error.message : 'Network error occurred',
        })
    }
})

/**
 * Send password reset code
 */
const resetPassword = createAsyncThunk<
    { message: string },
    ResetPasswordRequest,
    { rejectValue: AuthError }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
    try {
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
                message: 'Password reset failed',
            }))
            return rejectWithValue({
                code: 'RESET_PASSWORD_ERROR',
                message: errorData.message || `Password reset failed with status ${response.status}`,
                details: errorData.details,
            })
        }

        const data = await response.json()
        return { message: data.result?.message || 'Password reset code sent successfully' }
    } catch (error) {
        return rejectWithValue({
            code: 'NETWORK_ERROR',
            message: error instanceof Error ? error.message : 'Network error occurred',
        })
    }
})

/**
 * Verify OTP and complete password reset
 */
const verifyOtp = createAsyncThunk<
    { message: string },
    VerifyOtpRequest & { newPassword: string },
    { rejectValue: AuthError }
>('auth/verifyOtp', async (payload, { rejectWithValue }) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/services/app/Account/ResetPassword`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    emailAddress: payload.email,
                    resetCode: payload.otp,
                    password: payload.newPassword,
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: 'OTP verification failed',
            }))
            return rejectWithValue({
                code: 'OTP_VERIFICATION_ERROR',
                message: errorData.message || `OTP verification failed with status ${response.status}`,
                details: errorData.details,
            })
        }

        const data = await response.json()
        return { message: data.result?.message || 'Password reset successfully' }
    } catch (error) {
        return rejectWithValue({
            code: 'NETWORK_ERROR',
            message: error instanceof Error ? error.message : 'Network error occurred',
        })
    }
})

/**
 * Change password (requires authentication)
 */
const changePassword = createAsyncThunk<
    { message: string },
    ChangePasswordRequest,
    { rejectValue: AuthError; state: { auth: AuthState } }
>(
    'auth/changePassword',
    async (payload, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const token = state.auth.token

            if (!token) {
                return rejectWithValue({
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated',
                })
            }

            const response = await fetch(
                `${API_BASE_URL}/api/services/app/Account/ChangePassword`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword: payload.oldPassword,
                        newPassword: payload.password,
                    }),
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Password change failed',
                }))
                return rejectWithValue({
                    code: 'CHANGE_PASSWORD_ERROR',
                    message: errorData.message || `Password change failed with status ${response.status}`,
                    details: errorData.details,
                })
            }

            const data = await response.json()
            return { message: data.result?.message || 'Password changed successfully' }
        } catch (error) {
            return rejectWithValue({
                code: 'NETWORK_ERROR',
                message: error instanceof Error ? error.message : 'Network error occurred',
            })
        }
    }
)

/**
 * Update user profile
 */
const updateProfile = createAsyncThunk<
    UserDto,
    UpdateProfileRequest,
    { rejectValue: AuthError; state: { auth: AuthState } }
>(
    'auth/updateProfile',
    async (payload, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const token = state.auth.token
            const user = state.auth.user

            if (!token) {
                return rejectWithValue({
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated',
                })
            }

            if (!user) {
                return rejectWithValue({
                    code: 'NO_USER',
                    message: 'No user data found',
                })
            }

            const response = await fetch(
                `${API_BASE_URL}/api/services/app/User/Update`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: user.id,
                        userName: payload.userName,
                        name: payload.name,
                        surname: payload.surname,
                        emailAddress: payload.emailAddress,
                        isActive: user.isActive,
                    }),
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Profile update failed',
                }))
                return rejectWithValue({
                    code: 'UPDATE_PROFILE_ERROR',
                    message: errorData.message || `Profile update failed with status ${response.status}`,
                    details: errorData.details,
                })
            }

            const data = await response.json()
            const updatedUser: UserDto = {
                id: user.id,
                email: payload.emailAddress,
                firstName: payload.name,
                lastName: payload.surname,
                username: payload.userName,
                isActive: user.isActive,
                isEmailConfirmed: user.isEmailConfirmed,
                phoneNumber: user.phoneNumber,
                creationTime: user.creationTime,
                lastModificationTime: new Date().toISOString(),
                roles: user.roles,
                permissions: user.permissions,
            }

            return updatedUser
        } catch (error) {
            return rejectWithValue({
                code: 'NETWORK_ERROR',
                message: error instanceof Error ? error.message : 'Network error occurred',
            })
        }
    }
)

/**
 * Delete user account
 * Permanently removes the account from the system
 */
const deleteAccount = createAsyncThunk<
    { message: string },
    void,
    { rejectValue: AuthError; state: { auth: AuthState } }
>(
    'auth/deleteAccount',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const token = state.auth.token
            const user = state.auth.user

            if (!token) {
                return rejectWithValue({
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated',
                })
            }

            if (!user) {
                return rejectWithValue({
                    code: 'NO_USER',
                    message: 'No user data found',
                })
            }

            const response = await fetch(
                `${API_BASE_URL}/api/services/app/User/Delete?Id=${user.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Account deletion failed',
                }))
                return rejectWithValue({
                    code: 'DELETE_ACCOUNT_ERROR',
                    message: errorData.message || `Account deletion failed with status ${response.status}`,
                    details: errorData.details,
                })
            }

            return { message: 'Account deleted successfully' }
        } catch (error) {
            return rejectWithValue({
                code: 'NETWORK_ERROR',
                message: error instanceof Error ? error.message : 'Network error occurred',
            })
        }
    }
)

/**
 * Refresh access token
 */
const refreshTokenThunk = createAsyncThunk<
    RefreshTokenResponse,
    undefined,
    { rejectValue: AuthError; state: { auth: AuthState } }
>(
    'auth/refreshToken',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState()
            const refreshToken = state.auth.refreshToken

            if (!refreshToken) {
                return rejectWithValue({
                    code: 'NO_REFRESH_TOKEN',
                    message: 'No refresh token available',
                })
            }

            const response = await fetch(
                `${API_BASE_URL}/api/TokenAuth/RefreshToken`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        refreshToken: refreshToken,
                    }),
                }
            )

            if (!response.ok) {
                return rejectWithValue({
                    code: 'TOKEN_REFRESH_ERROR',
                    message: 'Failed to refresh token',
                })
            }

            const data = await response.json()

            const expiresIn = extractTokenExpiry(data.result?.accessToken)

            return {
                accessToken: data.result?.accessToken || '',
                refreshToken: data.result?.refreshToken || undefined,
                expiresIn: expiresIn || 3600,
            }
        } catch (error) {
            return rejectWithValue({
                code: 'NETWORK_ERROR',
                message: error instanceof Error ? error.message : 'Network error occurred',
            })
        }
    }
)

/**
 * Restore session from secure storage
 * Checks if token is still valid before restoring
 */
const restoreSession = createAsyncThunk<
    { user: UserDto; token: string; refreshToken?: string; expiresIn?: number } | null,
    void,
    { rejectValue: AuthError }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
    try {
        const storedToken = await SecureStore.getItemAsync('accessToken')
        const storedRefreshToken = await SecureStore.getItemAsync('refreshToken')
        const storedUser = await SecureStore.getItemAsync('user')
        const storedExpiresIn = await SecureStore.getItemAsync('expiresIn')

        if (!storedToken || !storedUser) {
            return null
        }

        // Parse stored data
        const user = JSON.parse(storedUser)
        const expiresIn = storedExpiresIn ? parseInt(storedExpiresIn) : 0

        // Check if token is still valid
        const tokenExpiry = extractTokenExpiry(storedToken)
        if (tokenExpiry && tokenExpiry <= 0) {
            // Token expired, try to refresh
            if (storedRefreshToken) {
                // If refresh available, let another thunk handle it
                return null
            }
            // Clear expired token
            await SecureStore.deleteItemAsync('accessToken')
            await SecureStore.deleteItemAsync('user')
            return null
        }

        return {
            user,
            token: storedToken,
            refreshToken: storedRefreshToken || undefined,
            expiresIn,
        }
    } catch (error) {
        console.error('Failed to restore session:', error)
        return null
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                user: UserDto
                token: string
                refreshToken?: string
                expiresIn?: number
            }>
        ) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.refreshToken = action.payload.refreshToken || null
            state.expiresIn = action.payload.expiresIn || 3600
            state.isAuthenticated = true
            state.error = null
        },
        clearError: (state) => {
            state.error = null
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.refreshToken = null
            state.expiresIn = null
            state.isAuthenticated = false
            state.error = null
            // Clear from secure storage
            clearCredentialsFromSecureStore()
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.token = action.payload.accessToken
                state.refreshToken = action.payload.refreshToken || null
                state.expiresIn = action.payload.expiresIn
                state.isAuthenticated = true
                state.error = null
                // Save to secure storage
                saveCredentialsToSecureStore(action.payload.user, action.payload.accessToken, action.payload.refreshToken, action.payload.expiresIn)
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || {
                    code: 'LOGIN_ERROR',
                    message: 'Login failed',
                }
            })

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.token = action.payload.accessToken
                state.refreshToken = action.payload.refreshToken || null
                state.expiresIn = action.payload.expiresIn
                state.isAuthenticated = true
                state.error = null
                // Save to secure storage
                saveCredentialsToSecureStore(action.payload.user, action.payload.accessToken, action.payload.refreshToken, action.payload.expiresIn)
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || {
                    code: 'REGISTRATION_ERROR',
                    message: 'Registration failed',
                }
            })

        // Reset Password
        builder
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || {
                    code: 'RESET_PASSWORD_ERROR',
                    message: 'Password reset failed',
                }
            })

        // Verify OTP
        builder
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || {
                    code: 'OTP_VERIFICATION_ERROR',
                    message: 'OTP verification failed',
                }
            })

        // Change Password
        builder
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || {
                    code: 'CHANGE_PASSWORD_ERROR',
                    message: 'Password change failed',
                }
            })

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.error = null
                // Save updated user to secure storage
                saveCredentialsToSecureStore(action.payload, state.token || '', state.refreshToken || undefined, state.expiresIn || 0)
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || {
                    code: 'UPDATE_PROFILE_ERROR',
                    message: 'Profile update failed',
                }
            })

        // Delete Account
        builder
            .addCase(deleteAccount.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                // Clear all auth state
                state.isLoading = false
                state.user = null
                state.token = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.error = null
                // Clear secure storage
                clearCredentialsFromSecureStore()
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || {
                    code: 'DELETE_ACCOUNT_ERROR',
                    message: 'Account deletion failed',
                }
            })

        // Restore Session
        builder
            .addCase(restoreSession.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload.user
                    state.token = action.payload.token
                    state.refreshToken = action.payload.refreshToken || null
                    state.expiresIn = action.payload.expiresIn || null
                    state.isAuthenticated = true
                    state.error = null
                }
            })
            .addCase(restoreSession.rejected, () => {
                // Session restore failed, keep initial state (show login)
            })

        // Refresh Token
        builder
            .addCase(refreshTokenThunk.pending, (state) => {
                // Don't show loading indicator for token refresh
            })
            .addCase(refreshTokenThunk.fulfilled, (state, action) => {
                state.token = action.payload.accessToken
                state.refreshToken = action.payload.refreshToken || state.refreshToken
                state.expiresIn = action.payload.expiresIn
                state.error = null
            })
            .addCase(refreshTokenThunk.rejected, (state, action) => {
                // If refresh fails, logout user
                state.user = null
                state.token = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.error = action.payload || {
                    code: 'TOKEN_REFRESH_ERROR',
                    message: 'Session expired',
                }
            })

        // Fetch Person by SDF ID
        builder
            .addCase(fetchPersonBySdfId.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.sdfId = action.payload
                }
            })
            .addCase(fetchPersonBySdfId.rejected, (state, action) => {
                console.warn('Failed to fetch SDF ID:', action.payload)
                // Don't fail authentication if SDF ID fetch fails
            })
    },
})

export const { setCredentials, clearError, logout } = authSlice.actions

const AuthReducer = authSlice.reducer

export default AuthReducer

// Export thunks for external use
export {
    login,
    register,
    resetPassword,
    verifyOtp,
    changePassword,
    updateProfile,
    refreshTokenThunk,
    restoreSession,
    deleteAccount,
}

/**
 * Save credentials to secure storage
 */
function saveCredentialsToSecureStore(
    user: UserDto,
    token: string,
    refreshToken?: string,
    expiresIn?: number
) {
    SecureStore.setItemAsync('user', JSON.stringify(user)).catch((error) =>
        console.error('Failed to save user to secure store:', error)
    )
    SecureStore.setItemAsync('accessToken', token).catch((error) =>
        console.error('Failed to save token to secure store:', error)
    )
    if (refreshToken) {
        SecureStore.setItemAsync('refreshToken', refreshToken).catch((error) =>
            console.error('Failed to save refresh token to secure store:', error)
        )
    }
    if (expiresIn) {
        SecureStore.setItemAsync('expiresIn', expiresIn.toString()).catch((error) =>
            console.error('Failed to save expiresIn to secure store:', error)
        )
    }
}

/**
 * Clear credentials from secure storage
 */
function clearCredentialsFromSecureStore() {
    SecureStore.deleteItemAsync('user').catch((error) =>
        console.error('Failed to delete user from secure store:', error)
    )
    SecureStore.deleteItemAsync('accessToken').catch((error) =>
        console.error('Failed to delete token from secure store:', error)
    )
    SecureStore.deleteItemAsync('refreshToken').catch((error) =>
        console.error('Failed to delete refresh token from secure store:', error)
    )
    SecureStore.deleteItemAsync('expiresIn').catch((error) =>
        console.error('Failed to delete expiresIn from secure store:', error)
    )
}

/**
 * Helper function to extract expiry time from JWT token
 */
function extractTokenExpiry(token?: string): number | null {
    if (!token) return null

    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const payload = JSON.parse(atob(parts[1]))
        const exp = payload.exp

        if (!exp) return null

        // Return seconds until expiry (subtract current time)
        const now = Math.floor(Date.now() / 1000)
        return Math.max(exp - now, 0)
    } catch (error) {
        console.error('Failed to extract token expiry:', error)
        return null
    }
}