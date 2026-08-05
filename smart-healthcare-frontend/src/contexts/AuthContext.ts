import { createContext } from 'react';

export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  roleEntityId: number;
}

export interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);