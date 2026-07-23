import { Outlet } from 'react-router-dom';

import {
  Box,
  Button,
} from '@mui/material';

import { useAuth } from '../features/auth/useAuth';

export default function DashboardLayout() {
  const { logout, user } = useAuth();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, color: 'text.secondary' }}>
        [Placeholder Header/Sidebar — built in Phase 5] — Logged in as {user?.username} ({user?.role})
        <Button onClick={logout} sx={{ ml: 2 }}>Logout</Button>
      </Box>
      <Outlet />
    </Box>
  );
}