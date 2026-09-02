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
import { AddAvailabilityForm } from './AddAvailabilityForm/AddAvailabilityForm';
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
import styles from './WorkHoursPage.module.scss';

export default function WorkHoursPage() {
  const auth = useContext(AuthContext);
  const doctorId = auth?.user?.roleEntityId ?? null;
  const [slots, setSlots] = useState<DoctorAvailabilityResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refreshSlots = useCallback(() => {
    if (doctorId !== null) getDoctorAvailability(doctorId).then(setSlots);
  }, [doctorId]);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  function handleCreated() {
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

      <DataTable columns={columns} rows={slots} getRowKey={(row) => row.id} emptyMessage="No work hours set yet." />

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