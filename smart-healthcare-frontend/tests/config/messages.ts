export const BUTTONS = {
  BACK_TO_DASHBOARD: 'Back to Dashboard',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  CREATE_DOCTOR: 'Create Doctor',
  CREATE_PATIENT: 'Create Patient',
  CREATE_ADMIN: 'Create Admin',
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

export const PAGE_TITLES = {
  DOCTORS: 'Doctors',
  PATIENTS: 'Patients',
  ADMINS: 'Admins',
};

export const FIELD_LABELS = {
  USERNAME: 'Username',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  FULL_NAME: 'Full Name',
  SPECIALTY: 'Specialty',
  DEPARTMENT: 'Department',
  DATE_OF_BIRTH: 'Date of Birth',
  PHONE: 'Phone',
  ADDRESS: 'Address',
};

export const TEXTS = {
  GREETING_PREFIX: 'Hello',
  WELCOME_PREFIX: 'Welcome,',
  LOGIN_ERROR_MESSAGE: 'Invalid username or password.',
  NOT_FOUND_TITLE: '404',
  NOT_FOUND_MESSAGE: "This page doesn't exist.",
  CREATE_DOCTOR_ERROR: 'Could not create doctor. Check the details and try again.',
  DELETE_OWN_ADMIN_ERROR: 'You can not delete your own admin account',
};

export function greetingText(username: string): string {
  return `${TEXTS.GREETING_PREFIX} ${username}`;
}

export function welcomeText(username: string): string {
  return `${TEXTS.WELCOME_PREFIX} ${username}`;
}

export function selectedCountText(count: number): string {
  return `${count} selected`;
}
