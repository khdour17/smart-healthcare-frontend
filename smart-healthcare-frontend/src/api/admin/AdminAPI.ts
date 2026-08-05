import httpClient from '../../utils/httpClient';

export interface AdminResponse {
  id: number;
  name: string;
  department: string;
  username: string;
  email: string;
}

export async function getAllAdmins(): Promise<AdminResponse[]> {
  const response = await httpClient.get<AdminResponse[]>('/admin');
  return response.data;
}