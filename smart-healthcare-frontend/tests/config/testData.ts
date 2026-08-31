import type {
  Credentials,
  MenuExpectation,
  UserRole,
} from '../types';
import { MENU_ITEMS } from './messages';

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
