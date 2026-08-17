import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import EditIcon from '@mui/icons-material/EditOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  getDoctorPrescriptions,
  type PrescriptionResponse,
} from '../../../../api/prescriptions/PrescriptionsAPI';
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

  function openDetails(prescription: PrescriptionResponse) {
    setDrawerDetails({ prescriptionId: prescription.id, type: 'details', title: 'Prescription Details' });
  }

  function openEdit(prescription: PrescriptionResponse) {
    setDrawerDetails({ prescriptionId: prescription.id, type: 'edit', title: 'Edit Prescription' });
  }

  function closeDrawer() {
    setDrawerDetails(null);
  }

  function handleSaved() {
    closeDrawer();
    refreshPrescriptions();
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
      width: 110,
      render: (row) => (
        <Box className={styles.rowActions}>
          <Tooltip title="Edit prescription">
            <IconButton size="small" onClick={() => openEdit(row)}>
              <EditIcon fontSize="small" />
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

      {drawerDetails !== null && drawerPrescription !== null && (
        <Drawer open onClose={closeDrawer} title={drawerDetails.title}>
          {drawerDetails.type === 'edit' ? (
            <PrescriptionForm
              appointmentId={drawerPrescription.appointmentId}
              prescription={drawerPrescription}
              onSuccess={handleSaved}
              onCancel={closeDrawer}
            />
          ) : (
            <PrescriptionDetails prescription={drawerPrescription} heading={drawerPrescription.patientName} />
          )}
        </Drawer>
      )}
    </Box>
  );
}
