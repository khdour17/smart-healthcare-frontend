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

export async function deletePatients(ids: number[]): Promise<void> {
  if (ids.length === 1) {
    await httpClient.delete(`/patients/${ids[0]}`);
    return;
  }

  await httpClient.delete('/patients', {
    data: ids,
  });
}

export async function getPatientById(id: number): Promise<PatientResponse> {
  const response = await httpClient.get<PatientResponse>('/patients/search', {
    params: { id },
  });
  return response.data;
}

interface PatientProfileRequest {
  name: string;
  dateOfBirth: string;
  phone?: string;
  address?: string;
}

export async function updatePatient(id: number, request: PatientProfileRequest): Promise<PatientResponse> {
  const response = await httpClient.put<PatientResponse>(`/patients/${id}`, request);
  return response.data;
}
