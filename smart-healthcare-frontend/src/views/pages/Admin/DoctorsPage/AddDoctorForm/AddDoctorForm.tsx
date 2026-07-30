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

import { registerDoctor } from '../../../../../api/auth/RegisterAPI';
import styles from './AddDoctorForm.module.scss';

interface AddDoctorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddDoctorForm({ onSuccess, onCancel }: AddDoctorFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerDoctor({ username, email, password, name, specialty });
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
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
      <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
      <TextField label="Specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required fullWidth />
      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Doctor'}
        </Button>
      </Box>
    </Box>
  );
}