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

interface OperationState {
    loading: boolean
    error: AuthError | null
}

const OPERATION_INITIAL: OperationState = { loading: false, error: null }

interface AuthState {
    user: UserDto | null
    token: string | null
    refreshToken: string | null
    expiresIn: number | null
    isLoading: boolean
    error: AuthError | null
    isAuthenticated: boolean
    resetPasswordOp: OperationState
    verifyOtpOp: OperationState
    changePasswordOp: OperationState
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    expiresIn: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    resetPasswordOp: { ...OPERATION_INITIAL },
    verifyOtpOp: { ...OPERATION_INITIAL },
    changePasswordOp: { ...OPERATION_INITIAL },
}

const resetAuthState = (state: AuthState) => {
    state.user = null
    state.token = null
    state.refreshToken = null
    state.expiresIn = null
    state.isAuthenticated = false
    state.error = null
    state.isLoading = false
    state.resetPasswordOp = { loading: false, error: null }
    state.verifyOtpOp = { loading: false, error: null }
    state.changePasswordOp = { loading: false, error: null }
}

const API_BASE_URL = 'https://ims.chieta.org.za:22743'
const ABP_TENANT_ID = '2' // tenancyName: "chieta"

/**
 * Extract user-friendly error message from ABP error responses.
 * ABP wraps errors in { error: { message, details, validationErrors } }.
 */
function extractAbpError(errorData: any, fallback: string): string {
    return (
        errorData?.error?.details ||
        errorData?.error?.message ||
        errorData?.message ||
        fallback
    )
}

/** Consistent network/connection error shown to users. */
const MSG_NETWORK = 'Unable to connect. Please check your internet connection and try again.'

/**
 * Login with email and password
 */
const login = createAsyncThunk<
    LoginResponse,
    LoginRequest,
    { rejectValue: AuthError }
