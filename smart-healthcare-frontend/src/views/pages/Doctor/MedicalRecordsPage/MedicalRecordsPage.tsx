import {
  useEffect,
  useState,
} from 'react';

import AddIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  deleteMedicalRecord,
  getPatientHistory,
  type PatientHistoryResponse,
} from '../../../../api/medicalRecords/MedicalRecordsAPI';
import {
  getAllPatients,
  type PatientResponse,
} from '../../../../api/patients/PatientsAPI';
import {
  ConfirmDialog,
} from '../../../../components/ConfirmDialog/ConfirmDialog';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { PatientRecord } from '../../../shared/PatientRecord/PatientRecord';
import { MedicalRecordForm } from './MedicalRecordForm/MedicalRecordForm';
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
import { useToast } from '../../../../utils/useToast';
import styles from './MedicalRecordsPage.module.scss';

type DrawerDetails =
  | { type: 'create'; title: string }
  | { type: 'edit'; entryId: string; title: string };

export default function MedicalRecordsPage() {
  const showToast = useToast();
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [history, setHistory] = useState<PatientHistoryResponse | null>(null);
  const [drawerDetails, setDrawerDetails] = useState<DrawerDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function openDrawer(details: DrawerDetails) {
    setDrawerDetails(details);
    setIsDrawerOpen(true);
  }
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    getAllPatients().then(setPatients);
  }, []);

  function loadHistory(id: number) {
    getPatientHistory(id).then(setHistory);
  }

  const patient = patients.find((item) => item.id === patientId) ?? null;

  function refreshHistory() {
    if (patientId !== null) loadHistory(patientId);
  }

  function handlePatientChange(_: unknown, next: PatientResponse | null) {
    setPatientId(next?.id ?? null);
    setHistory(null);
    if (next) loadHistory(next.id);
  }

  const editingEntry = drawerDetails?.type === 'edit'
    ? history?.entries.find((entry) => entry.id === drawerDetails.entryId) ?? null
    : null;

  const deleteTarget = deleteId !== null
    ? history?.entries.find((entry) => entry.id === deleteId) ?? null
    : null;

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function handleSaved() {
    showToast('Record entry saved.');
    closeDrawer();
    refreshHistory();
  }

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    try {
      await deleteMedicalRecord(deleteId);
      showToast('Record entry deleted.');
      setDeleteId(null);
      refreshHistory();
    } catch {
      setDeleteError('Could not delete this entry. Please try again.');
    }
  }

  function openConfirmDelete(entryId: string) {
    setDeleteError(null);
    setDeleteId(entryId);
  }

  function entryActions(entryId: string) {
    return (
      <Box className={styles.entryActions}>
        <Tooltip title="Edit entry">
          <IconButton size="small" onClick={() => openDrawer({ type: 'edit', entryId, title: 'Edit Entry' })}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete entry">
          <IconButton
            size="small"
            className={styles.deleteAction}
            onClick={() => openConfirmDelete(entryId)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box className={styles.page}>
      <PageHeader
        title="Medical Records"
        subtitle="Pick a patient to read and write their record."
        actions={(
          <Box className={styles.headerTools}>
            <Autocomplete
              className={styles.picker}
              options={patients}
              value={patient}
              onChange={handlePatientChange}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Patient" size="small" />}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              disabled={patient === null}
              onClick={() => openDrawer({ type: 'create', title: 'Add Entry' })}
            >
              Add Entry
            </Button>
          </Box>
        )}
      />

      {history !== null ? (
        <PatientRecord history={history} entryActions={entryActions} />
      ) : (
        <Typography className={styles.empty} color="textSecondary">
          Choose a patient to see their record.
        </Typography>
      )}

      <Drawer open={isDrawerOpen} onClose={closeDrawer} title={drawerDetails?.title ?? ''}>
        {patient !== null && (
          <MedicalRecordForm
            patientId={patient.id}
            entry={editingEntry ?? undefined}
            onSuccess={handleSaved}
            onCancel={closeDrawer}
          />
        )}
      </Drawer>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete entry"
        message={deleteTarget ? `Delete "${deleteTarget.title}" from this patient's record? This cannot be undone.` : ''}
        confirmLabel="Delete"
        confirmColor="error"
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
