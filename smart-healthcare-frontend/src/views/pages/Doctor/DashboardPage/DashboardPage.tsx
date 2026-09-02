import {
  useCallback,
  useContext,
  useEffect,
  useState,
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
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOverview = useCallback(() => {
    if (doctorId === null) return;
    loadOverview(doctorId)
      .then((loaded) => {
        setOverview(loaded);
        setError(null);
      })
      .catch(() => setError('Could not load your dashboard. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [doctorId]);

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview]);

  return (
    <Box className={styles.page}>
      <Box>
        <Typography variant="h5">Doctor Dashboard</Typography>
        <Typography variant="body2" color="textSecondary">Your week, your patients and your work hours.</Typography>
      </Box>

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
