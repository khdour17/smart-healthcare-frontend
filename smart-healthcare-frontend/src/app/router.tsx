/* eslint-disable react-refresh/only-export-components */
import {
  lazy,
  Suspense,
} from 'react';

import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

const LoginPageLazy = lazy(() => import('../features/auth/LoginPage'));
const AdminDashboardLazy = lazy(() => import('../features/dashboard/AdminDashboard'));
const DoctorDashboardLazy = lazy(() => import('../features/dashboard/DoctorDashboard'));
const PatientDashboardLazy = lazy(() => import('../features/dashboard/PatientDashboard'));

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(<LoginPageLazy />),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            {withSuspense(<AdminDashboardLazy />)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctor',
        element: (
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            {withSuspense(<DoctorDashboardLazy />)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient',
        element: (
          <ProtectedRoute allowedRoles={['PATIENT']}>
            {withSuspense(<PatientDashboardLazy />)}
          </ProtectedRoute>
        ),
      },
    ],
  },
]);