import {
    login as loginThunk,
    register as registerThunk,
    resetPassword as resetPasswordThunk,
    verifyOtp as verifyOtpThunk,
    changePassword as changePasswordThunk,
    logout as logoutAction,
} from '@/store/slice/AuthSlice'
import {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
    ChangePasswordRequest,
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
     * Logout user and clear authentication state
     * Clears user, token, and auth state
     */
    const logout = () => {
        dispatch(logoutAction())
    }

    return {
        login,
        register,
        resetPassword,
        verifyOtp,
        changePassword,
        logout,
    }
}

export default UseAuth
