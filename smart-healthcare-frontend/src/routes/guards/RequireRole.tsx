import { useContext } from 'react';

import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/auth.types';

interface RequireRoleProps {
  roles: UserRole[];
}

export function RequireRole({ roles }: RequireRoleProps) {
  const auth = useContext(AuthContext);

  if (!auth?.user || !roles.includes(auth.user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}