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
const WorkHoursPage = lazy(() => import('../views/pages/Doctor/WorkHoursPage/WorkHoursPage'));
const SchedulePage = lazy(() => import('../views/pages/Doctor/SchedulePage/SchedulePage'));
const PrescribedPage = lazy(() => import('../views/pages/Doctor/PrescriptionsPage/PrescriptionsPage'));
const AppointmentsPage = lazy(() => import('../views/pages/Patient/AppointmentsPage/AppointmentsPage'));
const PrescriptionsPage = lazy(() => import('../views/pages/Patient/PrescriptionsPage/PrescriptionsPage'));
const PatientRecordsPage = lazy(() => import('../views/pages/Doctor/MedicalRecordsPage/MedicalRecordsPage'));
const MedicalRecordsPage = lazy(() => import('../views/pages/Patient/MedicalRecordsPage/MedicalRecordsPage'));
const ProfilePage = lazy(() => import('../views/pages/ProfilePage/ProfilePage'));
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
              <Route path="profile" element={<ProfilePage />} />
              <Route element={<RequireRole roles={['ADMIN']} />}>
                <Route path="admins" element={<AdminsPage />} />
                <Route path="doctors" element={<DoctorsPage />} />
                <Route path="patients" element={<PatientsPage />} />
              </Route>
              <Route element={<RequireRole roles={['DOCTOR']} />}>
                <Route path="availability" element={<WorkHoursPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="prescribed" element={<PrescribedPage />} />
                <Route path="records" element={<PatientRecordsPage />} />
              </Route>
              <Route element={<RequireRole roles={['PATIENT']} />}>
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="prescriptions" element={<PrescriptionsPage />} />
                <Route path="medical-record" element={<MedicalRecordsPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}