import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import { useAuth } from './useAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch {
      setError('Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user) {
    navigate(`/dashboard/${user.role.toLowerCase()}`, { replace: true });
    return null;
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 360,
        mx: 'auto',
        mt: 10,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5">Sign in</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </Box>
  );
}