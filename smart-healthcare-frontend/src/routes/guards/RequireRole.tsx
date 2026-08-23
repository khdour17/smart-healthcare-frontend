import { useContext } from 'react';

import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import {
  AuthContext,
  type UserRole,
} from '../../contexts/AuthContext';

interface RequireRoleProps {
  roles: UserRole[];
}

export function RequireRole({ roles }: RequireRoleProps) {
  const auth = useContext(AuthContext);
  if (!auth?.user || !roles.includes(auth.user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}