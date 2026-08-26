export const BASE_URL = 'http://localhost:5173';

export const API_URL = 'http://localhost:8080';

export const API_PATHS = {
  LOGIN: '/api/auth/login',
  REGISTER_ADMIN: '/api/auth/register/admin',
  REGISTER_DOCTOR: '/api/auth/register/doctor',
  REGISTER_PATIENT: '/api/auth/register/patient',
  ADMINS: '/api/admin',
  DOCTORS: '/api/doctors',
  PATIENTS: '/api/patients',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN_DOCTORS: '/dashboard/doctors',
  ADMIN_PATIENTS: '/dashboard/patients',
  ADMIN_ADMINS: '/dashboard/admins',
  DOCTOR_SCHEDULE: '/dashboard/schedule',
  DOCTOR_WORK_HOURS: '/dashboard/availability',
  DOCTOR_PRESCRIPTIONS: '/dashboard/prescribed',
  DOCTOR_MEDICAL_RECORDS: '/dashboard/records',
  PATIENT_APPOINTMENTS: '/dashboard/appointments',
  PATIENT_PRESCRIPTIONS: '/dashboard/prescriptions',
  PATIENT_MEDICAL_RECORD: '/dashboard/medical-record',
  UNKNOWN: '/dashboard/some-random-page',
};
