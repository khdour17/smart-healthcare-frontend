import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import AddIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusyOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
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
import { bySoonestFirst } from '../../../../utils/bySoonestFirst';
import { formatTime } from '../../../../utils/formatTime';
import {
  getPageView,
  type PageView,
  savePageView,
} from '../../../../utils/preferences';
import {
  startOfWeek,
  weekDays,
} from '../../../../utils/weekDates';
import {
  AppointmentDetails,
} from '../../../shared/AppointmentDetails/AppointmentDetails';
import {
  AppointmentStatusChip,
} from '../../../shared/AppointmentStatusChip/AppointmentStatusChip';
import { BookAppointmentForm } from './BookAppointmentForm/BookAppointmentForm';
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
import { CalendarToolbar } from '../../../../components/CalendarToolbar/CalendarToolbar';
import {
  type CalendarItem,
  WeekCalendar,
} from '../../../../components/WeekCalendar/WeekCalendar';
import { useToast } from '../../../../utils/useToast';
import { appointmentTone } from '../../../../utils/appointmentTone';
import styles from './AppointmentsPage.module.scss';

type DrawerDetails =
  | { type: 'book'; title: string }
  | { type: 'details'; title: string; appointmentId: number };

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
  const showToast = useToast();
  const auth = useContext(AuthContext);
  const patientId = auth?.user?.roleEntityId ?? null;
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [drawerDetails, setDrawerDetails] = useState<DrawerDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [view, setView] = useState<PageView>(() => getPageView('appointments'));
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  function changeView(next: PageView) {
    setView(next);
    savePageView('appointments', next);
  }

  function openDrawer(details: DrawerDetails) {
    setDrawerDetails(details);
    setIsDrawerOpen(true);
  }
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

  const drawerAppointment = drawerDetails?.type === 'details'
    ? appointments.find((appointment) => appointment.id === drawerDetails.appointmentId) ?? null
    : null;

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function openBook() {
    openDrawer({ type: 'book', title: 'Book Appointment' });
  }

  function openDetails(appointment: AppointmentResponse) {
    openDrawer({ type: 'details', title: 'Appointment Details', appointmentId: appointment.id });
  }

  function handleBooked() {
    showToast('Appointment booked.');
    closeDrawer();
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
      showToast(type === 'cancel' ? 'Appointment cancelled.' : 'Appointment deleted.');
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
          <Tooltip title="View details">
            <IconButton size="small" onClick={() => openDetails(row)}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const calendarItems: CalendarItem[] = appointments.map((appointment) => ({
    id: String(appointment.id),
    dayKey: appointment.appointmentDate,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    title: appointment.doctorName,
    subtitle: `${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`,
    tone: appointmentTone(appointment.status),
    onClick: () => openDetails(appointment),
  }));

  return (
    <Box className={styles.page}>
      <PageHeader
        title="My Appointments"
        subtitle="Everything you have booked, past and upcoming."
        actions={(
          <Button variant="contained" startIcon={<AddIcon />} onClick={openBook} disabled={patientId === null}>
            Book Appointment
          </Button>
        )}
      />

      <CalendarToolbar
        view={view}
        onViewChange={changeView}
        weekStart={weekStart}
        onWeekChange={setWeekStart}
      />

      {view === 'calendar' ? (
        <WeekCalendar
          days={weekDays(weekStart)}
          items={calendarItems}
          emptyMessage="Nothing booked this week."
        />
      ) : (
        <DataTable
          columns={columns}
          rows={appointments}
          getRowKey={(row) => row.id}
          emptyMessage="No appointments booked yet."
        />
      )}

      <Drawer open={isDrawerOpen} onClose={closeDrawer} title={drawerDetails?.title ?? ''}>
        {drawerDetails?.type === 'book' ? (
          patientId !== null && (
            <BookAppointmentForm patientId={patientId} onSuccess={handleBooked} onCancel={closeDrawer} />
          )
        ) : (
          drawerAppointment !== null && (
            <AppointmentDetails appointment={drawerAppointment} heading={drawerAppointment.doctorName} />
          )
        )}
      </Drawer>

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
