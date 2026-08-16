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
import { bySoonestFirst } from '../../../../utils/bySoonestFirst';
import { formatTime } from '../../../../utils/formatTime';
import {
  AppointmentDetails,
} from '../../../shared/AppointmentDetails/AppointmentDetails';
import {
  AppointmentStatusChip,
} from '../../../shared/AppointmentStatusChip/AppointmentStatusChip';
import {
  CompleteAppointmentForm,
} from './CompleteAppointmentForm/CompleteAppointmentForm';
import styles from './SchedulePage.module.scss';

type DrawerType = 'complete' | 'details';

interface DrawerDetails {
  appointmentId: number;
  type: DrawerType;
  title: string;
}

export default function SchedulePage() {
  const auth = useContext(AuthContext);
  const doctorId = auth?.user?.roleEntityId ?? null;
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [drawerDetails, setDrawerDetails] = useState<DrawerDetails | null>(null);

  const refreshAppointments = useCallback(() => {
    if (doctorId !== null) {
      getDoctorAppointments(doctorId).then((data) => setAppointments([...data].sort(bySoonestFirst)));
    }
  }, [doctorId]);

  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  const drawerAppointment = drawerDetails
    ? appointments.find((appointment) => appointment.id === drawerDetails.appointmentId) ?? null
    : null;

  function openComplete(appointment: AppointmentResponse) {
    setDrawerDetails({ appointmentId: appointment.id, type: 'complete', title: 'Complete Appointment' });
  }

  function openDetails(appointment: AppointmentResponse) {
    setDrawerDetails({ appointmentId: appointment.id, type: 'details', title: 'Appointment Details' });
  }

  function closeDrawer() {
    setDrawerDetails(null);
  }

  function handleCompleted() {
    closeDrawer();
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
          onClick={() => openDetails(row)}
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
      render: (row) => <AppointmentStatusChip status={row.status} />,
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
              <IconButton size="small" className={styles.completeAction} onClick={() => openComplete(row)}>
                <TaskAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View details">
            <IconButton size="small" onClick={() => openDetails(row)}>
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

      {drawerDetails !== null && drawerAppointment !== null && (
        <Drawer open onClose={closeDrawer} title={drawerDetails.title}>
          {drawerDetails.type === 'complete' ? (
            <CompleteAppointmentForm
              appointment={drawerAppointment}
              onSuccess={handleCompleted}
              onCancel={closeDrawer}
            />
          ) : (
            <AppointmentDetails appointment={drawerAppointment} heading={drawerAppointment.patientName} />
          )}
        </Drawer>
      )}
    </Box>
  );
}
