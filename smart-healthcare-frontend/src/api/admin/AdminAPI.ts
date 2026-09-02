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

export async function deleteAdmins(ids: number[]): Promise<void> {
  if (ids.length === 1) {
    await httpClient.delete(`/admin/${ids[0]}`);
    return;
  }

  await httpClient.delete('/admin', {
    data: ids,
  });
}

export async function getAdminById(id: number): Promise<AdminResponse> {
  const response = await httpClient.get<AdminResponse>('/admin/search', {
    params: { id },
  });
  return response.data;
}
