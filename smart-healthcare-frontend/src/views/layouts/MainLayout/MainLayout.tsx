import {
  useContext,
  useState,
} from 'react';

import { Outlet } from 'react-router-dom';

import {
  Box,
  Drawer as MuiDrawer,
} from '@mui/material';

import { AuthContext } from '../../../contexts/AuthContext';
import {
  getMenuCollapsed,
  saveMenuCollapsed,
} from '../../../utils/preferences';
import { Header } from './Header/Header';
import { LeftMenu } from './LeftMenu/LeftMenu';
import { getLeftMenuItems } from './LeftMenu/leftMenuConfig';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
  const auth = useContext(AuthContext);
  const items = auth?.user ? getLeftMenuItems(auth.user.role) : [];
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(getMenuCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function setMenuCollapsed(collapsed: boolean) {
    setIsMenuCollapsed(collapsed);
    saveMenuCollapsed(collapsed);
  }

  return (
    <Box className={styles.root}>
      <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />
      <Box className={styles.body}>
        <Box className={styles.wideMenu}>
          <LeftMenu
            items={items}
            collapsed={isMenuCollapsed}
            onToggle={() => setMenuCollapsed(!isMenuCollapsed)}
          />
        </Box>

        <MuiDrawer
          anchor="left"
          open={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          slotProps={{ paper: { className: styles.narrowMenuPaper } }}
        >
          <LeftMenu items={items} collapsed={false} onNavigate={() => setIsMobileMenuOpen(false)} />
        </MuiDrawer>

        <Box component="main" className={styles.content}>
          <Outlet context={{ isMenuCollapsed, setMenuCollapsed }} />
        </Box>
      </Box>
    </Box>
  );
}
