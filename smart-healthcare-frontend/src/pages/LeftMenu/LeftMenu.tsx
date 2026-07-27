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

import type { LeftMenuItem } from './leftMenuConfig';

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 76;

interface LeftMenuProps  {
  items: LeftMenuItem [];
}

export function LeftMenu({ items }: LeftMenuProps ) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <Box sx={{ width, flexShrink: 0, height: '100%', bgcolor: 'sidebar.background', borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'width 0.2s ease' }}>
      <List sx={{ flexGrow: 1, py: 2 }}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const button = (
            <ListItemButton
              key={item.key}
              selected={isActive}
              onClick={() => navigate(item.path)}
              sx={{ mx: 1, mb: 0.5, borderRadius: 2, justifyContent: collapsed ? 'center' : 'flex-start', '&.Mui-selected': { bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.main' } } }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, color: isActive ? 'common.white' : 'text.secondary', justifyContent: 'center' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText primary={item.label} slotProps={{ primary: { sx: { color: isActive ? 'common.white' : 'text.primary', fontSize: '0.875rem' } } }} />
              )}
            </ListItemButton>
          );
          return collapsed ? <Tooltip key={item.key} title={item.label} placement="right">{button}</Tooltip> : button;
        })}
      </List>
      <IconButton
        onClick={() => setCollapsed((prev) => !prev)}
        sx={{ position: 'absolute', top: '50%', right: -14, transform: 'translateY(-50%)', width: 28, height: 28, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'background.paper' } }}
      >
        {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
      </IconButton>
    </Box>
  );
}