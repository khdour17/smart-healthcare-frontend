import {
  useContext,
  useState,
} from 'react';

import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { AuthContext } from '../../../contexts/AuthContext';
import { Header } from './Header/Header';
import { LeftMenu } from './LeftMenu/LeftMenu';
import { getLeftMenuItems } from './LeftMenu/leftMenuConfig';
import {
  getMenuCollapsed,
  saveMenuCollapsed,
} from '../../../utils/menuPreference';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
  const auth = useContext(AuthContext);
  const items = auth?.user ? getLeftMenuItems(auth.user.role) : [];
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(getMenuCollapsed);

  function setMenuCollapsed(collapsed: boolean) {
    setIsMenuCollapsed(collapsed);
    saveMenuCollapsed(collapsed);
  }

  return (
    <Box className={styles.root}>
      <Header />
      <Box className={styles.body}>
        <LeftMenu items={items} collapsed={isMenuCollapsed} onToggle={() => setMenuCollapsed(!isMenuCollapsed)} />
        <Box component="main" className={styles.content}>
          <Outlet context={{ isMenuCollapsed, setMenuCollapsed }} />
        </Box>
      </Box>
    </Box>
  );
}