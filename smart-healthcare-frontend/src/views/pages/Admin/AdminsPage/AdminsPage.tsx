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
import { isAxiosError } from 'axios';

import {
  type AdminResponse,
  deleteAdmins,
  getAllAdmins,
} from '../../../../api/admin/AdminAPI';
import {
  ConfirmDialog,
} from '../../../../components/ConfirmDialog/ConfirmDialog';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AddAdminForm } from './AddAdminForm/AddAdminForm';
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
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
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  function openConfirmDelete() {
    setDeleteError(null);
    setIsConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      await deleteAdmins(Array.from(selectedKeys).map(Number));
      setIsConfirmOpen(false);
      setSelectedKeys(new Set());
      fetchAdmins();
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.message : null;
      setDeleteError(message ?? 'Could not delete one or more admins.');
    }
  }

  const hasSelection = selectedKeys.size > 0;

  return (
    <Box className={styles.page}>
      <PageHeader
        title="Admins"
        subtitle="The people who can manage the system."
        actions={hasSelection ? (
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
            <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => setIsDrawerOpen(true)}>Add Admin</Button>
        )}
      />

      <DataTable columns={columns} rows={admins} getRowKey={(row) => row.id} emptyMessage="No admins found." selectable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Admin">
        <AddAdminForm onSuccess={handleCreated} onCancel={() => setIsDrawerOpen(false)} />
      </Drawer>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete admins"
        message={`Delete ${selectedKeys.size} admin${selectedKeys.size === 1 ? '' : 's'}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </Box>
  );
}
