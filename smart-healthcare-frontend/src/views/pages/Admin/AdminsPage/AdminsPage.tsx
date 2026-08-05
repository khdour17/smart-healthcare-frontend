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
  type AdminResponse,
  getAllAdmins,
} from '../../../../api/admin/AdminAPI';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AddAdminForm } from './AddAdminForm/AddAdminForm';
import styles from './AdminsPage.module.scss';

const columns: DataTableColumn<AdminResponse>[] = [
  { key: 'name', label: 'Name', width: 220, render: (row) => row.name },
  { key: 'department', label: 'Department', width: 180, render: (row) => row.department },
  { key: 'username', label: 'Username', width: 160, render: (row) => row.username },
  { key: 'email', label: 'Email', width: 240, render: (row) => row.email },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function fetchAdmins() {
    getAllAdmins().then(setAdmins);
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  function handleCreated() {
    setIsDrawerOpen(false);
    fetchAdmins();
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Admins</Typography>
        <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => setIsDrawerOpen(true)}>Add Admin</Button>
      </Box>
      <DataTable columns={columns} rows={admins} getRowKey={(row) => row.id} emptyMessage="No admins found." />
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Admin">
        <AddAdminForm onSuccess={handleCreated} onCancel={() => setIsDrawerOpen(false)} />
      </Drawer>
    </Box>
  );
}