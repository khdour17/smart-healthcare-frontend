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

export async function deleteDoctors(ids: number[]): Promise<void> {
  if (ids.length === 1) {
    await httpClient.delete(`/doctors/${ids[0]}`);
    return;
  }

  await httpClient.delete('/doctors', {
    data: ids,
  });
}

export async function getDoctorById(id: number): Promise<DoctorResponse> {
  const response = await httpClient.get<DoctorResponse>('/doctors/search', {
    params: { id },
  });
  return response.data;
}

interface DoctorProfileRequest {
  name: string;
  specialty: string;
}

export async function updateDoctor(id: number, request: DoctorProfileRequest): Promise<DoctorResponse> {
  const response = await httpClient.put<DoctorResponse>(`/doctors/${id}`, request);
  return response.data;
}
