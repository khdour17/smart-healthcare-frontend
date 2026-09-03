import {
  useContext,
  useMemo,
} from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import {
  type AppointmentResponse,
  getDoctorAppointments,
} from '../../../../api/appointments/AppointmentsAPI';
import { getDoctorAvailability } from '../../../../api/availability/AvailabilityAPI';
import { getDoctorPrescriptions } from '../../../../api/prescriptions/PrescriptionsAPI';
import {
  type BarChartPoint,
  BarChart,
} from '../../../../components/BarChart/BarChart';
import { ShareBar } from '../../../../components/ShareBar/ShareBar';
import {
  type StatTile,
  StatTiles,
} from '../../../../components/StatTiles/StatTiles';
import { AuthContext } from '../../../../contexts/AuthContext';
import { formatTime } from '../../../../utils/formatTime';
import {
  appointmentShare,
  countByStatus,
  lastSevenDays,
  upcomingAppointments,
} from '../../../../analytics/appointmentAnalytics';
import { todayIso } from '../../../../utils/todayIso';
import { weeklyHours } from '../../../../analytics/doctorAnalytics';
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
import { useLoadedData } from '../../../../utils/useLoadedData';
import styles from './DashboardPage.module.scss';

interface Overview {
  tiles: StatTile[];
  perDay: BarChartPoint[];
  hours: BarChartPoint[];
  appointments: AppointmentResponse[];
}

const NONE = 'None';

function buildTiles(appointments: AppointmentResponse[], prescriptionCount: number): StatTile[] {
  const upcoming = upcomingAppointments(appointments);
  const next = upcoming.at(0);
  const today = appointments.filter(
    (appointment) => appointment.appointmentDate === todayIso() && appointment.status === 'SCHEDULED',
  );
  const patients = new Set(appointments.map((appointment) => appointment.patientId));

  return [
    { label: 'Today', value: String(today.length) },
    { label: 'Upcoming', value: String(upcoming.length) },
    { label: 'Completed', value: String(countByStatus(appointments, 'COMPLETED')) },
    { label: 'Patients seen', value: String(patients.size) },
    { label: 'Prescriptions', value: String(prescriptionCount) },
    { label: 'Next appointment', value: next ? `${next.appointmentDate} ${formatTime(next.startTime)}` : NONE },
  ];
}

async function loadOverview(doctorId: number): Promise<Overview> {
  const [appointments, availability, prescriptions] = await Promise.all([
    getDoctorAppointments(doctorId),
    getDoctorAvailability(doctorId),
    getDoctorPrescriptions(doctorId),
  ]);

  return {
    tiles: buildTiles(appointments, prescriptions.length),
    perDay: lastSevenDays(appointments),
    hours: weeklyHours(availability),
    appointments,
  };
}

export default function DashboardPage() {
  const auth = useContext(AuthContext);
  const doctorId = auth?.user?.roleEntityId ?? null;

  const load = useMemo(
    () => (doctorId === null ? null : () => loadOverview(doctorId)),
    [doctorId],
  );
  const { data: overview, isLoading, error } = useLoadedData(load, 'Could not load your dashboard. Please try again.');

  return (
    <Box className={styles.page}>
      <PageHeader title="Doctor Dashboard" subtitle="Your week, your patients and your work hours." />

      {isLoading && (
        <Typography className={styles.message} color="textSecondary">Loading your dashboard...</Typography>
      )}

      {!isLoading && error !== null && (
        <Typography className={styles.message} color="error">{error}</Typography>
      )}

      {!isLoading && error === null && overview !== null && (
        <>
          <StatTiles tiles={overview.tiles} />

          <Box className={styles.section}>
            <Typography variant="h6">Your appointments by status</Typography>
            <ShareBar segments={appointmentShare(overview.appointments)} emptyMessage="No one has booked with you yet." />
          </Box>

          <Box className={styles.charts}>
            <Box className={styles.section}>
              <Typography variant="h6">Appointments in the last 7 days</Typography>
              <BarChart points={overview.perDay} emptyMessage="No appointments in the last 7 days." />
            </Box>

            <Box className={styles.section}>
              <Typography variant="h6">Work hours per day</Typography>
              <BarChart points={overview.hours} emptyMessage="You have not set any work hours yet." />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
