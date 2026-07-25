import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Typography,
} from '@mui/material';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
      <Typography variant="h3">404</Typography>
      <Typography color="text.secondary">This page doesn't exist.</Typography>
      <Button variant="contained" onClick={() => navigate('/login')}>Back to Login</Button>
    </Box>
  );
}