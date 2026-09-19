export type AuthMode = "signin" | "signup";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload{
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse{
    token: string;
    type: string;
    userId: number;
    username: string;
    email: string;
    role: string;
}