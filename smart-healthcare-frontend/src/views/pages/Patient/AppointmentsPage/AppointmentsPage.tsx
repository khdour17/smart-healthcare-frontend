import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import AddIcon from '@mui/icons-material/AddOutlined';
import {
  Box,
  Button,
  Chip,
  Typography,
} from '@mui/material';

import {
  type AppointmentResponse,
  getPatientAppointments,
} from '../../../../api/appointments/AppointmentsAPI';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AuthContext } from '../../../../contexts/AuthContext';
import type { AppointmentStatus } from '../../../../types/common';
import { formatTime } from '../../../../utils/formatTime';
import { BookAppointmentForm } from './BookAppointmentForm/BookAppointmentForm';
import styles from './AppointmentsPage.module.scss';

const statusColors: Record<AppointmentStatus, 'primary' | 'success' | 'default'> = {
  SCHEDULED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'default',
};

function bySoonestFirst(a: AppointmentResponse, b: AppointmentResponse) {
  return `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`);
}

const columns: DataTableColumn<AppointmentResponse>[] = [
  { key: 'doctorName', label: 'Doctor', width: 200, render: (row) => row.doctorName },
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

export default function AppointmentsPage() {
  const auth = useContext(AuthContext);
  const patientId = auth?.user?.roleEntityId ?? null;
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refreshAppointments = useCallback(() => {
    if (patientId !== null) {
      getPatientAppointments(patientId).then((data) => setAppointments([...data].sort(bySoonestFirst)));
    }
  }, [patientId]);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  function handleBooked() {
    setIsDrawerOpen(false);
    refreshAppointments();
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">My Appointments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDrawerOpen(true)} disabled={patientId === null}>
          Book Appointment
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={appointments}
        getRowKey={(row) => row.id}
        emptyMessage="No appointments booked yet."
      />

      {patientId !== null && (
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Book Appointment">
          <BookAppointmentForm patientId={patientId} onSuccess={handleBooked} onCancel={() => setIsDrawerOpen(false)} />
        </Drawer>
      )}
    </Box>
  );
}
