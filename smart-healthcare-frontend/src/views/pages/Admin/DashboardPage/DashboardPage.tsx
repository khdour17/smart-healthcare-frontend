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
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
import { useLoadedData } from '../../../../utils/useLoadedData';
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
  const { data: overview, isLoading, error } = useLoadedData(loadOverview, 'Could not load the dashboard. Please try again.');

  return (
    <Box className={styles.page}>
      <PageHeader title="Admin Dashboard" subtitle="How busy the clinic is right now." />

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
