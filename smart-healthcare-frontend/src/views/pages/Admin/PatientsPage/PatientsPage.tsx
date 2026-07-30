import {
  useContext,
  useEffect,
  useState,
} from 'react';

import PersonAddAltIcon from '@mui/icons-material/PersonAddAltOutlined';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';

import {
  getAllPatients,
  type PatientResponse,
} from '../../../../api/patients/PatientsAPI';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AuthContext } from '../../../../contexts/AuthContext';
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
  const auth = useContext(AuthContext);
  // Backend rule: only ADMIN can register patients (auth/register/patient is
  // admin-only). DOCTOR can view this page (route allows ADMIN + DOCTOR) but
  // must never see the Add button or Drawer — enforced here, not just visually.
  const canAdd = auth?.user?.role === 'ADMIN';

  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getAllPatients();
      if (!cancelled) setPatients(data);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function refreshPatients() {
    const data = await getAllPatients();
    setPatients(data);
  }

  function handleCreated() {
    setIsDrawerOpen(false);
    refreshPatients();
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Patients</Typography>
        {canAdd && (
          <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => setIsDrawerOpen(true)}>
            Add Patient
          </Button>
        )}
      </Box>

      <DataTable columns={columns} rows={patients} getRowKey={(row) => row.id} emptyMessage="No patients found." />

      {canAdd && (
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Patient">
          <AddPatientForm onSuccess={handleCreated} onCancel={() => setIsDrawerOpen(false)} />
        </Drawer>
      )}
    </Box>
  );
}