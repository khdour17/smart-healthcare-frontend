import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import InfoIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  getPatientPrescriptions,
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
import styles from './PrescriptionsPage.module.scss';

export default function PrescriptionsPage() {
  const auth = useContext(AuthContext);
  const patientId = auth?.user?.roleEntityId ?? null;
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const refreshPrescriptions = useCallback(() => {
    if (patientId !== null) {
      getPatientPrescriptions(patientId)
        .then((data) => setPrescriptions([...data].sort(byNewestFirst((item) => item.prescriptionDate))));
    }
  }, [patientId]);

  useEffect(() => {
    refreshPrescriptions();
  }, [refreshPrescriptions]);

  const detailsPrescription = detailsId !== null
    ? prescriptions.find((prescription) => prescription.id === detailsId) ?? null
    : null;

  const columns: DataTableColumn<PrescriptionResponse>[] = [
    { key: 'prescriptionDate', label: 'Date', width: 140, render: (row) => row.prescriptionDate },
    { key: 'doctorName', label: 'Doctor', width: 200, render: (row) => row.doctorName },
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
      width: 72,
      render: (row) => (
        <Box className={styles.rowActions}>
          <Tooltip title="View details">
            <IconButton size="small" onClick={() => setDetailsId(row.id)}>
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
        <Typography variant="h5">My Prescriptions</Typography>
      </Box>

      <DataTable
        columns={columns}
        rows={prescriptions}
        getRowKey={(row) => row.id}
        emptyMessage="No prescriptions yet."
      />

      {detailsPrescription !== null && (
        <Drawer open onClose={() => setDetailsId(null)} title="Prescription Details">
          <PrescriptionDetails prescription={detailsPrescription} heading={detailsPrescription.doctorName} />
        </Drawer>
      )}
    </Box>
  );
}
