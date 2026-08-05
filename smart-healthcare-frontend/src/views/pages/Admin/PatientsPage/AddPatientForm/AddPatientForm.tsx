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
  registerPatient,
  type RegisterPatientRequest,
} from '../../../../../api/auth/RegisterAPI';
import styles from './AddPatientForm.module.scss';

interface AddPatientFormProps { onSuccess: () => void; onCancel: () => void; }

const initialFormData: RegisterPatientRequest = {
  username: '', email: '', password: '', name: '', dateOfBirth: '', phone: '', address: '',
};

export function AddPatientForm({ onSuccess, onCancel }: AddPatientFormProps) {
  const [formData, setFormData] = useState<RegisterPatientRequest>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof RegisterPatientRequest) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerPatient({
        ...formData,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });
      onSuccess();
    } catch {
      setError('Could not create patient. Check the details and try again.');
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
      <TextField label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange('dateOfBirth')} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
      <TextField label="Phone" value={formData.phone} onChange={handleChange('phone')} fullWidth />
      <TextField label="Address" value={formData.address} onChange={handleChange('address')} fullWidth />
      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Patient'}</Button>
      </Box>
    </Box>
  );
}