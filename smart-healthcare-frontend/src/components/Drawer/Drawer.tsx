import type { ReactNode } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  Typography,
} from '@mui/material';

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
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' } } }}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2, // sits above the fixed Header
        '& .MuiDrawer-paper': { width: { xs: '100%', sm: '65%', md: '38%' }, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2.5 }}>{children}</Box>
      {footer && (<><Divider /><Box sx={{ p: 2.5 }}>{footer}</Box></>)}
    </MuiDrawer>
  );
}