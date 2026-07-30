import {
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
  type DoctorResponse,
  getAllDoctors,
} from '../../../../api/doctors/DoctorsAPI';
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getAllDoctors();
      if (!cancelled) setDoctors(data);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function refreshDoctors() {
    const data = await getAllDoctors();
    setDoctors(data);
  }

  function handleCreated() {
    setIsDrawerOpen(false);
    refreshDoctors();
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Doctors</Typography>
        <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => setIsDrawerOpen(true)}>
          Add Doctor
        </Button>
      </Box>

      <DataTable columns={columns} rows={doctors} getRowKey={(row) => row.id} emptyMessage="No doctors found." />

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Doctor">
        <AddDoctorForm onSuccess={handleCreated} onCancel={() => setIsDrawerOpen(false)} />
      </Drawer>
    </Box>
  );
}