>('auth/login', async (payload, { rejectWithValue }) => {
    try {
        // Use username if provided, otherwise use email
        let userNameOrEmailAddress = payload.username || payload.email;
        let password = payload.password;

        if (!userNameOrEmailAddress) {
            return rejectWithValue({
                code: 'LOGIN_ERROR',
                message: 'Username or email is required',
            });
        }

        // Trim credentials to handle user input errors (don't lowercase - backend is case-sensitive)
        userNameOrEmailAddress = userNameOrEmailAddress.trim();
        password = password.trim();

        const response = await fetch(`${API_BASE_URL}/api/TokenAuth/Authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                userNameOrEmailAddress: userNameOrEmailAddress,
                password: password,
                rememberClient: payload.rememberMe || false,
            }),
        })

        const data = await response.json()

        // Check for API-level errors (success field) or HTTP errors
        if (!response.ok || !data?.success) {
            // Extract error message from nested structure: prioritize details for user-friendliness
            const errorMessage = data?.error?.details ||
                data?.error?.message ||
                data?.message ||
                'Your email or password is incorrect. Please try again.';

            return rejectWithValue({
                code: 'LOGIN_ERROR',
                message: errorMessage,
                details: data?.error?.details,
            })
        }

        // Log response for debugging
        console.log('[AUTH] Login response received:', {
            hasResult: !!data.result,
            hasAccessToken: !!data.result?.accessToken,
            accessTokenLength: data.result?.accessToken?.length,
            userId: data.result?.userId,
            userName: data.result?.userName,
            sdfId: data.result?.sdfId,
            id: data.result?.id,
        })

        // Decode JWT to get expiry and additional claims
        const expiresIn = extractTokenExpiry(data.result?.accessToken)

        // Decode JWT to get additional claims like sdfId if present
        const jwtPayload = decodeJWT(data.result?.accessToken)
        console.log('[AUTH] JWT Payload:', jwtPayload)

        // Validate token
        const accessToken = data.result?.accessToken
        if (!accessToken) {
            return rejectWithValue({
                code: 'LOGIN_ERROR',
                message: 'Sign-in failed. Please try again.',
            })
        }

        // Note: SDF ID will be fetched and populated by fetchPersonBySdfId thunk after login
        // Don't try to extract it from login response

        console.log('[AUTH] Login successful for userId:', data.result?.userId)

        return {
            user: {
                id: data.result?.userId || '',
                email: payload.email || '',
                firstName: data.result?.firstName || '',
                lastName: data.result?.lastName || '',
                username: data.result?.userName || payload.username || '',
                sdfId: undefined, // Will be set by fetchPersonBySdfId
                isActive: true,
                isEmailConfirmed: true,
            },
            accessToken: accessToken,
            refreshToken: data.result?.refreshToken || undefined,
            expiresIn: expiresIn || 3600,
        }
    } catch (error) {
        console.error('[AUTH] Login error:', error)
        return rejectWithValue({
            code: 'NETWORK_ERROR',
            message: MSG_NETWORK,
        })
    }
})

/**
 * Register new user
 *
 * ABP's Account/Register endpoint returns { result: { canLogin: bool }, success: bool }.
 * It does NOT return an access token, so we auto-login after a successful registration
 * to get the token and keep the auth state consistent.
 */
const register = createAsyncThunk<
    RegisterResponse,
    RegisterRequest,
    { rejectValue: AuthError }
>('auth/register', async (payload, { rejectWithValue }) => {
    try {
        const trimmedEmail = payload.email.trim();
        const trimmedFirstName = payload.firstName.trim();
        const trimmedLastName = payload.lastName.trim();
        const trimmedUsername = payload.username.trim();
        const trimmedPassword = payload.password.trim();

        const regBody = {
            name: trimmedFirstName,
            surname: trimmedLastName,
            emailAddress: trimmedEmail,
            userName: trimmedUsername,
            password: trimmedPassword,
        };
        console.log('[Register] Step 1 — request body:', JSON.stringify(regBody));

        // ── Step 1: Register the account ────────────────────────────────────
        const regResponse = await fetch(`${API_BASE_URL}/api/services/app/Account/Register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Abp.TenantId': ABP_TENANT_ID },
            body: JSON.stringify(regBody),
        });

        const regData = await regResponse.json().catch(() => null);
        console.log('[Register] Step 1 — status:', regResponse.status, 'response:', JSON.stringify(regData));

        // ABP can return HTTP 200 with success: false for validation failures
        if (!regResponse.ok || regData?.success === false) {
            const abpError = regData?.error;
            // ABP puts the user-friendly message in details; message is often generic
            const validationMsg = Array.isArray(abpError?.validationErrors) && abpError.validationErrors.length > 0
                ? abpError.validationErrors.map((v: any) => v?.message || v).join(' ')
                : null;
            const errorMessage =
                validationMsg ||
                abpError?.details ||
                abpError?.message ||
                regData?.message ||
                'Registration failed. Please check your details and try again.';

            console.log('[Register] Step 1 FAILED — error:', errorMessage);
            return rejectWithValue({
                code: 'REGISTRATION_ERROR',
                message: errorMessage,
            });
        }

        // ── Step 2: ABP Register succeeded — auto-login to obtain token ─────
        // Some API versions return the token directly in the register response.
        const regResult = regData?.result;
        console.log('[Register] Step 1 SUCCESS — result:', JSON.stringify(regResult));
        if (regResult?.accessToken) {
            console.log('[Register] Token found in register response — skipping auto-login');
            const accessToken: string = regResult.accessToken;
            const refreshToken: string | undefined = regResult.refreshToken || undefined;
            const expiresIn = extractTokenExpiry(accessToken) || 3600;
            const userId: string = String(regResult.userId || '');
            return {
                user: {
                    id: userId,
                    email: trimmedEmail,
                    firstName: trimmedFirstName,
                    lastName: trimmedLastName,
                    username: trimmedUsername,
                    sdfId: regResult.sdfId,
                    isActive: true,
                    isEmailConfirmed: false,
                },
                accessToken,
                refreshToken,
                expiresIn,
            };
        }

        // Account/Register returns { canLogin: bool }, not an access token.
        const authBody = { userNameOrEmailAddress: trimmedUsername, password: trimmedPassword, rememberClient: false };
        console.log('[Register] Step 2 — auto-login body:', JSON.stringify(authBody));
        const authResponse = await fetch(`${API_BASE_URL}/api/TokenAuth/Authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Abp.TenantId': ABP_TENANT_ID },
            body: JSON.stringify(authBody),
        });

        const authData = await authResponse.json().catch(() => null);
        console.log('[Register] Step 2 — status:', authResponse.status, 'response:', JSON.stringify(authData));

        if (!authResponse.ok || authData?.success === false) {
            console.log('[Register] Step 2 auto-login failed — registered but no token');
            return {
                user: {
                    id: '',
                    email: trimmedEmail,
                    firstName: trimmedFirstName,
                    lastName: trimmedLastName,
                    username: trimmedUsername,
                    isActive: false,
                    isEmailConfirmed: false,
                },
                accessToken: '',
                expiresIn: 0,
            };
        }

        const accessToken: string = authData?.result?.accessToken || '';
        const refreshToken: string | undefined = authData?.result?.refreshToken || undefined;
        const expiresIn = extractTokenExpiry(accessToken) || 3600;
        const userId: string = String(authData?.result?.userId || '');

        return {
            user: {
                id: userId,
                email: trimmedEmail,
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                username: trimmedUsername,
                isActive: true,
                isEmailConfirmed: false,
            },
            accessToken,
            refreshToken,
            expiresIn,
        };
    } catch (error) {
        return rejectWithValue({
            code: 'NETWORK_ERROR',
            message: MSG_NETWORK,
        });
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
                    'Abp.TenantId': ABP_TENANT_ID,
                },
                body: JSON.stringify({
                    emailAddress: payload.email,
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            return rejectWithValue({
                code: 'RESET_PASSWORD_ERROR',
                message: extractAbpError(errorData, "We couldn't send the reset code. Please check your email address and try again."),
            })
        }

        const data = await response.json()
        return { message: data.result?.message || 'Password reset code sent successfully' }
    } catch (error) {
        return rejectWithValue({
            code: 'NETWORK_ERROR',
            message: MSG_NETWORK,
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
                    'Abp.TenantId': ABP_TENANT_ID,
                },
                body: JSON.stringify({
                    emailAddress: payload.email,
                    resetCode: payload.otp,
                    password: payload.newPassword,
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            return rejectWithValue({
                code: 'OTP_VERIFICATION_ERROR',
                message: extractAbpError(errorData, 'The code you entered is incorrect or has expired. Please try again.'),
            })
        }

        const data = await response.json()
        return { message: data.result?.message || 'Password reset successfully' }
    } catch (error) {
        return rejectWithValue({
            code: 'NETWORK_ERROR',
            message: MSG_NETWORK,
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
                    message: 'Please sign in again to change your password.',
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
                const errorData = await response.json().catch(() => null)
                return rejectWithValue({
                    code: 'CHANGE_PASSWORD_ERROR',
                    message: extractAbpError(errorData, "We couldn't update your password. Please check your current password and try again."),
                })
            }

            const data = await response.json()
            return { message: data.result?.message || 'Password changed successfully' }
        } catch (error) {
            return rejectWithValue({
                code: 'NETWORK_ERROR',
                message: MSG_NETWORK,
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
                    message: 'Please sign in again to update your profile.',
                })
            }

            if (!user) {
                return rejectWithValue({
                    code: 'NO_USER',
                    message: 'Your session appears to be invalid. Please sign in again.',
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
                const errorData = await response.json().catch(() => null)
                return rejectWithValue({
                    code: 'UPDATE_PROFILE_ERROR',
                    message: extractAbpError(errorData, "We couldn't save your profile changes. Please try again."),
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
                message: MSG_NETWORK,
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
                    message: 'Please sign in again to delete your account.',
                })
            }

            if (!user) {
                return rejectWithValue({
                    code: 'NO_USER',
                    message: 'Your session appears to be invalid. Please sign in again.',
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
                const errorData = await response.json().catch(() => null)
                return rejectWithValue({
                    code: 'DELETE_ACCOUNT_ERROR',
                    message: extractAbpError(errorData, "We couldn't delete your account. Please try again."),
                })
            }

            await clearCredentialsFromSecureStore()

            return { message: 'Account deleted successfully' }
        } catch (error) {
            return rejectWithValue({
                code: 'NETWORK_ERROR',
                message: MSG_NETWORK,
            })
        }
    }
)

/**
 * Logout current user and clear secure storage
 * This is optimistic - the auth state is cleared immediately in the reducer,
 * while secure store clearing happens in the background to prevent blocking
 * the main thread on Android.
 */
const logout = createAsyncThunk<void, void>(
    'auth/logout',
    async () => {
        // Fire-and-forget: don't wait for secure store operations to complete.
        // They should complete but won't block navigation on Android.
        clearCredentialsFromSecureStore().catch((err) => {
            console.error('[Logout] Failed to clear secure store:', err)
        })
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
        let user = JSON.parse(storedUser)
        const expiresIn = storedExpiresIn ? parseInt(storedExpiresIn) : 0

        console.log('[AUTH] Restoring user from SecureStore:', { id: user.id, email: user.email, sdfId: user.sdfId })

        // Ensure sdfId is undefined so it will be refetched
        if (user.sdfId) {
            console.log('[AUTH] Clearing stale sdfId from restored user:', user.sdfId)
            user.sdfId = undefined
        }

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
        clearResetPasswordError: (state) => {
            state.resetPasswordOp.error = null
        },
        clearVerifyOtpError: (state) => {
            state.verifyOtpOp.error = null
        },
        clearChangePasswordError: (state) => {
            state.changePasswordOp.error = null
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
                state.error = null
                // Only mark as authenticated if auto-login succeeded and we have a real token
                if (action.payload.accessToken) {
                    state.token = action.payload.accessToken
                    state.refreshToken = action.payload.refreshToken || null
                    state.expiresIn = action.payload.expiresIn
                    state.isAuthenticated = true
                    saveCredentialsToSecureStore(action.payload.user, action.payload.accessToken, action.payload.refreshToken, action.payload.expiresIn)
                }
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
                state.resetPasswordOp = { loading: true, error: null }
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetPasswordOp = { loading: false, error: null }
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetPasswordOp = {
                    loading: false,
                    error: action.payload || {
                        code: 'RESET_PASSWORD_ERROR',
                        message: 'Password reset failed',
                    },
                }
            })

        // Verify OTP
        builder
            .addCase(verifyOtp.pending, (state) => {
                state.verifyOtpOp = { loading: true, error: null }
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.verifyOtpOp = { loading: false, error: null }
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.verifyOtpOp = {
                    loading: false,
                    error: action.payload || {
                        code: 'OTP_VERIFICATION_ERROR',
                        message: 'OTP verification failed',
                    },
                }
            })

        // Change Password
        builder
            .addCase(changePassword.pending, (state) => {
                state.changePasswordOp = { loading: true, error: null }
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.changePasswordOp = { loading: false, error: null }
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changePasswordOp = {
                    loading: false,
                    error: action.payload || {
                        code: 'CHANGE_PASSWORD_ERROR',
                        message: 'Password change failed',
                    },
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
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || {
                    code: 'DELETE_ACCOUNT_ERROR',
                    message: 'Account deletion failed',
                }
            })

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logout.fulfilled, (state) => {
                resetAuthState(state)
                // Ensure loading is false explicitly
                state.isLoading = false
            })
            .addCase(logout.rejected, (state) => {
                resetAuthState(state)
                // Even on rejection, ensure we're logged out and loading is false
                state.isLoading = false
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
                console.log('[AUTH] fetchPersonBySdfId fulfilled with payload:', action.payload)
                if (state.user && action.payload !== null) {
                    console.log('[AUTH] Setting sdfId from', state.user.sdfId, 'to', action.payload)
                    state.user.sdfId = action.payload
                    console.log('[AUTH] After setting, sdfId is now:', state.user.sdfId)
                }
            })
            .addCase(fetchPersonBySdfId.rejected, (state, action) => {
                console.warn('Failed to fetch SDF ID:', action.payload)
                // Don't fail authentication if SDF ID fetch fails
            })
    },
})

export const {
    setCredentials,
    clearError,
    clearResetPasswordError,
    clearVerifyOtpError,
    clearChangePasswordError,
} = authSlice.actions

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
    logout,
}

/**
 * Save credentials to secure storage
 * NOTE: We don't save sdfId because it should be refetched after session restore
 */
function saveCredentialsToSecureStore(
    user: UserDto,
    token: string,
    refreshToken?: string,
    expiresIn?: number
) {
    // Create a copy of user without sdfId to avoid saving a potentially stale value
    const userToSave = { ...user, sdfId: undefined };
    console.log('[AUTH] Saving user to SecureStore:', { ...userToSave, password: '[hidden]' })
    SecureStore.setItemAsync('user', JSON.stringify(userToSave)).catch((error) =>
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
async function clearCredentialsFromSecureStore() {
    const keys: Array<'user' | 'accessToken' | 'refreshToken' | 'expiresIn'> = [
        'user',
        'accessToken',
        'refreshToken',
        'expiresIn',
    ]

    const results = await Promise.allSettled(
        keys.map((key) => SecureStore.deleteItemAsync(key))
    )

    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`Failed to delete ${keys[index]} from secure store:`, result.reason)
        }
    })
}

/**
 * Validate and decode JWT token
 * Returns the decoded payload if valid, null if invalid
 */
function decodeJWT(token: string): Record<string, any> | null {
    if (!token) return null

    try {
        // Validate token format (should have 3 parts separated by dots)
        const parts = token.split('.')
        if (parts.length !== 3) {
            console.warn('[JWT] Invalid token format: expected 3 parts, got', parts.length)
            return null
        }

        // Decode header
        const header = JSON.parse(atob(parts[0]))
        console.log('[JWT] Token header:', header)

        // Decode payload safely with padding
        const base64Url = parts[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4)
        const decodedStr = atob(paddedBase64)
        const payload = JSON.parse(decodedStr)

        console.log('[JWT] Token payload:', {
            sub: payload?.sub,
            exp: payload?.exp,
            iat: payload?.iat,
            issuer: payload?.iss,
        })

        // Check if token is expired
        if (payload?.exp) {
            const now = Math.floor(Date.now() / 1000)
            if (payload.exp < now) {
                console.warn('[JWT] Token is expired')
                return null
            }
        }

        return payload
    } catch (error) {
        console.error('[JWT] Failed to decode token:', error)
        return null
    }
}

/**
 * Helper function to extract expiry time from JWT token
 * Safely decodes JWT token and extracts exp claim
 */
function extractTokenExpiry(token?: string): number | null {
    if (!token) return null

    try {
        // Validate token format
        const parts = token.split('.')
        if (parts.length !== 3) {
            console.warn('Invalid JWT format: expected 3 parts, got', parts.length)
            return null
        }

        // Decode payload safely
        let payload
        try {
            // Add padding if necessary for base64 decoding
            const base64Url = parts[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4)
            const decodedStr = atob(paddedBase64)
            payload = JSON.parse(decodedStr)
        } catch (decodeError) {
            console.error('Failed to decode JWT payload:', decodeError)
            return null
        }

        const exp = payload?.exp
        if (typeof exp !== 'number') {
            console.warn('JWT token missing or invalid exp claim:', exp)
            return 3600 // Default to 1 hour if exp is missing
        }

        // Return seconds until expiry (subtract current time)
        const now = Math.floor(Date.now() / 1000)
        const secondsUntilExpiry = Math.max(exp - now, 0)

        console.log('[AUTH] Token expiry:', { exp, now, secondsUntilExpiry })

        return secondsUntilExpiry
    } catch (error) {
        console.error('Failed to extract token expiry:', error)
        return 3600 // Default fallback
    }
}
