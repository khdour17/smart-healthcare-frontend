// RequireRole.tsx — not wired into the router yet; ready for e.g. an
// Admin-only "/dashboard/doctors" management route in a later phase.
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