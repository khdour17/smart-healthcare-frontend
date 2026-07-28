import { useState } from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';

import styles from './LeftMenu.module.scss';
import type { LeftMenuItem } from './leftMenuConfig';

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 76;

interface LeftMenuProps {
  items: LeftMenuItem[];
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function LeftMenu({ items }: LeftMenuProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <Box className={styles.root} style={{ width }}>
      <List className={styles.list}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const button = (
            <ListItemButton
              key={item.key}
              onClick={() => navigate(item.path)}
              className={cx(styles.item, collapsed && styles.itemCollapsed, isActive && styles.itemActive)}
            >
              <ListItemIcon className={cx(styles.icon, collapsed && styles.iconCollapsed, isActive && styles.iconActive)}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { className: cx(styles.label, isActive && styles.labelActive) } }}
                />
              )}
            </ListItemButton>
          );
          return collapsed ? <Tooltip key={item.key} title={item.label} placement="right">{button}</Tooltip> : button;
        })}
      </List>
      <IconButton className={styles.toggleButton} onClick={() => setCollapsed((prev) => !prev)}>
        {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
      </IconButton>
    </Box>
  );
}