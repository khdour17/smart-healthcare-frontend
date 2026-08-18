import {
  Box,
  Typography,
} from '@mui/material';

import type {
  PatientHistoryResponse,
} from '../../../api/medicalRecords/MedicalRecordsAPI';
import styles from './RecordSummary.module.scss';

interface RecordSummaryProps {
  history: PatientHistoryResponse;
}

interface Tile {
  label: string;
  value: string;
}

export function RecordSummary({ history }: RecordSummaryProps) {
  const completed = history.appointments.filter((appointment) => appointment.status === 'COMPLETED');
  const upcoming = history.appointments.filter((appointment) => appointment.status === 'SCHEDULED');
  const lastVisit = completed.map((appointment) => appointment.appointmentDate).sort().at(-1);

  const tiles: Tile[] = [
    { label: 'Last visit', value: lastVisit ?? 'None yet' },
    { label: 'Visits', value: String(completed.length) },
    { label: 'Upcoming', value: String(upcoming.length) },
    { label: 'Prescriptions', value: String(history.prescriptions.length) },
    { label: 'Notes', value: String(history.entries.length) },
  ];

  return (
    <Box className={styles.summary}>
      <Box>
        <Typography variant="h6">{history.patientName}</Typography>
        <Typography variant="body2" color="textSecondary">Medical record</Typography>
      </Box>

      <Box className={styles.stats}>
        {tiles.map((tile) => (
          <Box key={tile.label} className={styles.tile}>
            <Typography variant="body2" color="textSecondary">{tile.label}</Typography>
            <Typography variant="body1" className={styles.tileValue}>{tile.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
