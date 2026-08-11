import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import InfoIcon from '@mui/icons-material/InfoOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAltOutlined';
import {
  Box,
  Chip,
  IconButton,
  Link,
  Tooltip,
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
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AuthContext } from '../../../../contexts/AuthContext';
import type { AppointmentStatus } from '../../../../types/common';
import { formatTime } from '../../../../utils/formatTime';
import { AppointmentDetails } from './AppointmentDetails/AppointmentDetails';
import {
  CompleteAppointmentForm,
} from './CompleteAppointmentForm/CompleteAppointmentForm';
import styles from './SchedulePage.module.scss';

const statusColors: Record<AppointmentStatus, 'primary' | 'success' | 'default'> = {
  SCHEDULED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'default',
};

function bySoonestFirst(a: AppointmentResponse, b: AppointmentResponse) {
  return `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`);
}

export default function SchedulePage() {
  const auth = useContext(AuthContext);
  const doctorId = auth?.user?.roleEntityId ?? null;
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [completeTarget, setCompleteTarget] = useState<AppointmentResponse | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<AppointmentResponse | null>(null);

  const refreshAppointments = useCallback(() => {
    if (doctorId !== null) {
      getDoctorAppointments(doctorId).then((data) => setAppointments([...data].sort(bySoonestFirst)));
    }
  }, [doctorId]);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  function handleCompleted() {
    setCompleteTarget(null);
    refreshAppointments();
  }

  const columns: DataTableColumn<AppointmentResponse>[] = [
    {
      key: 'patientName',
      label: 'Patient',
      width: 200,
      render: (row) => (
        <Link
          component="button"
          type="button"
          underline="hover"
          color="inherit"
          className={styles.patientLink}
          onClick={() => setDetailsTarget(row)}
        >
          {row.patientName}
        </Link>
      ),
    },
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
    {
      key: 'actions',
      label: '',
      width: 110,
      render: (row) => (
        <Box className={styles.rowActions}>
          {row.status === 'SCHEDULED' && (
            <Tooltip title="Complete appointment">
              <IconButton size="small" className={styles.completeAction} onClick={() => setCompleteTarget(row)}>
                <TaskAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View details">
            <IconButton size="small" onClick={() => setDetailsTarget(row)}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

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

      {completeTarget !== null && (
        <Drawer open onClose={() => setCompleteTarget(null)} title="Complete Appointment">
          <CompleteAppointmentForm
            appointment={completeTarget}
            onSuccess={handleCompleted}
            onCancel={() => setCompleteTarget(null)}
          />
        </Drawer>
      )}

      {detailsTarget !== null && (
        <Drawer open onClose={() => setDetailsTarget(null)} title="Appointment Details">
          <AppointmentDetails appointment={detailsTarget} />
        </Drawer>
      )}
    </Box>
  );
}
