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
} from '@mui/material';

import {
  registerDoctor,
  type RegisterDoctorRequest,
} from '../../../../../api/auth/RegisterAPI';
import styles from './AddDoctorForm.module.scss';

interface AddDoctorFormProps { onSuccess: () => void; onCancel: () => void; }

const initialFormData: RegisterDoctorRequest = { username: '', email: '', password: '', name: '', specialty: '' };

export function AddDoctorForm({ onSuccess, onCancel }: AddDoctorFormProps) {
  const [formData, setFormData] = useState<RegisterDoctorRequest>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof RegisterDoctorRequest) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerDoctor(formData);
      onSuccess();
    } catch {
      setError('Could not create doctor. Check the details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Username" value={formData.username} onChange={handleChange('username')} required fullWidth />
      <TextField label="Email" type="email" value={formData.email} onChange={handleChange('email')} required fullWidth />
      <TextField label="Password" type="password" value={formData.password} onChange={handleChange('password')} required fullWidth />
      <TextField label="Full Name" value={formData.name} onChange={handleChange('name')} required fullWidth />
      <TextField label="Specialty" value={formData.specialty} onChange={handleChange('specialty')} required fullWidth />
      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Doctor'}</Button>
      </Box>
    </Box>
  );
}