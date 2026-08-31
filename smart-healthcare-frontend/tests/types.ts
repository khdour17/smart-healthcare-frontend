export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type Credentials = {
  username: string;
  password: string;
};

export type MenuExpectation = {
  shown: string[];
  hidden: string[];
};
