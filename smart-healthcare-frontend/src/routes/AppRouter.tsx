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

const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const MainLayout = lazy(() => import('../layouts/MainLayout/MainLayout'));
const DashboardPage = lazy(() => import('../pages/DashboardPage/DashboardPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              {/* Feature routes (appointments, doctors, patients, etc.) */}
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}