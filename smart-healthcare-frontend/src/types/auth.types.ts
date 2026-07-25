export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}