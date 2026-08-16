import httpClient from '../../utils/httpClient';

export interface PrescriptionResponse {
  id: string;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  prescriptionDate: string;
  medicines: string[];
  diagnosis: string | null;
  instructions: string | null;
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
