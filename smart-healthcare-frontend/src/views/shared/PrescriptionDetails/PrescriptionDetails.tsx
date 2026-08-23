import {
  Box,
  Divider,
  Typography,
} from '@mui/material';

import type {
  PrescriptionResponse,
} from '../../../api/prescriptions/PrescriptionsAPI';
import styles from './PrescriptionDetails.module.scss';

interface PrescriptionDetailsProps {
  prescription: PrescriptionResponse;
  heading: string;
}

export function PrescriptionDetails({ prescription, heading }: PrescriptionDetailsProps) {
  return (
    <Box className={styles.details}>
      <Box className={styles.summary}>
        <Typography variant="subtitle1">{heading}</Typography>
        <Typography variant="body2" color="textSecondary">
          Written {prescription.prescriptionDate}
        </Typography>
        {prescription.appointmentDate && (
          <Typography variant="body2" color="textSecondary">
            For the appointment on {prescription.appointmentDate}
          </Typography>
        )}
      </Box>

      <Box className={styles.section}>
        <Typography variant="subtitle2">Diagnosis</Typography>
        <Typography variant="body2" color="textSecondary" className={styles.sectionBody}>
          {prescription.diagnosis || 'No diagnosis recorded.'}
        </Typography>
      </Box>

      <Divider />

      <Box className={styles.section}>
        <Typography variant="subtitle2">Medicines</Typography>
        {prescription.medicines.length > 0 ? (
          <Box component="ul" className={styles.medicines}>
            {prescription.medicines.map((medicine, index) => (
              <Typography component="li" variant="body2" color="textSecondary" key={index}>{medicine}</Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">No medicines listed.</Typography>
        )}
      </Box>

      <Divider />

      <Box className={styles.section}>
        <Typography variant="subtitle2">Instructions</Typography>
        <Typography variant="body2" color="textSecondary" className={styles.sectionBody}>
          {prescription.instructions || 'No instructions given.'}
        </Typography>
      </Box>
    </Box>
  );
}
