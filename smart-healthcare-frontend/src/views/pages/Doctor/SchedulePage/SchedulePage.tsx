import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Box,
  Chip,
  Typography,
} from '@mui/material';

import {
  type AppointmentResponse,
  getDoctorAppointments,
} from '../../../../api/appointments/AppointmentsAPI';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { AuthContext } from '../../../../contexts/AuthContext';
import type { AppointmentStatus } from '../../../../types/common';
import { formatTime } from '../../../../utils/formatTime';
import styles from './SchedulePage.module.scss';

const statusColors: Record<AppointmentStatus, 'primary' | 'success' | 'default'> = {
  SCHEDULED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'default',
};

function bySoonestFirst(a: AppointmentResponse, b: AppointmentResponse) {
  return `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`);
}

const columns: DataTableColumn<AppointmentResponse>[] = [
  { key: 'patientName', label: 'Patient', width: 200, render: (row) => row.patientName },
  { key: 'appointmentDate', label: 'Date', width: 140, render: (row) => row.appointmentDate },
  {
    key: 'time',
    label: 'Time',
    width: 150,
    render: (row) => `${formatTime(row.startTime)} – ${formatTime(row.endTime)}`,
  },
  {
    key: 'status',
    label: 'Status',
    width: 140,
    render: (row) => (
      <Chip label={row.status.charAt(0) + row.status.slice(1).toLowerCase()} size="small" color={statusColors[row.status]} />
    ),
  },
  { key: 'reason', label: 'Reason', render: (row) => row.reason ?? '—' },
];

export default function SchedulePage() {
  const auth = useContext(AuthContext);
  const doctorId = auth?.user?.roleEntityId ?? null;
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  const refreshAppointments = useCallback(() => {
    if (doctorId !== null) {
      getDoctorAppointments(doctorId).then((data) => setAppointments([...data].sort(bySoonestFirst)));
    }
  }, [doctorId]);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Appointments</Typography>
      </Box>

      <DataTable
        columns={columns}
        rows={appointments}
        getRowKey={(row) => row.id}
        emptyMessage="No appointments booked with you yet."
      />
    </Box>
  );
}
