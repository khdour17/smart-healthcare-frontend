export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type Credentials = {
  username: string;
  password: string;
};

export type AdminUser = Credentials & {
  email: string;
  name: string;
  department: string;
};

export type DoctorUser = Credentials & {
  email: string;
  name: string;
  specialty: string;
};

export type PatientUser = Credentials & {
  email: string;
  name: string;
  dateOfBirth: string;
  phone?: string;
  address?: string;
};

export type MenuExpectation = {
  shown: string[];
  hidden: string[];
};
