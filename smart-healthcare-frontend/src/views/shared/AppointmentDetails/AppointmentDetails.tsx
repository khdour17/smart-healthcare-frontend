import {
  useEffect,
  useState,
} from 'react';

import { isAxiosError } from 'axios';

import {
  Box,
  Divider,
  Typography,
} from '@mui/material';

import type {
  AppointmentResponse,
} from '../../../api/appointments/AppointmentsAPI';
import {
  getPrescriptionByAppointment,
  type PrescriptionResponse,
} from '../../../api/prescriptions/PrescriptionsAPI';
import { formatTime } from '../../../utils/formatTime';
import {
  AppointmentStatusChip,
} from '../AppointmentStatusChip/AppointmentStatusChip';
import styles from './AppointmentDetails.module.scss';

interface AppointmentDetailsProps {
  appointment: AppointmentResponse;
  heading: string;
}

export function AppointmentDetails({ appointment, heading }: AppointmentDetailsProps) {
  const [prescription, setPrescription] = useState<PrescriptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPrescriptionByAppointment(appointment.id)
      .then(setPrescription)
      .catch((err) => {
        setPrescription(null);
        setError(isAxiosError(err) && err.response?.status === 404
          ? null
          : 'Could not load the prescription.');
      })
      .finally(() => setIsLoading(false));
  }, [appointment.id]);

  return (
    <Box className={styles.details}>
      <Box className={styles.summary}>
        <Typography variant="subtitle1">{heading}</Typography>
        <Typography variant="body2" color="textSecondary">
          {appointment.appointmentDate} · {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
        </Typography>
        <Box><AppointmentStatusChip status={appointment.status} /></Box>
      </Box>

      <Box className={styles.section}>
        <Typography variant="subtitle2">Reason</Typography>
        <Typography variant="body2" color="textSecondary" className={styles.sectionBody}>
          {appointment.reason || 'No reason given.'}
        </Typography>
      </Box>

      <Divider />

      <Box className={styles.section}>
        <Typography variant="subtitle2">Notes</Typography>
        <Typography variant="body2" color="textSecondary" className={styles.sectionBody}>
          {appointment.notes || 'No notes recorded.'}
        </Typography>
      </Box>

      <Divider />

      <Box className={styles.section}>
        <Typography variant="subtitle2">Prescription</Typography>
        {isLoading ? (
          <Typography variant="body2" color="textSecondary">Loading...</Typography>
        ) : error ? (
          <Typography variant="body2" color="error">{error}</Typography>
        ) : prescription ? (
          <>
            <Typography variant="body2" color="textSecondary" className={styles.sectionBody}>
              Diagnosis: {prescription.diagnosis || '—'}
            </Typography>
            {prescription.medicines.length > 0 && (
              <Box component="ul" className={styles.medicines}>
                {prescription.medicines.map((medicine, index) => (
                  <Typography component="li" variant="body2" color="textSecondary" key={index}>{medicine}</Typography>
                ))}
              </Box>
            )}
            <Typography variant="body2" color="textSecondary" className={styles.sectionBody}>
              Instructions: {prescription.instructions || '—'}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">No prescription for this visit.</Typography>
        )}
      </Box>
    </Box>
  );
}
