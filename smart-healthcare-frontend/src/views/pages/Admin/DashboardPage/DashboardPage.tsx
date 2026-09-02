import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import { getAllAdmins } from '../../../../api/admin/AdminAPI';
import {
  type AppointmentResponse,
  getAllAppointments,
} from '../../../../api/appointments/AppointmentsAPI';
import { getAllDoctors } from '../../../../api/doctors/DoctorsAPI';
import { getAllPatients } from '../../../../api/patients/PatientsAPI';
import {
  type BarChartPoint,
  BarChart,
} from '../../../../components/BarChart/BarChart';
import { ShareBar } from '../../../../components/ShareBar/ShareBar';
import {
  type StatTile,
  StatTiles,
} from '../../../../components/StatTiles/StatTiles';
import {
  appointmentShare,
  lastSevenDays,
} from '../../../../analytics/appointmentAnalytics';
import {
  busiestDoctors,
  countBySpecialty,
} from '../../../../analytics/adminAnalytics';
import styles from './DashboardPage.module.scss';

interface Overview {
  tiles: StatTile[];
  specialties: BarChartPoint[];
  perDay: BarChartPoint[];
  doctors: BarChartPoint[];
  appointments: AppointmentResponse[];
}

async function loadOverview(): Promise<Overview> {
  const [doctors, patients, admins, appointments] = await Promise.all([
    getAllDoctors(),
    getAllPatients(),
    getAllAdmins(),
    getAllAppointments(),
  ]);

  return {
    tiles: [
      { label: 'Doctors', value: String(doctors.length) },
      { label: 'Patients', value: String(patients.length) },
      { label: 'Admins', value: String(admins.length) },
      { label: 'Appointments', value: String(appointments.length) },
      { label: 'Specialties', value: String(new Set(doctors.map((doctor) => doctor.specialty)).size) },
    ],
    specialties: countBySpecialty(doctors),
    perDay: lastSevenDays(appointments),
    doctors: busiestDoctors(doctors, appointments),
    appointments,
  };
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOverview = useCallback(() => {
    loadOverview()
      .then((loaded) => {
        setOverview(loaded);
        setError(null);
      })
      .catch(() => setError('Could not load the dashboard. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview]);

  return (
    <Box className={styles.page}>
      <Box>
        <Typography variant="h5">Admin Dashboard</Typography>
        <Typography variant="body2" color="textSecondary">How busy the clinic is right now.</Typography>
      </Box>

      {isLoading && (
        <Typography className={styles.message} color="textSecondary">Loading the dashboard...</Typography>
      )}

      {!isLoading && error !== null && (
        <Typography className={styles.message} color="error">{error}</Typography>
      )}

      {!isLoading && error === null && overview !== null && (
        <>
          <StatTiles tiles={overview.tiles} />

          <Box className={styles.section}>
            <Typography variant="h6">Appointments by status</Typography>
            <ShareBar segments={appointmentShare(overview.appointments)} emptyMessage="No appointments have been booked yet." />
          </Box>

          <Box className={styles.charts}>
            <Box className={styles.section}>
              <Typography variant="h6">Appointments in the last 7 days</Typography>
              <BarChart points={overview.perDay} emptyMessage="No appointments in the last 7 days." />
            </Box>

            <Box className={styles.section}>
              <Typography variant="h6">Doctors per specialty</Typography>
              <BarChart points={overview.specialties} emptyMessage="No doctors have been added yet." />
            </Box>
          </Box>

          <Box className={styles.section}>
            <Typography variant="h6">Busiest doctors</Typography>
            <BarChart points={overview.doctors} emptyMessage="No appointments have been booked yet." />
          </Box>
        </>
      )}
    </Box>
  );
}
