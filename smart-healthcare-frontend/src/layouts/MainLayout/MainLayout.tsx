import { useContext } from 'react';

import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { Header } from '../../components/Header/Header';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { getSidebarItems } from '../../constants/sidebarConfig';
import { AuthContext } from '../../contexts/AuthContext';

export default function MainLayout() {
  const auth = useContext(AuthContext);
  const items = auth?.user ? getSidebarItems(auth.user.role) : [];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Sidebar items={items} />
      <Box component="main" sx={{ flexGrow: 1, mt: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}