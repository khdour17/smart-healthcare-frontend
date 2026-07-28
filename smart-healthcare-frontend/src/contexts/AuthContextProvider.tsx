import {
  type ReactNode,
  useMemo,
  useState,
} from 'react';

import {
  clearSession,
  getStoredUser,
  getToken,
  isTokenExpired,
} from '../utils/authStorage';
import {
  AuthContext,
  type AuthUser,
} from './AuthContext';

function getInitialUser(): AuthUser | null {
  const token = getToken();
  const storedUser = getStoredUser();
  if (token && storedUser && !isTokenExpired(token)) {
    return storedUser;
  }
  clearSession();
  return null;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);
  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}