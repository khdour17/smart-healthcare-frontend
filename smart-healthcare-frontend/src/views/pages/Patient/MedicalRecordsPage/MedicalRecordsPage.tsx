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
import { PageHeader } from '../../../../components/PageHeader/PageHeader';
import styles from './MedicalRecordsPage.module.scss';

export default function MedicalRecordsPage() {
  const auth = useContext(AuthContext);
  const patientId = auth?.user?.roleEntityId ?? null;
  const [history, setHistory] = useState<PatientHistoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshHistory = useCallback(() => {
    if (patientId === null) return;
    getPatientHistory(patientId)
      .then(setHistory)
      .catch(() => setError('Could not load your medical record. Please try again later.'))
      .finally(() => setIsLoading(false));
  }, [patientId]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const isEmpty = history !== null
    && history.entries.length === 0
    && history.appointments.length === 0
    && history.prescriptions.length === 0;

  return (
    <Box className={styles.page}>
      <PageHeader title="My Medical Record" subtitle="Your visits, prescriptions and the notes your doctor wrote." />

      {isLoading && (
        <Typography className={styles.message} color="textSecondary">Loading your record...</Typography>
      )}

      {!isLoading && error !== null && (
        <Typography className={styles.message} color="error">{error}</Typography>
      )}

      {!isLoading && error === null && isEmpty && (
        <Typography className={styles.message} color="textSecondary">
          Nothing has been recorded yet. Your appointments, prescriptions and any notes your doctor
          writes will appear here.
        </Typography>
      )}

      {!isLoading && error === null && !isEmpty && history !== null && (
        <PatientRecord history={history} />
      )}
    </Box>
  );
}
