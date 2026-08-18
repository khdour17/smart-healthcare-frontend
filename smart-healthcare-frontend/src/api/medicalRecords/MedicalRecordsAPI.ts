import type { AppointmentResponse } from '../appointments/AppointmentsAPI';
import type { PrescriptionResponse } from '../prescriptions/PrescriptionsAPI';
import httpClient from '../../utils/httpClient';

export interface MedicalRecordRequest {
  patientId: number;
  recordDate: string;
  title: string;
  description?: string;
}

export interface MedicalRecordResponse {
  id: string;
  patientId: number;
  patientName: string;
  doctorName: string;
  recordDate: string;
  title: string;
  description: string | null;
}

export interface PatientHistoryResponse {
  patientId: number;
  patientName: string;
  entries: MedicalRecordResponse[];
  appointments: AppointmentResponse[];
  prescriptions: PrescriptionResponse[];
}

export async function getPatientHistory(patientId: number): Promise<PatientHistoryResponse> {
  const response = await httpClient.get<PatientHistoryResponse>(`/medical-records/patient/${patientId}`);
  return response.data;
}

export async function createMedicalRecord(data: MedicalRecordRequest): Promise<MedicalRecordResponse> {
  const response = await httpClient.post<MedicalRecordResponse>('/medical-records', data);
  return response.data;
}

export async function updateMedicalRecord(id: string, data: MedicalRecordRequest): Promise<MedicalRecordResponse> {
  const response = await httpClient.put<MedicalRecordResponse>(`/medical-records/${id}`, data);
  return response.data;
}

export async function deleteMedicalRecord(id: string): Promise<void> {
  await httpClient.delete(`/medical-records/${id}`);
}
