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
      slotProps={{ backdrop: { className: styles.backdrop }, paper: { className: styles.paper } }}
    >
      <Box className={styles.header}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close"><CloseIcon fontSize="small" /></IconButton>
      </Box>
      <Divider />
      <Box className={styles.body}>{children}</Box>
      {footer && (
        <>
          <Divider />
          <Box className={styles.footer}>{footer}</Box>
        </>
      )}
    </MuiDrawer>
  );
}
