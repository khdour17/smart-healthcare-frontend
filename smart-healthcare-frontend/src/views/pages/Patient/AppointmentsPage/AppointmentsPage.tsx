import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import AddIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusyOutlined';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  type AppointmentResponse,
  cancelAppointment,
  deleteAppointment,
  getPatientAppointments,
} from '../../../../api/appointments/AppointmentsAPI';
import {
  ConfirmDialog,
} from '../../../../components/ConfirmDialog/ConfirmDialog';
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

type ConfirmType = 'cancel' | 'delete';

interface ConfirmDetails {
  appointmentId: number;
  type: ConfirmType;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

export default function AppointmentsPage() {
  const auth = useContext(AuthContext);
  const patientId = auth?.user?.roleEntityId ?? null;
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmDetails, setConfirmDetails] = useState<ConfirmDetails | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

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

  function openConfirmCancel(appointment: AppointmentResponse) {
    setConfirmError(null);
    setConfirmDetails({
      appointmentId: appointment.id,
      type: 'cancel',
      title: 'Cancel appointment',
      message: `Cancel your appointment with ${appointment.doctorName} on ${appointment.appointmentDate} at ${formatTime(appointment.startTime)}?`,
      confirmLabel: 'Cancel appointment',
      cancelLabel: 'Keep it',
    });
  }

  function openConfirmDelete(appointment: AppointmentResponse) {
    setConfirmError(null);
    setConfirmDetails({
      appointmentId: appointment.id,
      type: 'delete',
      title: 'Delete appointment',
      message: `Remove your cancelled appointment with ${appointment.doctorName} on ${appointment.appointmentDate}? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
  }

  async function handleConfirm() {
    if (confirmDetails === null) return;
    const { appointmentId, type } = confirmDetails;
    try {
      if (type === 'cancel') await cancelAppointment(appointmentId);
      else await deleteAppointment(appointmentId);
      setConfirmDetails(null);
      refreshAppointments();
    } catch {
      setConfirmError(`Could not ${type} this appointment. Please try again.`);
    }
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
    {
      key: 'actions',
      label: '',
      width: 72,
      render: (row) => (
        <>
          {row.status === 'SCHEDULED' && (
            <Tooltip title="Cancel appointment">
              <IconButton size="small" className={styles.cancelAction} onClick={() => openConfirmCancel(row)}>
                <EventBusyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {row.status === 'CANCELLED' && (
            <Tooltip title="Delete appointment">
              <IconButton size="small" className={styles.deleteAction} onClick={() => openConfirmDelete(row)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

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

      <ConfirmDialog
        open={confirmDetails !== null}
        title={confirmDetails?.title ?? ''}
        message={confirmDetails?.message ?? ''}
        confirmLabel={confirmDetails?.confirmLabel}
        cancelLabel={confirmDetails?.cancelLabel}
        confirmColor="error"
        error={confirmError}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDetails(null)}
      />
    </Box>
  );
}
