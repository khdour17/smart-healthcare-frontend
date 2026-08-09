import {
  type ChangeEvent,
  type SubmitEvent,
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Box,
  Button,
  MenuItem,
  TextField,
} from '@mui/material';
import { isAxiosError } from 'axios';

import {
  type AvailableSlotResponse,
  bookAppointment,
  getAvailableSlots,
} from '../../../../../api/appointments/AppointmentsAPI';
import {
  type DoctorResponse,
  getAllDoctors,
} from '../../../../../api/doctors/DoctorsAPI';
import { formatTime } from '../../../../../utils/formatTime';
import { openNativePicker } from '../../../../../utils/openNativePicker';
import styles from './BookAppointmentForm.module.scss';

interface BookAppointmentFormProps {
  patientId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface BookAppointmentFormData {
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  reason: string;
}

const initialFormData: BookAppointmentFormData = { doctorId: '', appointmentDate: '', startTime: '', reason: '' };

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** The backend answers 409 with an explanation ("Doctor not available on MONDAY") — prefer it over a generic message. */
function messageFromError(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error) && error.response?.status === 409) {
    return error.response.data?.message ?? fallback;
  }
  return fallback;
}

export function BookAppointmentForm({ patientId, onSuccess, onCancel }: BookAppointmentFormProps) {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [formData, setFormData] = useState<BookAppointmentFormData>(initialFormData);
  const [slots, setSlots] = useState<AvailableSlotResponse[]>([]);
  const [slotsMessage, setSlotsMessage] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllDoctors().then(setDoctors);
  }, []);

  function loadSlots(nextDoctorId: string, nextDate: string) {
    if (!nextDoctorId || !nextDate) {
      setSlots([]);
      setSlotsMessage(null);
      return;
    }
    setIsLoadingSlots(true);
    setSlotsMessage(null);
    getAvailableSlots(Number(nextDoctorId), nextDate)
      .then((data) => {
        setSlots(data);
        setSlotsMessage(data.length === 0 ? 'Every slot on this date is already booked.' : null);
      })
      .catch((err) => {
        setSlots([]);
        setSlotsMessage(messageFromError(err, 'Could not load available times.'));
      })
      .finally(() => setIsLoadingSlots(false));
  }

  function handleChange(field: keyof BookAppointmentFormData) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      // Changing the doctor or the date invalidates whichever slot was picked, and reopens the search.
      const resetSlot = field === 'doctorId' || field === 'appointmentDate';
      const next = { ...formData, [field]: e.target.value, ...(resetSlot ? { startTime: '' } : null) };
      setFormData(next);
      if (resetSlot) loadSlots(next.doctorId, next.appointmentDate);
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await bookAppointment(patientId, {
        doctorId: Number(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime,
        reason: formData.reason || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(messageFromError(err, 'Could not book the appointment. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  const canPickSlot = !isLoadingSlots && slots.length > 0;

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField select label="Doctor" value={formData.doctorId} onChange={handleChange('doctorId')} required fullWidth>
        {doctors.map((doctor) => (
          <MenuItem key={doctor.id} value={doctor.id}>{doctor.name} — {doctor.specialty}</MenuItem>
        ))}
      </TextField>

      <TextField
        label="Date"
        type="date"
        value={formData.appointmentDate}
        onChange={handleChange('appointmentDate')}
        required
        fullWidth
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayIso(), onClick: openNativePicker } }}
      />

      <TextField
        select
        label="Time"
        value={formData.startTime}
        onChange={handleChange('startTime')}
        required
        fullWidth
        disabled={!canPickSlot}
        helperText={isLoadingSlots ? 'Loading available times...' : slotsMessage ?? 'Pick a doctor and a date first.'}
      >
        {slots.map((slot) => (
          <MenuItem key={slot.startTime} value={slot.startTime}>
            {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
          </MenuItem>
        ))}
      </TextField>

      <TextField label="Reason" value={formData.reason} onChange={handleChange('reason')} fullWidth multiline minRows={3} />

      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting || !canPickSlot}>
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </Box>
    </Box>
  );
}
