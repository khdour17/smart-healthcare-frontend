import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  deletePrescription,
  getDoctorPrescriptions,
  type PrescriptionResponse,
} from '../../../../api/prescriptions/PrescriptionsAPI';
import {
  ConfirmDialog,
} from '../../../../components/ConfirmDialog/ConfirmDialog';
import {
  DataTable,
  type DataTableColumn,
} from '../../../../components/DataTable/DataTable';
import { Drawer } from '../../../../components/Drawer/Drawer';
import { AuthContext } from '../../../../contexts/AuthContext';
import { byNewestFirst } from '../../../../utils/byNewestFirst';
import {
  PrescriptionDetails,
} from '../../../shared/PrescriptionDetails/PrescriptionDetails';
import {
  PrescriptionForm,
} from '../../../shared/PrescriptionForm/PrescriptionForm';
import styles from './PrescriptionsPage.module.scss';

type DrawerType = 'details' | 'edit';

interface DrawerDetails {
  prescriptionId: string;
  type: DrawerType;
  title: string;
}

export default function PrescriptionsPage() {
  const auth = useContext(AuthContext);
  const doctorId = auth?.user?.roleEntityId ?? null;
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [drawerDetails, setDrawerDetails] = useState<DrawerDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const refreshPrescriptions = useCallback(() => {
    if (doctorId !== null) {
      getDoctorPrescriptions(doctorId)
        .then((data) => setPrescriptions([...data].sort(byNewestFirst((item) => item.prescriptionDate))));
    }
  }, [doctorId]);

  useEffect(() => {
    refreshPrescriptions();
  }, [refreshPrescriptions]);

  const drawerPrescription = drawerDetails
    ? prescriptions.find((prescription) => prescription.id === drawerDetails.prescriptionId) ?? null
    : null;

  const deleteTarget = deleteId !== null
    ? prescriptions.find((prescription) => prescription.id === deleteId) ?? null
    : null;

  function openDetails(prescription: PrescriptionResponse) {
    setDrawerDetails({ prescriptionId: prescription.id, type: 'details', title: 'Prescription Details' });
    setIsDrawerOpen(true);
  }

  function openEdit(prescription: PrescriptionResponse) {
    setDrawerDetails({ prescriptionId: prescription.id, type: 'edit', title: 'Edit Prescription' });
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function handleSaved() {
    closeDrawer();
    refreshPrescriptions();
  }

  function openConfirmDelete(prescription: PrescriptionResponse) {
    setDeleteError(null);
    setDeleteId(prescription.id);
  }

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    try {
      await deletePrescription(deleteId);
      setDeleteId(null);
      refreshPrescriptions();
    } catch {
      setDeleteError('Could not delete this prescription. Please try again.');
    }
  }

  const columns: DataTableColumn<PrescriptionResponse>[] = [
    { key: 'prescriptionDate', label: 'Date', width: 140, render: (row) => row.prescriptionDate },
    { key: 'patientName', label: 'Patient', width: 200, render: (row) => row.patientName },
    { key: 'diagnosis', label: 'Diagnosis', render: (row) => row.diagnosis || '—' },
    {
      key: 'medicines',
      label: 'Medicines',
      width: 140,
      render: (row) => (row.medicines.length === 1 ? '1 medicine' : `${row.medicines.length} medicines`),
    },
    {
      key: 'actions',
      label: '',
      width: 150,
      render: (row) => (
        <Box className={styles.rowActions}>
          <Tooltip title="Edit prescription">
            <IconButton size="small" onClick={() => openEdit(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete prescription">
            <IconButton size="small" className={styles.deleteAction} onClick={() => openConfirmDelete(row)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View details">
            <IconButton size="small" onClick={() => openDetails(row)}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Prescriptions</Typography>
      </Box>

      <DataTable
        columns={columns}
        rows={prescriptions}
        getRowKey={(row) => row.id}
        emptyMessage="You have not written any prescriptions yet."
      />

      <Drawer open={isDrawerOpen} onClose={closeDrawer} title={drawerDetails?.title ?? ''}>
        {drawerPrescription !== null && (
          drawerDetails?.type === 'edit' ? (
            <PrescriptionForm
              appointmentId={drawerPrescription.appointmentId}
              prescription={drawerPrescription}
              onSuccess={handleSaved}
              onCancel={closeDrawer}
            />
          ) : (
            <PrescriptionDetails prescription={drawerPrescription} heading={drawerPrescription.patientName} />
          )
        )}
      </Drawer>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete prescription"
        message={deleteTarget
          ? `Delete the prescription for ${deleteTarget.patientName} written on ${deleteTarget.prescriptionDate}? The patient will no longer see it.`
          : ''}
        confirmLabel="Delete"
        confirmColor="error"
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
