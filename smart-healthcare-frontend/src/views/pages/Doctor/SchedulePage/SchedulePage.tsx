import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import InfoIcon from '@mui/icons-material/InfoOutlined';
import MedicationIcon from '@mui/icons-material/MedicationOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAltOutlined';
import {
  Box,
  IconButton,
  Link,
  Tooltip,
} from '@mui/material';

import {
  type AppointmentResponse,
  getDoctorAppointments,
} from '../../../../api/appointments/AppointmentsAPI';
import {
  getDoctorPrescriptions,
} from '../../../../api/prescriptions/PrescriptionsAPI';
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
import {
  PrescriptionForm,
} from '../../../shared/PrescriptionForm/PrescriptionForm';
import {
  CompleteAppointmentForm,
} from './CompleteAppointmentForm/CompleteAppointmentForm';
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
import { CalendarToolbar } from '../../../../components/CalendarToolbar/CalendarToolbar';
import {
  type CalendarItem,
  WeekCalendar,
} from '../../../../components/WeekCalendar/WeekCalendar';
import { useLatestCall } from '../../../../utils/useLatestCall';
import { useToast } from '../../../../utils/useToast';
import { appointmentTone } from '../../../../utils/appointmentTone';
import styles from './SchedulePage.module.scss';

type DrawerType = 'complete' | 'details' | 'prescribe';

interface DrawerDetails {
  appointmentId: number;
  type: DrawerType;
  title: string;
}

export default function SchedulePage() {
  const showToast = useToast();
  const auth = useContext(AuthContext);
  const doctorId = auth?.user?.roleEntityId ?? null;
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [prescribedIds, setPrescribedIds] = useState<Set<number>>(new Set());
  const [drawerDetails, setDrawerDetails] = useState<DrawerDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [view, setView] = useState<PageView>(() => getPageView('schedule'));
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  function changeView(next: PageView) {
    setView(next);
    savePageView('schedule', next);
  }

  function openDrawer(details: DrawerDetails) {
    setDrawerDetails(details);
    setIsDrawerOpen(true);
  }

  const startAppointmentsCall = useLatestCall();
  const startPrescribedCall = useLatestCall();

  const refreshAppointments = useCallback(() => {
    if (doctorId === null) return;
    const isLatestCall = startAppointmentsCall();
    getDoctorAppointments(doctorId).then((data) => {
      if (isLatestCall()) setAppointments([...data].sort(bySoonestFirst));
    });
  }, [doctorId, startAppointmentsCall]);

  const refreshPrescribedIds = useCallback(() => {
    if (doctorId === null) return;
    const isLatestCall = startPrescribedCall();
    getDoctorPrescriptions(doctorId).then((data) => {
      if (isLatestCall()) setPrescribedIds(new Set(data.map((prescription) => prescription.appointmentId)));
    });
  }, [doctorId, startPrescribedCall]);

  useEffect(() => {
    refreshAppointments();
    refreshPrescribedIds();
  }, [refreshAppointments, refreshPrescribedIds]);

  const drawerAppointment = drawerDetails
    ? appointments.find((appointment) => appointment.id === drawerDetails.appointmentId) ?? null
    : null;

  function openComplete(appointment: AppointmentResponse) {
    openDrawer({ appointmentId: appointment.id, type: 'complete', title: 'Complete Appointment' });
  }

  function openDetails(appointment: AppointmentResponse) {
    openDrawer({ appointmentId: appointment.id, type: 'details', title: 'Appointment Details' });
  }

  function openPrescribe(appointment: AppointmentResponse) {
    openDrawer({ appointmentId: appointment.id, type: 'prescribe', title: 'Add Prescription' });
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function handleCompleted() {
    showToast('Appointment completed.');
    closeDrawer();
    refreshAppointments();
  }

  function handlePrescribed() {
    showToast('Prescription saved.');
    closeDrawer();
    refreshPrescribedIds();
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
      width: 150,
      render: (row) => (
        <Box className={styles.rowActions}>
          {row.status === 'SCHEDULED' && (
            <Tooltip title="Complete appointment">
              <IconButton size="small" className={styles.completeAction} onClick={() => openComplete(row)}>
                <TaskAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {row.status === 'COMPLETED' && !prescribedIds.has(row.id) && (
            <Tooltip title="Add prescription">
              <IconButton size="small" onClick={() => openPrescribe(row)}>
                <MedicationIcon fontSize="small" />
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
    title: appointment.patientName,
    subtitle: `${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`,
    tone: appointmentTone(appointment.status),
    onClick: () => openDetails(appointment),
  }));

  return (
    <Box className={styles.page}>
      <PageHeader
        title="Appointments"
        subtitle="Everyone booked in with you."
      />

      <CalendarToolbar
        view={view}
        onViewChange={changeView}
        weekStart={weekStart}
        onWeekChange={setWeekStart}
      />

      {view === 'calendar' ? (
        <>
          <WeekCalendar
            days={weekDays(weekStart)}
            items={calendarItems}
            emptyMessage="Nothing booked this week."
          />
        </>
      ) : (

        <DataTable
          columns={columns}
          rows={appointments}
          getRowKey={(row) => row.id}
          emptyMessage="No appointments booked with you yet."
        />
      )}

      <Drawer open={isDrawerOpen} onClose={closeDrawer} title={drawerDetails?.title ?? ''}>
        {drawerAppointment !== null && drawerDetails?.type === 'complete' && (
            <CompleteAppointmentForm
              appointment={drawerAppointment}
              onSuccess={handleCompleted}
              onCancel={closeDrawer}
            />
          )}
        {drawerAppointment !== null && drawerDetails?.type === 'prescribe' && (
            <PrescriptionForm
              appointmentId={drawerAppointment.id}
              onSuccess={handlePrescribed}
              onCancel={closeDrawer}
            />
          )}
        {drawerAppointment !== null && drawerDetails?.type === 'details' && (
          <AppointmentDetails appointment={drawerAppointment} heading={drawerAppointment.patientName} />
        )}
      </Drawer>
    </Box>
  );
}
