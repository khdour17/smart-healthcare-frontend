import type { UserRole } from '../../contexts/AuthContext';
import httpClient from '../../utils/httpClient';

export interface LoginRequest { username: string; password: string; }

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: UserRole;
  roleEntityId: number;
}

export async function loginRequest(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}