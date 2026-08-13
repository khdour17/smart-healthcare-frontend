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
  type AppointmentRequest,
  type AvailableSlotResponse,
  bookAppointment,
  getAvailableSlots,
} from '../../../../../api/appointments/AppointmentsAPI';
import {
  type DoctorResponse,
  getAllDoctors,
  getDoctorsBySpecialty,
} from '../../../../../api/doctors/DoctorsAPI';
import { formatTime } from '../../../../../utils/formatTime';
import { openNativePicker } from '../../../../../utils/openNativePicker';
import { todayIso } from '../../../../../utils/todayIso';
import styles from './BookAppointmentForm.module.scss';

interface BookAppointmentFormProps {
  patientId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const initialFormData: AppointmentRequest = { doctorId: 0, appointmentDate: '', startTime: '', reason: '' };

function messageFromError(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error) && error.response?.status === 409) {
    return error.response.data?.message ?? fallback;
  }
  return fallback;
}

export function BookAppointmentForm({ patientId, onSuccess, onCancel }: BookAppointmentFormProps) {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialty, setSpecialty] = useState('');
  const [formData, setFormData] = useState<AppointmentRequest>(initialFormData);
  const [slots, setSlots] = useState<AvailableSlotResponse[]>([]);
  const [slotsMessage, setSlotsMessage] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllDoctors().then((data) => {
      setDoctors(data);
      setSpecialties([...new Set(data.map((doctor) => doctor.specialty))].sort());
    });
  }, []);

  function loadSlots(nextDoctorId: number, nextDate: string) {
    if (!nextDoctorId || !nextDate) {
      setSlots([]);
      setSlotsMessage(null);
      return;
    }
    setIsLoadingSlots(true);
    setSlotsMessage(null);
    getAvailableSlots(nextDoctorId, nextDate)
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

  function handleSpecialtyChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSpecialty(value);
    setFormData((prev) => ({ ...prev, doctorId: 0, startTime: '' }));
    setSlots([]);
    setSlotsMessage(null);
    const request = value ? getDoctorsBySpecialty(value) : getAllDoctors();
    request.then(setDoctors);
  }

  function handleDoctorChange(e: ChangeEvent<HTMLInputElement>) {
    const doctorId = Number(e.target.value);
    setFormData((prev) => ({ ...prev, doctorId, startTime: '' }));
    loadSlots(doctorId, formData.appointmentDate);
  }

  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    const appointmentDate = e.target.value;
    setFormData((prev) => ({ ...prev, appointmentDate, startTime: '' }));
    loadSlots(formData.doctorId, appointmentDate);
  }

  function handleStartTimeChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, startTime: e.target.value }));
  }

  function handleReasonChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, reason: e.target.value }));
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await bookAppointment(patientId, formData);
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

      <TextField select label="Specialty" value={specialty} onChange={handleSpecialtyChange} fullWidth>
        <MenuItem value="">All specialties</MenuItem>
        {specialties.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Doctor"
        value={formData.doctorId || ''}
        onChange={handleDoctorChange}
        required
        fullWidth
        disabled={doctors.length === 0}
        helperText={doctors.length === 0 && specialty ? `No doctors listed under ${specialty}.` : undefined}
      >
        {doctors.map((doctor) => (
          <MenuItem key={doctor.id} value={doctor.id}>
            {specialty ? doctor.name : `${doctor.name} — ${doctor.specialty}`}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Date"
        type="date"
        value={formData.appointmentDate}
        onChange={handleDateChange}
        required
        fullWidth
        slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayIso(), onClick: openNativePicker } }}
      />

      <TextField
        select
        label="Time"
        value={formData.startTime}
        onChange={handleStartTimeChange}
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

      <TextField label="Reason" value={formData.reason} onChange={handleReasonChange} fullWidth multiline minRows={3} />

      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting || !canPickSlot}>
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </Box>
    </Box>
  );
}
