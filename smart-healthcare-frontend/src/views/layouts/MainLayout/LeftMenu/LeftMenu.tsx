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

import { classNames } from '../../../../utils/classNames';
import styles from './LeftMenu.module.scss';
import type { LeftMenuItem } from './leftMenuConfig';

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 76;

interface LeftMenuProps {
  items: LeftMenuItem[];
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}

export function LeftMenu({ items, collapsed, onToggle, onNavigate }: LeftMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  function goTo(path: string) {
    navigate(path);
    onNavigate?.();
  }

  return (
    <Box className={styles.root} style={{ width }}>
      <List className={styles.list}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const button = (
            <ListItemButton
              key={item.key}
              selected={isActive}
              onClick={() => goTo(item.path)}
              className={classNames(styles.item, collapsed && styles.itemCollapsed, isActive && styles.itemActive)}
            >
              <ListItemIcon className={classNames(styles.icon, collapsed && styles.iconCollapsed, isActive && styles.iconActive)}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { className: classNames(styles.label, isActive && styles.labelActive) } }}
                />
              )}
            </ListItemButton>
          );
          return collapsed ? <Tooltip key={item.key} title={item.label} placement="right">{button}</Tooltip> : button;
        })}
      </List>
      {onToggle && (
        <IconButton
          className={styles.toggleButton}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand the menu' : 'Collapse the menu'}
        >
          {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      )}
    </Box>
  );
}
