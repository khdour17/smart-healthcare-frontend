import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Typography,
} from '@mui/material';

import { AuthContext } from '../../contexts/AuthContext';

export default function NotFoundPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(auth?.user ? '/dashboard' : '/login', { replace: true });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
      <Typography variant="h3">404</Typography>
      <Typography color="text.secondary">This page doesn't exist.</Typography>
      <Button variant="contained" onClick={handleGoBack}>
        {auth?.user ? 'Back to Dashboard' : 'Back to Login'}
      </Button>
    </Box>
  );
}