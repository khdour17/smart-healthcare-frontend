import {
  type ChangeEvent,
  type SubmitEvent,
  useState,
} from 'react';

import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import {
  type AppointmentResponse,
  completeAppointment,
} from '../../../../../api/appointments/AppointmentsAPI';
import { formatTime } from '../../../../../utils/formatTime';
import styles from './CompleteAppointmentForm.module.scss';

interface CompleteAppointmentFormProps {
  appointment: AppointmentResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CompleteAppointmentForm({ appointment, onSuccess, onCancel }: CompleteAppointmentFormProps) {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setNotes(e.target.value);
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await completeAppointment(appointment.id, notes);
      onSuccess();
    } catch {
      setError('Could not complete this appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box className={styles.summary}>
        <Typography variant="subtitle1">{appointment.patientName}</Typography>
        <Typography variant="body2" color="textSecondary">
          {appointment.appointmentDate} · {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
        </Typography>
        {appointment.reason && (
          <Typography variant="body2" color="textSecondary">Reason: {appointment.reason}</Typography>
        )}
      </Box>

      <TextField
        label="Notes"
        value={notes}
        onChange={handleChange}
        fullWidth
        multiline
        className={styles.notes}
      />

      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Completing...' : 'Complete'}
        </Button>
      </Box>
    </Box>
  );
}
