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

const LoginPage = lazy(() => import('../views/pages/LoginPage/LoginPage'));
const MainLayout = lazy(() => import('../views/layouts/MainLayout/MainLayout'));
const DashboardPage = lazy(() => import('../views/pages/DashboardPage/DashboardPage'));
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
              {/* Feature routes (appointments, doctors, patients, etc.) */}
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}