import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    user: { id: string; name: string; email: string } | null;
    token: string | null;
    isLoading: boolean;
    error: null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    error: null,
    isLoading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setOrganization: (state, action) => {
            state.error = action.payload
        },
        logout: (state) => {
            state.user = null
            state.token = null
        },
    },
})

export const { setCredentials, setOrganization, logout } = authSlice.actions;

const AuthReducer = authSlice.reducer;

export default AuthReducer;