import {
  type FormEvent,
  useContext,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import { AuthContext } from '../../contexts/AuthContext';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await auth?.login(username, password);
    } catch {
      setError('Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (auth?.user) {
    navigate(`/dashboard/${auth.user.role.toLowerCase()}`, { replace: true });
    return null;
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.card}>
        <Box className={styles.logo}>
          <LocalHospitalIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Smart Healthcare</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to manage your appointments
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" className={styles.form} onSubmit={handleSubmit}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ mt: 1 }}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}