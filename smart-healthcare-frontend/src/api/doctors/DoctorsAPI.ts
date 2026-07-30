import httpClient from '../../utils/httpClient';

export interface DoctorResponse {
  id: number;
  name: string;
  specialty: string;
  username: string;
  email: string;
}

export async function getAllDoctors(): Promise<DoctorResponse[]> {
  const response = await httpClient.get<DoctorResponse[]>('/doctors');
  return response.data;
}