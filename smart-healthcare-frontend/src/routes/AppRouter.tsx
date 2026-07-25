import {
  lazy,
  Suspense,
} from 'react';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import { RequireAuth } from './guards/RequireAuth';
import { RequireRole } from './guards/RequireRole';

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout/DashboardLayout'));
const AdminDashboardPage = lazy(() => import('../pages/dashboard/AdminDashboardPage/AdminDashboardPage'));
const DoctorDashboardPage = lazy(() => import('../pages/dashboard/DoctorDashboardPage/DoctorDashboardPage'));
const PatientDashboardPage = lazy(() => import('../pages/dashboard/PatientDashboardPage/PatientDashboardPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route element={<RequireRole roles={['ADMIN']} />}>
                <Route path="admin" element={<AdminDashboardPage />} />
              </Route>
              <Route element={<RequireRole roles={['DOCTOR']} />}>
                <Route path="doctor" element={<DoctorDashboardPage />} />
              </Route>
              <Route element={<RequireRole roles={['PATIENT']} />}>
                <Route path="patient" element={<PatientDashboardPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}