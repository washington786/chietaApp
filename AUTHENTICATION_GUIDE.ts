// AUTHENTICATION IMPLEMENTATION GUIDE
// ====================================
//
// This file documents the newly implemented authentication system for CHIETA IMS integration.
//
// ## Architecture Overview
//
// The authentication system uses:
// - Redux Toolkit with async thunks for state management
// - RTK Query for API calls with automatic token refresh
// - Expo SecureStore for secure token storage (optional enhancement)
// - JWT token parsing for expiry handling
//
// ## API Endpoints Used
//
// Base URL: https://ims.chieta.org.za:22743
//
// Authentication:
// - POST /api/TokenAuth/Authenticate              (Login)
// - POST /api/services/app/Account/Register       (Register)
// - POST /api/TokenAuth/RefreshToken              (Refresh access token)
// - POST /api/services/app/Account/SendPasswordResetCode  (Reset password - send code)
// - POST /api/services/app/Account/ResetPassword  (Reset password - verify & set new)
// - POST /api/services/app/Account/ChangePassword (Change password - requires auth)
//
// ## State Management
//
// Redux Auth Slice: src/store/slice/AuthSlice.ts
//
// State Shape:
// {
//   auth: {
//     user: UserDto | null                    // Current authenticated user
//     token: string | null                    // JWT access token
//     refreshToken: string | null             // Refresh token for token renewal
//     expiresIn: number | null                // Seconds until token expiry
//     isLoading: boolean                      // Loading state for async operations
//     error: AuthError | null                 // Error details if operation fails
//     isAuthenticated: boolean                // Flag indicating authentication status
//   }
// }
//
// ## Usage Examples
//
// ### 1. LOGIN
// ============
//
// import UseAuth from '@/hooks/main/auth/UseAuth'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/store/store'
//
// const LoginScreen = () => {
//   const { login } = UseAuth()
//   const { isLoading, error } = useSelector((state: RootState) => state.auth)
//
//   const handleLogin = async () => {
//     try {
//       const result = await login({
//         email: 'user@example.com',
//         password: 'password123',
//         rememberMe: true
//       })
//
//       // Check if login was successful
//       if (result.type === 'auth/login/fulfilled') {
//         console.log('Login successful')
//         // Navigation will be handled based on isAuthenticated state
//       } else {
//         console.log('Login failed:', result.payload?.message)
//       }
//     } catch (error) {
//       console.error('Login error:', error)
//     }
//   }
//
//   return (
//     <View>
//       {error && <Text>Error: {error.message}</Text>}
//       {isLoading && <ActivityIndicator />}
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   )
// }
//
// ### 2. REGISTER
// ================
//
// const RegisterScreen = () => {
//   const { register } = UseAuth()
//
//   const handleRegister = async () => {
//     try {
//       const result = await register({
//         email: 'newuser@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//         username: 'johndoe',
//         password: 'SecurePass123!'
//       })
//
//       if (result.type === 'auth/register/fulfilled') {
//         console.log('Registration successful')
//       }
//     } catch (error) {
//       console.error('Registration error:', error)
//     }
//   }
// }
//
// ### 3. PASSWORD RESET (Two-Step Process)
// ==========================================
//
// Step 1: Send reset code to email
// const { resetPassword } = UseAuth()
// const result = await resetPassword({
//   email: 'user@example.com'
// })
// // User receives code via email
//
// Step 2: Verify code and set new password
// const { verifyOtp } = UseAuth()
// const result = await verifyOtp({
//   email: 'user@example.com',
//   otp: '123456',
//   newPassword: 'NewPassword123!'
// })
//
// ### 4. CHANGE PASSWORD (Authenticated User)
// =============================================
//
// const { changePassword } = UseAuth()
// const result = await changePassword({
//   oldPassword: 'CurrentPassword123!',
//   password: 'NewPassword123!',
//   confirmPassword: 'NewPassword123!'
// })
//
// ### 5. LOGOUT
// ==============
//
// const { logout } = UseAuth()
// logout() // Clears all auth state and tokens
//
// ### 6. CHECK AUTHENTICATION STATUS
// ====================================
//
// import { useSelector } from 'react-redux'
//
// const MyComponent = () => {
//   const { isAuthenticated, user, token } = useSelector(
//     (state: RootState) => state.auth
//   )
//
//   if (isAuthenticated && user) {
//     return <Text>Welcome, {user.firstName} {user.lastName}</Text>
//   }
//
//   return <Text>Please log in</Text>
// }
//
// ## Token Refresh Mechanism
// ===========================
//
// Token refresh is automatic and handled by RTK Query's baseQuery wrapper.
//
// Flow:
// 1. Client makes API request with access token
// 2. If response is 401 Unauthorized:
//    - baseQueryWithReauth attempts to refresh the token
//    - Uses refreshTokenThunk to call /api/TokenAuth/RefreshToken
//    - If refresh succeeds:
//      - New token is stored in state
//      - Original request is retried with new token
//    - If refresh fails:
//      - User is logged out
//      - Redirect to login screen
//
// ## Type Definitions
//
// All authentication types are defined in: src/core/models/UserDto.ts
//
// Key types:
// - UserDto: Complete user profile information
// - LoginRequest/LoginResponse: Login operation types
// - RegisterRequest/RegisterResponse: Registration types
// - AuthError: Error response format
//
// ## Security Considerations
//
// 1. HTTPS: All requests to ims.chieta.org.za:22743 use HTTPS
// 2. Credentials: Never store passwords locally; only store tokens
// 3. Token Storage: Currently using AsyncStorage (consider upgrading to expo-secure-store)
// 4. Refresh Tokens: Should be stored separately from access tokens
// 5. Token Expiry: Automatically handled; tokens are decoded to extract expiry time
//
// ## Future Enhancements
//
// 1. Move token storage to expo-secure-store for better security
// 2. Implement automatic token refresh before expiry (not just on 401)
// 3. Add biometric authentication support
// 4. Implement device tracking / session management
// 5. Add rate limiting for password reset attempts
// 6. Implement account lockout after failed login attempts
// 7. Add two-factor authentication support
//
// ## Error Handling
//
// Authentication errors follow this structure:
// {
//   code: string              // Error code (LOGIN_ERROR, NETWORK_ERROR, etc)
//   message: string           // Human-readable error message
//   details?: {               // Optional field-specific error details
//     [field]: string
//   }
// }
//
// Access error via Redux state:
// const { error } = useSelector((state: RootState) => state.auth)
// if (error) {
//   console.log(`${error.code}: ${error.message}`)
//   if (error.details) {
//     Object.entries(error.details).forEach(([field, message]) => {
//       console.log(`${field}: ${message}`)
//     })
//   }
// }
//
// ## Testing Checklist
//
// - [ ] Login with valid credentials
// - [ ] Login with invalid email/password
// - [ ] Register new account with all validations
// - [ ] Register with existing email
// - [ ] Password reset email sending
// - [ ] OTP verification and password reset
// - [ ] Change password with correct old password
// - [ ] Change password with incorrect old password
// - [ ] Token refresh on 401 response
// - [ ] Logout clears all auth state
// - [ ] Auth state persists after app reload
// - [ ] API requests include Bearer token in headers
//
// ## Files Modified
//
// 1. src/store/slice/AuthSlice.ts         - Auth state, thunks, reducers
// 2. src/store/api/api.ts                 - RTK Query with token refresh
// 3. src/hooks/main/auth/UseAuth.tsx      - Auth hook with thunk dispatchers
// 4. src/core/models/UserDto.ts           - User and auth DTOs
// 5. src/core/types/provTypes.ts          - Type definitions
//
// ## Next Steps
//
// 1. Test authentication flows with actual API
// 2. Update login/register screens to use new hooks
// 3. Implement navigation based on isAuthenticated state
// 4. Add global error handling for auth failures
// 5. Set up automatic token refresh 5 minutes before expiry
// 6. Migrate to secure token storage
