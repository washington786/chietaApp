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
import {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
    ChangePasswordRequest,
    UpdateProfileRequest,
} from '@/core/models/UserDto'

import useAppDispatch from '../useAppDispatch'

const UseAuth = () => {
    const dispatch = useAppDispatch()

    /**
     * Login with email and password
     * Dispatches login thunk and handles the async operation
     */
    const login = async (payload: LoginRequest) => {
        return dispatch(loginThunk(payload))
    }

    /**
     * Register new user account
     * Dispatches register thunk and handles the async operation
     */
    const register = async (payload: RegisterRequest) => {
        return dispatch(registerThunk(payload))
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
     */
    const restoreUserSession = async () => {
        return dispatch(restoreSession())
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
