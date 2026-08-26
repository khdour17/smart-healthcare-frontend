import type {
  Credentials,
  MenuExpectation,
  UserRole,
} from '../types';
import { MENU_ITEMS } from './messages';

export const BOOTSTRAP_ADMIN: Credentials = {
  username: 'admin',
  password: 'admin123',
};

export const DEFAULT_PASSWORD = 'Test1234';

export const EMAIL_DOMAIN = 'e2e.test';

export const USERNAME_PREFIXES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
};

export const BASE_ADMIN = {
  name: 'TestAdmin',
  department: 'IT',
};

export const BASE_DOCTOR = {
  name: 'TestDoctor',
  specialty: 'Cardiology',
};

export const BASE_PATIENT = {
  name: 'TestPatient',
  dateOfBirth: '1990-01-01',
  phone: '0790000000',
  address: 'Hebron, Palestine',
};

export const UNKNOWN_USER: Credentials = {
  username: 'ghost_user',
  password: 'anything',
};

export const WRONG_PASSWORD = 'wrongpass';

export const EXPECTED_MENU_BY_ROLE: Record<UserRole, MenuExpectation> = {
  ADMIN: {
    shown: [
      MENU_ITEMS.DASHBOARD,
      MENU_ITEMS.DOCTORS,
      MENU_ITEMS.PATIENTS,
      MENU_ITEMS.ADMINS,
      MENU_ITEMS.SETTINGS,
    ],
    hidden: [
      MENU_ITEMS.APPOINTMENTS,
      MENU_ITEMS.WORK_HOURS,
      MENU_ITEMS.PRESCRIPTIONS,
      MENU_ITEMS.PATIENT_MEDICAL_RECORD,
    ],
  },
  DOCTOR: {
    shown: [
      MENU_ITEMS.DASHBOARD,
      MENU_ITEMS.APPOINTMENTS,
      MENU_ITEMS.WORK_HOURS,
      MENU_ITEMS.PRESCRIPTIONS,
      MENU_ITEMS.DOCTOR_MEDICAL_RECORDS,
      MENU_ITEMS.PROFILE,
      MENU_ITEMS.SETTINGS,
    ],
    hidden: [
      MENU_ITEMS.DOCTORS,
      MENU_ITEMS.PATIENTS,
      MENU_ITEMS.ADMINS,
    ],
  },
  PATIENT: {
    shown: [
      MENU_ITEMS.DASHBOARD,
      MENU_ITEMS.APPOINTMENTS,
      MENU_ITEMS.PRESCRIPTIONS,
      MENU_ITEMS.PATIENT_MEDICAL_RECORD,
      MENU_ITEMS.PROFILE,
      MENU_ITEMS.SETTINGS,
    ],
    hidden: [
      MENU_ITEMS.WORK_HOURS,
      MENU_ITEMS.DOCTORS,
      MENU_ITEMS.PATIENTS,
      MENU_ITEMS.ADMINS,
    ],
  },
};
