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
  getPatientAppointments,
} from '../../../../api/appointments/AppointmentsAPI';
import {
  type PrescriptionResponse,
  getPatientPrescriptions,
} from '../../../../api/prescriptions/PrescriptionsAPI';
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
import {
  appointmentShare,
  countByStatus,
  upcomingAppointments,
} from '../../../../analytics/appointmentAnalytics';
import { visitsPerDoctor } from '../../../../analytics/patientAnalytics';
import styles from './DashboardPage.module.scss';

interface Overview {
  tiles: StatTile[];
  doctors: BarChartPoint[];
  appointments: AppointmentResponse[];
}

const NONE = 'None';

function buildTiles(
  appointments: AppointmentResponse[],
  prescriptions: PrescriptionResponse[],
): StatTile[] {
  const upcoming = upcomingAppointments(appointments);
  const next = upcoming.at(0);
  const completed = appointments.filter((appointment) => appointment.status === 'COMPLETED');
  const lastVisit = completed.map((appointment) => appointment.appointmentDate).sort().at(-1);

  return [
    { label: 'Upcoming', value: String(upcoming.length) },
    { label: 'Completed visits', value: String(completed.length) },
    { label: 'Cancelled', value: String(countByStatus(appointments, 'CANCELLED')) },
    { label: 'Prescriptions', value: String(prescriptions.length) },
    { label: 'Last visit', value: lastVisit ?? NONE },
    { label: 'Next appointment', value: next ? `${next.appointmentDate} ${next.startTime}` : NONE },
  ];
}

async function loadOverview(patientId: number): Promise<Overview> {
  const [appointments, prescriptions] = await Promise.all([
    getPatientAppointments(patientId),
    getPatientPrescriptions(patientId),
  ]);

  return {
    tiles: buildTiles(appointments, prescriptions),
    doctors: visitsPerDoctor(appointments),
    appointments,
  };
}

export default function DashboardPage() {
  const auth = useContext(AuthContext);
  const patientId = auth?.user?.roleEntityId ?? null;
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOverview = useCallback(() => {
    if (patientId === null) return;
    loadOverview(patientId)
      .then((loaded) => {
        setOverview(loaded);
        setError(null);
      })
      .catch(() => setError('Could not load your dashboard. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [patientId]);

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview]);

  return (
    <Box className={styles.page}>
      <Box>
        <Typography variant="h5">My Dashboard</Typography>
        <Typography variant="body2" color="textSecondary">Your appointments, your prescriptions and your visits.</Typography>
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
            <ShareBar segments={appointmentShare(overview.appointments)} emptyMessage="You have not booked an appointment yet." />
          </Box>

          <Box className={styles.section}>
            <Typography variant="h6">Visits per doctor</Typography>
            <BarChart points={overview.doctors} emptyMessage="You have not visited a doctor yet." />
          </Box>
        </>
      )}
    </Box>
  );
}
