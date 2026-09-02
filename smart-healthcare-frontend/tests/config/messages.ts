export const BUTTONS = {
  BACK_TO_DASHBOARD: 'Back to Dashboard',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  CREATE_DOCTOR: 'Create Doctor',
  CREATE_PATIENT: 'Create Patient',
  CREATE_ADMIN: 'Create Admin',
  SAVE: 'Save',
  SAVE_CHANGES: 'Save Changes',
  ADD_ENTRY: 'Add Entry',
  THIS_WEEK: 'This week',
  BOOK_APPOINTMENT: 'Book Appointment',
  CANCEL_APPOINTMENT: 'Cancel appointment',
  KEEP_IT: 'Keep it',
  COMPLETE: 'Complete',
  SAVE_PRESCRIPTION: 'Save Prescription',
  GO_TO_PROFILE: 'Go to Profile',
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
  CLOSE: 'Close',
  EXPAND_MENU: 'Expand the menu',
  COLLAPSE_MENU: 'Collapse the menu',
};

export const PAGE_TITLES = {
  DOCTORS: 'Doctors',
  PATIENTS: 'Patients',
  ADMINS: 'Admins',
  WORK_HOURS: 'Work Hours',
  APPOINTMENTS: 'Appointments',
  MEDICAL_RECORDS: 'Medical Records',
  PRESCRIPTIONS: 'Prescriptions',
  MY_APPOINTMENTS: 'My Appointments',
  MY_PRESCRIPTIONS: 'My Prescriptions',
  MY_MEDICAL_RECORD: 'My Medical Record',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
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
  TIME: 'Time',
  REASON: 'Reason',
  PATIENT: 'Patient',
};

export const STATUSES = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const RECORD_FILTERS = {
  ALL: 'All',
  ENTRIES: 'Entries',
  VISITS: 'Visits',
  PRESCRIPTIONS: 'Prescriptions',
};

export const TEXTS = {
  GREETING_PREFIX: 'Hello',
  LOGIN_ERROR_MESSAGE: 'Invalid username or password.',
  NOT_FOUND_TITLE: '404',
  NOT_FOUND_MESSAGE: "This page doesn't exist.",
  CREATE_DOCTOR_ERROR: 'Could not create doctor. Check the details and try again.',
  DELETE_OWN_ADMIN_ERROR: 'You can not delete your own admin account',
  WORK_HOURS_SAVED: 'Work hours saved.',
  WORK_HOURS_REMOVED: 'Work hours removed.',
  RECORD_ENTRY_SAVED: 'Record entry saved.',
  RECORD_ENTRY_DELETED: 'Record entry deleted.',
  PROFILE_SAVED: 'Profile saved.',
  APPOINTMENT_BOOKED: 'Appointment booked.',
  APPOINTMENT_CANCELLED: 'Appointment cancelled.',
  APPOINTMENT_DETAILS: 'Appointment Details',
  PRESCRIPTION_DETAILS: 'Prescription Details',
  APPOINTMENT_DELETED: 'Appointment deleted.',
  APPOINTMENT_COMPLETED: 'Appointment completed.',
  PRESCRIPTION_SAVED: 'Prescription saved.',
  PRESCRIPTION_DELETED: 'Prescription deleted.',
  NOTHING_OF_THIS_TYPE: 'Nothing of this type recorded yet.',
  ADMIN_PROFILE_HINT: 'An admin account is changed by another admin from the Admins page.',
  APPOINTMENT_WITH: 'Appointment with',
  PRESCRIPTION_FROM: 'Prescription from',
};

export function doctorNotAvailableMessage(dayName: string): string {
  return `Doctor not available on ${dayName}`;
}

export function cancelAppointmentMessage(doctorName: string, date: string, startTime: string): string {
  return `Cancel your appointment with ${doctorName} on ${date} at ${startTime}?`;
}

export function greetingText(username: string): string {
  return `${TEXTS.GREETING_PREFIX} ${username}`;
}

export function selectedCountText(count: number): string {
  return `${count} selected`;
}
