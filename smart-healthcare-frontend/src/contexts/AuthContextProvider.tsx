import {
  type ReactNode,
  useMemo,
  useState,
} from 'react';

import { login as loginApi } from '../api/auth/auth.api';
import type { AuthUser } from '../types/auth.types';
import {
  clearSession,
  getStoredUser,
  getToken,
  isTokenExpired,
  saveSession,
} from '../utils/authStorage';
import { AuthContext } from './AuthContext';

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

  async function login(username: string, password: string) {
    const response = await loginApi({ username, password });
    const authUser: AuthUser = {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
    };
    saveSession(response.token, authUser);
    setUser(authUser);
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}