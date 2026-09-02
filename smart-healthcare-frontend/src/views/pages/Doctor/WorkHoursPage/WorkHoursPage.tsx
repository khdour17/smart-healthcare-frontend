import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import AddIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';

import {
  deleteAvailability,
  type DoctorAvailabilityResponse,
  getDoctorAvailability,
} from '../../../../api/availability/AvailabilityAPI';
import {
  ConfirmDialog,
} from '../../../../components/ConfirmDialog/ConfirmDialog';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AuthContext } from '../../../../contexts/AuthContext';
import { formatTime } from '../../../../utils/formatTime';
import {
  getPageView,
  type PageView,
  savePageView,
} from '../../../../utils/preferences';
import { AddAvailabilityForm } from './AddAvailabilityForm/AddAvailabilityForm';
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
import { ViewToggle } from '../../../../components/ViewToggle/ViewToggle';
import {
  type CalendarItem,
  WeekCalendar,
} from '../../../../components/WeekCalendar/WeekCalendar';
import { useToast } from '../../../../utils/useToast';
import styles from './WorkHoursPage.module.scss';

const WEEK_DAYS = [
  { key: 'MONDAY', label: 'Mon' },
  { key: 'TUESDAY', label: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wed' },
  { key: 'THURSDAY', label: 'Thu' },
  { key: 'FRIDAY', label: 'Fri' },
  { key: 'SATURDAY', label: 'Sat' },
  { key: 'SUNDAY', label: 'Sun' },
];

export default function WorkHoursPage() {
  const showToast = useToast();
  const auth = useContext(AuthContext);
  const doctorId = auth?.user?.roleEntityId ?? null;
  const [slots, setSlots] = useState<DoctorAvailabilityResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [view, setView] = useState<PageView>(() => getPageView('workHours'));

  function changeView(next: PageView) {
    setView(next);
    savePageView('workHours', next);
  }

  const refreshSlots = useCallback(() => {
    if (doctorId !== null) getDoctorAvailability(doctorId).then(setSlots);
  }, [doctorId]);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  function handleCreated() {
    showToast('Work hours saved.');
    setIsDrawerOpen(false);
    refreshSlots();
  }

  function openConfirmDelete(id: number) {
    setDeleteError(null);
    setDeleteTargetId(id);
  }

  async function handleConfirmDelete() {
    if (deleteTargetId === null) return;
    try {
      await deleteAvailability(deleteTargetId);
      setDeleteTargetId(null);
      showToast('Work hours removed.');
      refreshSlots();
    } catch {
      setDeleteError('Could not delete this availability slot.');
    }
  }

  const columns: DataTableColumn<DoctorAvailabilityResponse>[] = [
    { key: 'dayOfWeek', label: 'Day', width: 160, render: (row) => row.dayOfWeek.charAt(0) + row.dayOfWeek.slice(1).toLowerCase() },
    { key: 'startTime', label: 'Start', width: 140, render: (row) => formatTime(row.startTime) },
    { key: 'endTime', label: 'End', width: 140, render: (row) => formatTime(row.endTime) },
    { key: 'slotDurationMinutes', label: 'Slot Length', width: 160, render: (row) => `${row.slotDurationMinutes} min` },
    {
      key: 'actions',
      label: '',
      width: 60,
      render: (row) => (
        <Tooltip title="Delete">
          <IconButton size="small" className={styles.deleteAction} onClick={() => openConfirmDelete(row.id)}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const calendarItems: CalendarItem[] = slots.map((slot) => ({
    id: String(slot.id),
    dayKey: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
    title: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
    subtitle: `${slot.slotDurationMinutes} min slots`,
    tone: 'primary',
  }));

  return (
    <Box className={styles.page}>
      <PageHeader
        title="Work Hours"
        subtitle="The hours you are open for appointments each week."
        actions={(
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDrawerOpen(true)} disabled={doctorId === null}>
            Add Availability
          </Button>
        )}
      />

      <Box className={`${styles.viewRow} ${styles.viewRowEnd}`}>
        <ViewToggle view={view} onChange={changeView} />
      </Box>

      {view === 'calendar' ? (
        <WeekCalendar
          days={WEEK_DAYS}
          items={calendarItems}
          emptyMessage="No work hours set yet."
        />
      ) : (
        <DataTable columns={columns} rows={slots} getRowKey={(row) => row.id} emptyMessage="No work hours set yet." />
      )}

      {doctorId !== null && (
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Availability">
          <AddAvailabilityForm doctorId={doctorId} onSuccess={handleCreated} onCancel={() => setIsDrawerOpen(false)} />
        </Drawer>
      )}

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="Delete availability"
        message="Delete this availability slot? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </Box>
  );
}