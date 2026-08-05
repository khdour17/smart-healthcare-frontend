import {
  useEffect,
  useState,
} from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAltOutlined';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  deletePatients,
  getAllPatients,
  type PatientResponse,
} from '../../../../api/patients/PatientsAPI';
import {
  ConfirmDialog,
} from '../../../../components/ConfirmDialog/ConfirmDialog';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AddPatientForm } from './AddPatientForm/AddPatientForm';
import styles from './PatientsPage.module.scss';

const columns: DataTableColumn<PatientResponse>[] = [
  { key: 'name', label: 'Name', width: 220, render: (row) => row.name },
  { key: 'dateOfBirth', label: 'Date of Birth', width: 140, render: (row) => row.dateOfBirth },
  { key: 'phone', label: 'Phone', width: 140, render: (row) => row.phone },
  { key: 'username', label: 'Username', width: 160, render: (row) => row.username },
  { key: 'email', label: 'Email', width: 240, render: (row) => row.email },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function fetchPatients() {
    getAllPatients().then(setPatients);
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  function handleCreated() {
    setIsDrawerOpen(false);
    fetchPatients();
  }

  function openConfirmDelete() {
    setDeleteError(null);
    setIsConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      await deletePatients(Array.from(selectedKeys).map(Number));
      setIsConfirmOpen(false);
      setSelectedKeys(new Set());
      fetchPatients();
    } catch {
      setDeleteError('Could not delete one or more patients. They may have existing appointments or records.');
    }
  }

  const hasSelection = selectedKeys.size > 0;

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Patients</Typography>
        {hasSelection ? (
          <Box className={styles.selectionBar}>
            <Typography variant="body2" className={styles.selectionCount}>{selectedKeys.size} selected</Typography>
            <Tooltip title="Delete selected">
              <IconButton size="small" className={styles.selectionDelete} onClick={openConfirmDelete}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear selection">
              <IconButton size="small" onClick={() => setSelectedKeys(new Set())}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => setIsDrawerOpen(true)}>Add Patient</Button>
        )}
      </Box>

      <DataTable columns={columns} rows={patients} getRowKey={(row) => row.id} emptyMessage="No patients found." selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Patient">
        <AddPatientForm onSuccess={handleCreated} onCancel={() => setIsDrawerOpen(false)} />
      </Drawer>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete patients"
        message={`Delete ${selectedKeys.size} patient${selectedKeys.size === 1 ? '' : 's'}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </Box>
  );
}