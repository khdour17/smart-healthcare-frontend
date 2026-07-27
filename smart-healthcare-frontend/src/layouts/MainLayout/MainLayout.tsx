import { useContext } from 'react';

import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { AuthContext } from '../../contexts/AuthContext';
import { Header } from '../../pages/Header/Header';
import { LeftMenu } from '../../pages/LeftMenu/LeftMenu';
import { getLeftMenuItems } from '../../pages/LeftMenu/leftMenuConfig';

export default function MainLayout() {
  const auth = useContext(AuthContext);
  const items = auth?.user ? getLeftMenuItems(auth.user.role) : [];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <LeftMenu items={items} />
      <Box component="main" sx={{ flexGrow: 1, mt: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}