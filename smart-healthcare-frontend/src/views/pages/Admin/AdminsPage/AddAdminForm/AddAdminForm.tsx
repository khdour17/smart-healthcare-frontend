import {
  type SubmitEvent,
  useState,
} from 'react';

import {
  Alert,
  Box,
  Button,
  TextField,
} from '@mui/material';

import { registerAdmin } from '../../../../../api/auth/RegisterAPI';
import styles from './AddAdminForm.module.scss';

interface AddAdminFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddAdminForm({ onSuccess, onCancel }: AddAdminFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerAdmin({ username, email, password, name, department });
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
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
      <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
      <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required fullWidth />
      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Admin'}
        </Button>
      </Box>
    </Box>
  );
}