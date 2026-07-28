import { useContext } from 'react';

import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { AuthContext } from '../../../contexts/AuthContext';
import { Header } from './Header/Header';
import { LeftMenu } from './LeftMenu/LeftMenu';
import { getLeftMenuItems } from './LeftMenu/leftMenuConfig';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
  const auth = useContext(AuthContext);
  const items = auth?.user ? getLeftMenuItems(auth.user.role) : [];

  return (
    <Box className={styles.root}>
      <Header />
      <Box className={styles.body}>
        <LeftMenu items={items} />
        <Box component="main" className={styles.content}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}