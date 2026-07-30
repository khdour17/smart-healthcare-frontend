import httpClient from '../../utils/httpClient';

export interface PatientResponse {
  id: number;
  name: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  username: string;
  email: string;
}

export async function getAllPatients(): Promise<PatientResponse[]> {
  const response = await httpClient.get<PatientResponse[]>('/patients');
  return response.data;
}