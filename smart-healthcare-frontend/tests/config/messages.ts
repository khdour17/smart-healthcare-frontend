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

export const ICON_BUTTONS = {
  DELETE_SELECTED: 'Delete selected',
  CLEAR_SELECTION: 'Clear selection',
  VIEW_DETAILS: 'View details',
  COMPLETE_APPOINTMENT: 'Complete appointment',
  ADD_PRESCRIPTION: 'Add prescription',
  EDIT_PRESCRIPTION: 'Edit prescription',
  DELETE_PRESCRIPTION: 'Delete prescription',
  CANCEL_APPOINTMENT: 'Cancel appointment',
  DELETE_APPOINTMENT: 'Delete appointment',
  EDIT_ENTRY: 'Edit entry',
  DELETE_ENTRY: 'Delete entry',
  CALENDAR_VIEW: 'Calendar view',
  LIST_VIEW: 'List view',
  PREVIOUS_WEEK: 'Previous week',
  NEXT_WEEK: 'Next week',
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
  DAY_OF_WEEK: 'Day of Week',
  START_TIME: 'Start Time',
  END_TIME: 'End Time',
  SLOT_DURATION: 'Slot Duration (minutes)',
  NOTES: 'Notes',
  MEDICINES: 'Medicines',
  DIAGNOSIS: 'Diagnosis',
  INSTRUCTIONS: 'Instructions',
  TITLE: 'Title',
  DESCRIPTION: 'Description',
  DATE: 'Date',
  DOCTOR: 'Doctor',
  SPECIALTY_FILTER: 'Specialty',
  TIME: 'Time',
  REASON: 'Reason',
  PATIENT: 'Patient',
};

export const TEXTS = {
  GREETING_PREFIX: 'Hello',
  LOGIN_ERROR_MESSAGE: 'Invalid username or password.',
  NOT_FOUND_TITLE: '404',
  NOT_FOUND_MESSAGE: "This page doesn't exist.",
  CREATE_DOCTOR_ERROR: 'Could not create doctor. Check the details and try again.',
  DELETE_OWN_ADMIN_ERROR: 'You can not delete your own admin account',
};

export function greetingText(username: string): string {
  return `${TEXTS.GREETING_PREFIX} ${username}`;
}

export function selectedCountText(count: number): string {
  return `${count} selected`;
}
