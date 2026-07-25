import { useContext } from 'react';

import { Outlet } from 'react-router-dom';

import {
  Box,
  Button,
} from '@mui/material';

import { AuthContext } from '../../contexts/AuthContext';

export default function DashboardLayout() {
  const auth = useContext(AuthContext);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, color: 'text.secondary' }}>
        Logged in as {auth?.user?.username} ({auth?.user?.role})
        <Button onClick={auth?.logout} sx={{ ml: 2 }}>Logout</Button>
      </Box>
      <Outlet />
    </Box>
  );
}