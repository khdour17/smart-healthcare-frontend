import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import {
  getPatientHistory,
  type PatientHistoryResponse,
} from '../../../../api/medicalRecords/MedicalRecordsAPI';
import { AuthContext } from '../../../../contexts/AuthContext';
import { PatientRecord } from '../../../shared/PatientRecord/PatientRecord';
import styles from './MedicalRecordsPage.module.scss';

export default function MedicalRecordsPage() {
  const auth = useContext(AuthContext);
  const patientId = auth?.user?.roleEntityId ?? null;
  const [history, setHistory] = useState<PatientHistoryResponse | null>(null);

  const refreshHistory = useCallback(() => {
    if (patientId !== null) {
      getPatientHistory(patientId).then(setHistory);
    }
  }, [patientId]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">My Medical Record</Typography>
      </Box>

      {history !== null && <PatientRecord history={history} />}
    </Box>
  );
}
