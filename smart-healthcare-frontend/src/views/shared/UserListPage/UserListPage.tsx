import {
  type ReactNode,
  useCallback,
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
  ConfirmDialog,
} from '../../../components/ConfirmDialog/ConfirmDialog';
import {
  DataTable,
  type DataTableColumn,
} from '../../../components/DataTable/DataTable';
import { Drawer } from '../../../components/Drawer/Drawer';
import { PageHeader } from '../../../components/PageHeader/PageHeader';
import { useToast } from '../../../utils/useToast';
import styles from './UserListPage.module.scss';

interface ListedUser {
  id: number;
}

interface UserListPageProps<T extends ListedUser> {
  title: string;
  subtitle: string;
  one: string;
  many: string;
  columns: DataTableColumn<T>[];
  loadAll: () => Promise<T[]>;
  deleteMany: (ids: number[]) => Promise<void>;
  renderAddForm: (handlers: { onSuccess: () => void; onCancel: () => void }) => ReactNode;
}

function deleteFailure(error: unknown, many: string): string {
  const message = isAxiosError(error) ? error.response?.data?.message : null;
  return message ?? `Could not delete one or more ${many}. They may have existing appointments or records.`;
}

export function UserListPage<T extends ListedUser>({
  title,
  subtitle,
  one,
  many,
  columns,
  loadAll,
  deleteMany,
  renderAddForm,
}: UserListPageProps<T>) {
  const showToast = useToast();
  const [rows, setRows] = useState<T[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refreshRows = useCallback(() => {
    loadAll().then(setRows);
  }, [loadAll]);

  useEffect(() => {
    refreshRows();
  }, [refreshRows]);

  function handleCreated() {
    showToast(`${one} created.`);
    setIsDrawerOpen(false);
    refreshRows();
  }

  function openConfirmDelete() {
    setDeleteError(null);
    setIsConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      await deleteMany(Array.from(selectedKeys).map(Number));
      setIsConfirmOpen(false);
      setSelectedKeys(new Set());
      showToast(`Deleted from ${many}.`);
      refreshRows();
    } catch (error) {
      setDeleteError(deleteFailure(error, many));
    }
  }

  const selectedCount = selectedKeys.size;

  return (
    <Box className={styles.page}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={selectedCount > 0 ? (
          <Box className={styles.selectionBar}>
            <Typography variant="body2" className={styles.selectionCount}>{selectedCount} selected</Typography>
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
          <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => setIsDrawerOpen(true)}>
            Add {one}
          </Button>
        )}
      />

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        emptyMessage={`No ${many} found.`}
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={`Add ${one}`}>
        {renderAddForm({ onSuccess: handleCreated, onCancel: () => setIsDrawerOpen(false) })}
      </Drawer>

      <ConfirmDialog
        open={isConfirmOpen}
        title={`Delete ${many}`}
        message={`Delete ${selectedCount} ${selectedCount === 1 ? one.toLowerCase() : many}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </Box>
  );
}
