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
  deleteDoctors,
  type DoctorResponse,
  getAllDoctors,
} from '../../../../api/doctors/DoctorsAPI';
import {
  ConfirmDialog,
} from '../../../../components/ConfirmDialog/ConfirmDialog';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AddDoctorForm } from './AddDoctorForm/AddDoctorForm';
import styles from './DoctorsPage.module.scss';

const columns: DataTableColumn<DoctorResponse>[] = [
  { key: 'name', label: 'Name', width: 220, render: (row) => row.name },
  { key: 'specialty', label: 'Specialty', width: 180, render: (row) => row.specialty },
  { key: 'username', label: 'Username', width: 160, render: (row) => row.username },
  { key: 'email', label: 'Email', width: 240, render: (row) => row.email },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function fetchDoctors() {
    getAllDoctors().then(setDoctors);
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  function handleCreated() {
    setIsDrawerOpen(false);
    fetchDoctors();
  }

  async function handleConfirmDelete() {
    await deleteDoctors(Array.from(selectedKeys).map(Number));
    setIsConfirmOpen(false);
    setSelectedKeys(new Set());
    fetchDoctors();
  }

  const hasSelection = selectedKeys.size > 0;

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Doctors</Typography>
        {hasSelection ? (
          <Box className={styles.selectionBar}>
            <Typography variant="body2" className={styles.selectionCount}>{selectedKeys.size} selected</Typography>
            <Tooltip title="Delete selected">
              <IconButton size="small" className={styles.selectionDelete} onClick={() => setIsConfirmOpen(true)}>
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
          <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => setIsDrawerOpen(true)}>Add Doctor</Button>
        )}
      </Box>

      <DataTable columns={columns} rows={doctors} getRowKey={(row) => row.id} emptyMessage="No doctors found." selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Doctor">
        <AddDoctorForm onSuccess={handleCreated} onCancel={() => setIsDrawerOpen(false)} />
      </Drawer>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete doctors"
        message={`Delete ${selectedKeys.size} doctor${selectedKeys.size === 1 ? '' : 's'}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </Box>
  );
}