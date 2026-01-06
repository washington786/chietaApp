export type Province =
    | "Gauteng"
    | "Western Cape"
    | "KwaZulu-Natal"
    | "Eastern Cape"
    | "Limpopo"
    | "Mpumalanga"
    | "North West"
    | "Free State"
    | "Northern Cape"
    | "";

// User-related types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber?: string;
    isActive: boolean;
    isEmailConfirmed: boolean;
    creationTime?: string;
    lastModificationTime?: string;
}

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

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken?: string | null;
    expiresIn: number | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}
