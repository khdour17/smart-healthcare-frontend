import {
  useContext,
  useState,
} from 'react';

import { Navigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import { loginRequest } from '../../../api/auth/LoginAPI';
import logo from '../../../assets/images/logo.png';
import {
  AuthContext,
  type AuthUser,
} from '../../../contexts/AuthContext';
import { saveSession } from '../../../utils/authStorage';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useContext(AuthContext);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await loginRequest({ username, password });
      const authUser: AuthUser = {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
        roleEntityId: response.roleEntityId,
      };
      saveSession(response.token, authUser);
      auth?.setUser(authUser);
    } catch {
      setError('Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (auth?.user) return <Navigate to="/dashboard" replace />;

  return (
    <Box className={styles.page}>
      <Box className={styles.card}>
        <Box className={styles.logo}>
          <Box component="img" src={logo} alt="Smart Healthcare logo" className={styles.logoImage} />
          <Typography variant="h6" className={styles.logoTitle}>Smart Healthcare</Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" className={styles.subtitle}>Sign in to manage your appointments</Typography>
        {error && <Alert severity="error" className={styles.errorAlert}>{error}</Alert>}
        <Box component="form" className={styles.form} onSubmit={handleSubmit}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}