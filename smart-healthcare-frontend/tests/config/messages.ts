export const FIELD_LABELS = {
  USERNAME: 'Username',
  PASSWORD: 'Password',
};

export const BUTTONS = {
  BACK_TO_DASHBOARD: 'Back to Dashboard',
};

export const USER_MENU_ITEMS = {
  LOGOUT: 'Logout',
};

export const MENU_ITEMS = {
  DASHBOARD: 'Dashboard',
  DOCTORS: 'Doctors',
  PATIENTS: 'Patients',
  ADMINS: 'Admins',
  APPOINTMENTS: 'Appointments',
  WORK_HOURS: 'Work Hours',
  PRESCRIPTIONS: 'Prescriptions',
  DOCTOR_MEDICAL_RECORDS: 'Medical Records',
  PATIENT_MEDICAL_RECORD: 'Medical Record',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

export const TEXTS = {
  GREETING_PREFIX: 'Hello',
  WELCOME_PREFIX: 'Welcome,',
  NOT_FOUND_TITLE: '404',
  NOT_FOUND_MESSAGE: "This page doesn't exist.",
};

export function greetingText(username: string): string {
  return `${TEXTS.GREETING_PREFIX} ${username}`;
}

export function welcomeText(username: string): string {
  return `${TEXTS.WELCOME_PREFIX} ${username}`;
}
