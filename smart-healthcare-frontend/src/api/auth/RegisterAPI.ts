import httpClient from '../../utils/httpClient';

export interface RegisterAdminRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  department: string;
}
export interface RegisterDoctorRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  specialty: string;
}
export interface RegisterPatientRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  dateOfBirth: string;
  phone?: string;
  address?: string;
}

export async function registerAdmin(data: RegisterAdminRequest): Promise<void> {
  await httpClient.post('/auth/register/admin', data);
}
export async function registerDoctor(data: RegisterDoctorRequest): Promise<void> {
  await httpClient.post('/auth/register/doctor', data);
}
export async function registerPatient(data: RegisterPatientRequest): Promise<void> {
  await httpClient.post('/auth/register/patient', data);
}