import {
  useEffect,
  useState,
} from 'react';

import {
  Autocomplete,
  Box,
  TextField,
  Typography,
} from '@mui/material';

import {
  getPatientHistory,
  type PatientHistoryResponse,
} from '../../../../api/medicalRecords/MedicalRecordsAPI';
import {
  getAllPatients,
  type PatientResponse,
} from '../../../../api/patients/PatientsAPI';
import { PatientRecord } from '../../../shared/PatientRecord/PatientRecord';
import styles from './MedicalRecordsPage.module.scss';

export default function MedicalRecordsPage() {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [history, setHistory] = useState<PatientHistoryResponse | null>(null);

  useEffect(() => {
    getAllPatients().then(setPatients);
  }, []);

  function handlePatientChange(_: unknown, next: PatientResponse | null) {
    setPatient(next);
    setHistory(null);
    if (next) getPatientHistory(next.id).then(setHistory);
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.headerRow}>
        <Typography variant="h5">Medical Records</Typography>
        <Autocomplete
          className={styles.picker}
          options={patients}
          value={patient}
          onChange={handlePatientChange}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label="Patient" size="small" />}
        />
      </Box>

      {history !== null ? (
        <PatientRecord history={history} />
      ) : (
        <Typography className={styles.empty} color="textSecondary">
          Choose a patient to see their record.
        </Typography>
      )}
    </Box>
  );
}
