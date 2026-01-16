/**
 * User Data Transfer Object
 * Represents user authentication and profile information
 */

export interface UserRole {
    id: string;
    name: string;
    description?: string;
}

export interface UserPermission {
    id: string;
    name: string;
    resource: string;
}

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber?: string;
    sdfId?: number;
    isActive: boolean;
    isEmailConfirmed: boolean;
    creationTime?: string;
    lastModificationTime?: string;
    roles?: UserRole[];
    permissions?: UserPermission[];
}

export interface AuthTokenResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    tokenType: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    user: UserDto;
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface RegisterResponse {
    user: UserDto;
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

export interface UpdateProfileRequest {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}

export interface AuthError {
    code: string;
    message: string;
    details?: Record<string, string>;
}
