import type {
  LoginRequest,
  LoginResponse,
} from '../../types/auth.types';
import api from '../axios';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}