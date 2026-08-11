import type { AppointmentStatus } from '../../types/common';
import httpClient from '../../utils/httpClient';

export interface AppointmentRequest {
  doctorId: number;
  appointmentDate: string;
  startTime: string;
  reason?: string;
}

export interface AppointmentResponse {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason: string | null;
  notes: string | null;
}

export interface AvailableSlotResponse {
  doctorId: number;
  doctorName: string;
  slotDate: string;
  startTime: string;
  endTime: string;
}

export async function getPatientAppointments(patientId: number): Promise<AppointmentResponse[]> {
  const response = await httpClient.get<AppointmentResponse[]>(`/appointments/patient/${patientId}`);
  return response.data;
}

export async function getDoctorAppointments(doctorId: number): Promise<AppointmentResponse[]> {
  const response = await httpClient.get<AppointmentResponse[]>(`/appointments/doctor/${doctorId}`);
  return response.data;
}

export async function getAvailableSlots(doctorId: number, date: string): Promise<AvailableSlotResponse[]> {
  const response = await httpClient.get<AvailableSlotResponse[]>('/appointments/available-slots', {
    params: { doctorId, date },
  });
  return response.data;
}

export async function bookAppointment(patientId: number, data: AppointmentRequest): Promise<AppointmentResponse> {
  const response = await httpClient.post<AppointmentResponse>(`/appointments/patient/${patientId}`, data);
  return response.data;
}

export async function cancelAppointment(id: number): Promise<void> {
  await httpClient.patch(`/appointments/${id}/cancel`);
}
