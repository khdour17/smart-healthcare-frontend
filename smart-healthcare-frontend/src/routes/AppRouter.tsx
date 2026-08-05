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

const LoginPage = lazy(() => import('../views/pages/LoginPage/LoginPage'));
const MainLayout = lazy(() => import('../views/layouts/MainLayout/MainLayout'));
const DashboardPage = lazy(() => import('../views/pages/DashboardPage/DashboardPage'));
const AdminsPage = lazy(() => import('../views/pages/Admin/AdminsPage/AdminsPage'));
const DoctorsPage = lazy(() => import('../views/pages/Admin/DoctorsPage/DoctorsPage'));
const PatientsPage = lazy(() => import('../views/pages/Admin/PatientsPage/PatientsPage'));
const NotFoundPage = lazy(() => import('../views/pages/NotFoundPage/NotFoundPage'));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route element={<RequireRole roles={['ADMIN']} />}>
                <Route path="admins" element={<AdminsPage />} />
                <Route path="doctors" element={<DoctorsPage />} />
              </Route>
              <Route element={<RequireRole roles={['ADMIN', 'DOCTOR']} />}>
                <Route path="patients" element={<PatientsPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}