import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Typography,
} from '@mui/material';

import { getAllAdmins } from '../../../api/admin/AdminAPI';
import {
  type AppointmentResponse,
  getDoctorAppointments,
  getPatientAppointments,
} from '../../../api/appointments/AppointmentsAPI';
import { getDoctorAvailability } from '../../../api/availability/AvailabilityAPI';
import { getAllDoctors } from '../../../api/doctors/DoctorsAPI';
import { getAllPatients } from '../../../api/patients/PatientsAPI';
import {
  getDoctorPrescriptions,
  getPatientPrescriptions,
} from '../../../api/prescriptions/PrescriptionsAPI';
import {
  type AuthUser,
  AuthContext,
} from '../../../contexts/AuthContext';
import { todayIso } from '../../../utils/todayIso';
import styles from './DashboardPage.module.scss';

interface Tile {
  label: string;
  value: string;
}

interface Shortcut {
  label: string;
  path: string;
}

interface Overview {
  intro: string;
  tiles: Tile[];
  shortcuts: Shortcut[];
}

const NONE = 'None';

function upcoming(appointments: AppointmentResponse[]): AppointmentResponse[] {
  const today = todayIso();
  return appointments
    .filter((appointment) => appointment.status === 'SCHEDULED' && appointment.appointmentDate >= today)
    .sort((first, second) => `${first.appointmentDate}${first.startTime}`.localeCompare(`${second.appointmentDate}${second.startTime}`));
}

function countByStatus(appointments: AppointmentResponse[], status: AppointmentResponse['status']): number {
  return appointments.filter((appointment) => appointment.status === status).length;
}

async function adminOverview(): Promise<Overview> {
  const [doctors, patients, admins] = await Promise.all([
    getAllDoctors(),
    getAllPatients(),
    getAllAdmins(),
  ]);

  return {
    intro: 'Manage the doctors, the patients and the other admins of the system.',
    tiles: [
      { label: 'Doctors', value: String(doctors.length) },
      { label: 'Patients', value: String(patients.length) },
      { label: 'Admins', value: String(admins.length) },
    ],
    shortcuts: [
      { label: 'Doctors', path: '/dashboard/doctors' },
      { label: 'Patients', path: '/dashboard/patients' },
      { label: 'Admins', path: '/dashboard/admins' },
    ],
  };
}

async function doctorOverview(doctorId: number): Promise<Overview> {
  const [appointments, availability, prescriptions] = await Promise.all([
    getDoctorAppointments(doctorId),
    getDoctorAvailability(doctorId),
    getDoctorPrescriptions(doctorId),
  ]);

  const nextAppointments = upcoming(appointments);
  const next = nextAppointments.at(0);
  const today = appointments.filter(
    (appointment) => appointment.appointmentDate === todayIso() && appointment.status === 'SCHEDULED',
  );

  return {
    intro: 'Your appointments, your work hours and the prescriptions you wrote.',
    tiles: [
      { label: 'Today', value: String(today.length) },
      { label: 'Upcoming', value: String(nextAppointments.length) },
      { label: 'Completed', value: String(countByStatus(appointments, 'COMPLETED')) },
      { label: 'Work hours days', value: String(availability.length) },
      { label: 'Prescriptions', value: String(prescriptions.length) },
      { label: 'Next appointment', value: next ? `${next.appointmentDate} ${next.startTime}` : NONE },
    ],
    shortcuts: [
      { label: 'Appointments', path: '/dashboard/schedule' },
      { label: 'Work Hours', path: '/dashboard/availability' },
      { label: 'Medical Records', path: '/dashboard/records' },
    ],
  };
}

async function patientOverview(patientId: number): Promise<Overview> {
  const [appointments, prescriptions] = await Promise.all([
    getPatientAppointments(patientId),
    getPatientPrescriptions(patientId),
  ]);

  const next = upcoming(appointments).at(0);

  return {
    intro: 'Book an appointment, then follow it up with your prescriptions and your record.',
    tiles: [
      { label: 'Upcoming', value: String(upcoming(appointments).length) },
      { label: 'Completed visits', value: String(countByStatus(appointments, 'COMPLETED')) },
      { label: 'Cancelled', value: String(countByStatus(appointments, 'CANCELLED')) },
      { label: 'Prescriptions', value: String(prescriptions.length) },
      { label: 'Next appointment', value: next ? `${next.appointmentDate} ${next.startTime}` : NONE },
      { label: 'With', value: next ? next.doctorName : NONE },
    ],
    shortcuts: [
      { label: 'Appointments', path: '/dashboard/appointments' },
      { label: 'Prescriptions', path: '/dashboard/prescriptions' },
      { label: 'Medical Record', path: '/dashboard/medical-record' },
    ],
  };
}

function loadOverview(user: AuthUser): Promise<Overview> {
  if (user.role === 'ADMIN') return adminOverview();
  if (user.role === 'DOCTOR') return doctorOverview(user.roleEntityId);
  return patientOverview(user.roleEntityId);
}

export default function DashboardPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const user = auth?.user ?? null;
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOverview = useCallback(() => {
    if (user === null) return;
    loadOverview(user)
      .then((loaded) => {
        setOverview(loaded);
        setError(null);
      })
      .catch(() => setError('Could not load your dashboard. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview]);

  return (
    <Box className={styles.page}>
      <Box>
        <Typography variant="h4">Welcome, {user?.username}</Typography>
        {overview !== null && (
          <Typography color="textSecondary">{overview.intro}</Typography>
        )}
      </Box>

      {isLoading && (
        <Typography className={styles.message} color="textSecondary">Loading your dashboard...</Typography>
      )}

      {!isLoading && error !== null && (
        <Typography className={styles.message} color="error">{error}</Typography>
      )}

      {!isLoading && error === null && overview !== null && (
        <>
          <Box className={styles.tiles}>
            {overview.tiles.map((tile) => (
              <Box key={tile.label} className={styles.tile}>
                <Typography variant="body2" color="textSecondary">{tile.label}</Typography>
                <Typography variant="h6" className={styles.tileValue}>{tile.value}</Typography>
              </Box>
            ))}
          </Box>

          <Box className={styles.shortcuts}>
            {overview.shortcuts.map((shortcut) => (
              <Button key={shortcut.path} variant="outlined" onClick={() => navigate(shortcut.path)}>{shortcut.label}</Button>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
