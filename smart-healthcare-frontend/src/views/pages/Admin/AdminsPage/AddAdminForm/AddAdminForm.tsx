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
  registerAdmin,
  type RegisterAdminRequest,
} from '../../../../../api/auth/RegisterAPI';
import styles from './AddAdminForm.module.scss';

interface AddAdminFormProps { onSuccess: () => void; onCancel: () => void; }

const initialFormData: RegisterAdminRequest = { username: '', email: '', password: '', name: '', department: '' };

export function AddAdminForm({ onSuccess, onCancel }: AddAdminFormProps) {
  const [formData, setFormData] = useState<RegisterAdminRequest>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof RegisterAdminRequest) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerAdmin(formData);
      onSuccess();
    } catch {
      setError('Could not create admin. Check the details and try again.');
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
      <TextField label="Department" value={formData.department} onChange={handleChange('department')} required fullWidth />
      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Admin'}</Button>
      </Box>
    </Box>
  );
}