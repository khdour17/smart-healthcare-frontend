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

import { registerPatient } from '../../../../../api/auth/RegisterAPI';
import styles from './AddPatientForm.module.scss';

interface AddPatientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddPatientForm({ onSuccess, onCancel }: AddPatientFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerPatient({ username, email, password, name, dateOfBirth, phone: phone || undefined, address: address || undefined });
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
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
      <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
      <TextField label="Date of Birth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
      <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
      <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
      <Box className={styles.actions}>
        <Button onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Patient'}
        </Button>
      </Box>
    </Box>
  );
}