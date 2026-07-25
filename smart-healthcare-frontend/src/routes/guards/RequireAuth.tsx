import { useContext } from 'react';

import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';

export function RequireAuth() {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}