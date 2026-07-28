import type { ReactNode } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  Typography,
} from '@mui/material';

import styles from './Drawer.module.scss';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  return (
    <MuiDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1301 }}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' } },
        paper: { className: styles.paper, sx: { bgcolor: 'background.paper' } },
      }}
    >
      <Box className={styles.header}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Box>
      <Divider />
      <Box className={styles.body}>{children}</Box>
      {footer && (<><Divider /><Box className={styles.footer}>{footer}</Box></>)}
    </MuiDrawer>
  );
}