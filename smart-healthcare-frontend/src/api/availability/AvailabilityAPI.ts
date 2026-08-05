import httpClient from '../../utils/httpClient';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface DoctorAvailabilityRequest {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export interface DoctorAvailabilityResponse {
  id: number;
  doctorId: number;
  doctorName: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export async function setAvailability(doctorId: number, data: DoctorAvailabilityRequest): Promise<DoctorAvailabilityResponse> {
  const response = await httpClient.post<DoctorAvailabilityResponse>(`/availability/doctor/${doctorId}`, data);
  return response.data;
}

export async function getDoctorAvailability(doctorId: number): Promise<DoctorAvailabilityResponse[]> {
  const response = await httpClient.get<DoctorAvailabilityResponse[]>(`/availability/doctor/${doctorId}`);
  return response.data;
}

export async function deleteAvailability(id: number): Promise<void> {
  await httpClient.delete(`/availability/${id}`);
}