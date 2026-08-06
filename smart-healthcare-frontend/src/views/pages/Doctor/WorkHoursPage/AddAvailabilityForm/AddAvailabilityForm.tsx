import {
  type SubmitEvent,
  useState,
} from 'react';

import {
  Alert,
  Box,
  Button,
  MenuItem,
  TextField,
} from '@mui/material';

import {
  type DoctorAvailabilityRequest,
  setAvailability,
} from '../../../../../api/availability/AvailabilityAPI';
import type { DayOfWeek } from '../../../../../types/common';
import { openNativePicker } from '../../../../../utils/openNativePicker';
import styles from './AddAvailabilityForm.module.scss';

interface AddAvailabilityFormProps {
  doctorId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const days: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const initialFormData: DoctorAvailabilityRequest = {
  dayOfWeek: 'MONDAY',
  startTime: '09:00',
  endTime: '17:00',
  slotDurationMinutes: 30,
};

export function AddAvailabilityForm({ doctorId, onSuccess, onCancel }: AddAvailabilityFormProps) {
  const [formData, setFormData] = useState<DoctorAvailabilityRequest>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof DoctorAvailabilityRequest) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'slotDurationMinutes' ? Number(e.target.value) : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await setAvailability(doctorId, formData);
      onSuccess();
    } catch {
      setError('Could not save availability. Check the details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField select label="Day of Week" value={formData.dayOfWeek} onChange={handleChange('dayOfWeek')} required fullWidth>
        {days.map((day) => (
          <MenuItem key={day} value={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Start Time"
        type="time"
        value={formData.startTime}
        onChange={handleChange('startTime')}
        required
        fullWidth
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { onClick: openNativePicker } }}
      />
      <TextField
        label="End Time"
        type="time"
        value={formData.endTime}
        onChange={handleChange('endTime')}
        required
        fullWidth
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { onClick: openNativePicker } }}
      />
      <TextField label="Slot Duration (minutes)" type="number" value={formData.slotDurationMinutes} onChange={handleChange('slotDurationMinutes')} required fullWidth />
      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
      </Box>
    </Box>
  );
}