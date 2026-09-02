import InboxIcon from '@mui/icons-material/InboxOutlined';
import {
  Box,
  Typography,
} from '@mui/material';

import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  message: string;
  hint?: string;
}

export function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <Box className={styles.empty}>
      <Box className={styles.iconRing}>
        <InboxIcon fontSize="small" />
      </Box>
      <Typography variant="body2" className={styles.message}>{message}</Typography>
      {hint && <Typography variant="caption" color="textSecondary">{hint}</Typography>}
    </Box>
  );
}
