import {
    login as loginThunk,
    register as registerThunk,
    resetPassword as resetPasswordThunk,
    verifyOtp as verifyOtpThunk,
    changePassword as changePasswordThunk,
    updateProfile as updateProfileThunk,
    deleteAccount as deleteAccountThunk,
    logout as logoutAction,
    restoreSession,
} from '@/store/slice/AuthSlice'
import { fetchPersonBySdfId } from '@/store/slice/thunks/OrganizationThunks'
import {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
    ChangePasswordRequest,
    UpdateProfileRequest,
} from '@/core/models/UserDto'

import useAppDispatch from '../useAppDispatch'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const UseAuth = () => {
    const dispatch = useAppDispatch()
    const { user, token } = useSelector((state: RootState) => state.auth)

    /**
     * Login with email and password
     * Dispatches login thunk and handles the async operation
     * Then fetches the SDF ID for the authenticated user
     */
    const login = async (payload: LoginRequest) => {
        console.log('[UseAuth] Login started');
        const result = await dispatch(loginThunk(payload))
        
        console.log('[UseAuth] Login result:', result.meta.requestStatus, result.payload?.user?.id);
        
        // If login was successful, fetch the SDF ID
        if (result.meta.requestStatus === 'fulfilled' && result.payload?.user?.id && result.payload?.accessToken) {
            console.log('[UseAuth] Fetching person SDF ID');
            await dispatch(fetchPersonBySdfId({
                userId: result.payload.user.id,
                token: result.payload.accessToken
            }))
        } else if (result.meta.requestStatus === 'rejected') {
            console.error('[UseAuth] Login rejected:', result.payload);
        }
        
        return result
    }

    /**
     * Register new user account
     * Dispatches register thunk and handles the async operation
     * Then fetches the SDF ID for the new user
     */
    const register = async (payload: RegisterRequest) => {
        const result = await dispatch(registerThunk(payload))
        
        // If registration was successful, fetch the SDF ID
        if (result.meta.requestStatus === 'fulfilled' && result.payload?.user?.id && result.payload?.accessToken) {
            await dispatch(fetchPersonBySdfId({
                userId: result.payload.user.id,
                token: result.payload.accessToken
            }))
        }
        
        return result
    }

    /**
     * Send password reset code to email
     * Dispatches resetPassword thunk and handles the async operation
     */
    const resetPassword = async (payload: ResetPasswordRequest) => {
        return dispatch(resetPasswordThunk(payload))
    }

    /**
     * Verify OTP and reset password
     * Dispatches verifyOtp thunk with OTP code and new password
     */
    const verifyOtp = async (payload: VerifyOtpRequest & { newPassword: string }) => {
        return dispatch(verifyOtpThunk(payload))
    }

    /**
     * Change password for authenticated user
     * Requires old password and new password
     */
    const changePassword = async (payload: ChangePasswordRequest) => {
        return dispatch(changePasswordThunk(payload))
    }

    /**
     * Update user profile information
     * Updates firstName, lastName, username, and email
     */
    const updateProfile = async (payload: UpdateProfileRequest) => {
        return dispatch(updateProfileThunk(payload))
    }

    /**
     * Logout user and clear authentication state
     * Clears user, token, and auth state
     */
    const logout = () => {
        dispatch(logoutAction())
    }

    /**
     * Restore user session from secure storage
     * Called on app startup to check if user is still logged in
     * Also fetches the SDF ID for the restored user
     */
    const restoreUserSession = async () => {
        const result = await dispatch(restoreSession())
        
        // If session was restored successfully, fetch the SDF ID
        if (result.meta.requestStatus === 'fulfilled' && result.payload?.user?.id && result.payload?.token) {
            await dispatch(fetchPersonBySdfId({
                userId: result.payload.user.id,
                token: result.payload.token
            }))
        }
        
        return result
    }

    /**
     * Delete user account permanently
     * User cannot login again after account deletion
     */
    const deleteAccount = async () => {
        return dispatch(deleteAccountThunk())
    }

    return {
        login,
        register,
        resetPassword,
        verifyOtp,
        changePassword,
        updateProfile,
        logout,
        restoreUserSession,
        deleteAccount,
    }
}

export default UseAuth
