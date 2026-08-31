import type {
  Credentials,
  MenuExpectation,
  UserRole,
} from '../types';
import { FIELD_LABELS, MENU_ITEMS } from './messages';

export const USERS: Record<UserRole, Credentials> = {
  ADMIN: { username: 'admin', password: 'admin123' },
  DOCTOR: { username: 'dr_smith', password: 'doctor123' },
  PATIENT: { username: 'john_doe', password: 'patient123' },
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

function uniqueUsername(prefix: string): string {
  const unique = `${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)}`;
  return `${prefix}_${unique}`;
}

export function newDoctor(overrides: Record<string, string> = {}): Record<string, string> {
  const username = uniqueUsername('doctor');

  return {
    [FIELD_LABELS.USERNAME]: username,
    [FIELD_LABELS.EMAIL]: `${username}@test.com`,
    [FIELD_LABELS.PASSWORD]: 'doctor123',
    [FIELD_LABELS.FULL_NAME]: 'Test Doctor',
    [FIELD_LABELS.SPECIALTY]: 'Cardiology',
    ...overrides,
  };
}

export function newPatient(overrides: Record<string, string> = {}): Record<string, string> {
  const username = uniqueUsername('patient');

  return {
    [FIELD_LABELS.USERNAME]: username,
    [FIELD_LABELS.EMAIL]: `${username}@test.com`,
    [FIELD_LABELS.PASSWORD]: 'patient123',
    [FIELD_LABELS.FULL_NAME]: 'Test Patient',
    [FIELD_LABELS.DATE_OF_BIRTH]: '1990-05-15',
    [FIELD_LABELS.PHONE]: '0790000000',
    [FIELD_LABELS.ADDRESS]: 'Amman',
    ...overrides,
  };
}

export function newAdmin(overrides: Record<string, string> = {}): Record<string, string> {
  const username = uniqueUsername('admin');

  return {
    [FIELD_LABELS.USERNAME]: username,
    [FIELD_LABELS.EMAIL]: `${username}@test.com`,
    [FIELD_LABELS.PASSWORD]: 'admin123',
    [FIELD_LABELS.FULL_NAME]: 'Test Admin',
    [FIELD_LABELS.DEPARTMENT]: 'IT',
    ...overrides,
  };
}
