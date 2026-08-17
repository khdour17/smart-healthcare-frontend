import httpClient from '../../utils/httpClient';

export interface PrescriptionResponse {
  id: string;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  prescriptionDate: string;
  appointmentDate: string | null;
  medicines: string[];
  diagnosis: string | null;
  instructions: string | null;
}

export interface PrescriptionRequest {
  appointmentId: number;
  medicines: string[];
  diagnosis: string;
  instructions: string;
}

export async function createPrescription(data: PrescriptionRequest): Promise<PrescriptionResponse> {
  const response = await httpClient.post<PrescriptionResponse>('/prescriptions', data);
  return response.data;
}

export async function updatePrescription(id: string, data: PrescriptionRequest): Promise<PrescriptionResponse> {
  const response = await httpClient.put<PrescriptionResponse>(`/prescriptions/${id}`, data);
  return response.data;
}

export async function getPrescriptionByAppointment(appointmentId: number): Promise<PrescriptionResponse> {
  const response = await httpClient.get<PrescriptionResponse>('/prescriptions/appointment', {
    params: { appointmentId },
  });
  return response.data;
}

export async function getPatientPrescriptions(patientId: number): Promise<PrescriptionResponse[]> {
  const response = await httpClient.get<PrescriptionResponse[]>(`/prescriptions/patient/${patientId}`);
  return response.data;
}

export async function getDoctorPrescriptions(doctorId: number): Promise<PrescriptionResponse[]> {
  const response = await httpClient.get<PrescriptionResponse[]>(`/prescriptions/doctor/${doctorId}`);
  return response.data;
}
