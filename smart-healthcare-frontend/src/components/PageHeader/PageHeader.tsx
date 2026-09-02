import type { ReactNode } from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box className={styles.header}>
      <Box className={styles.titleBlock}>
        <Typography variant="h5">{title}</Typography>
        {subtitle && <Typography variant="body2" color="textSecondary">{subtitle}</Typography>}
      </Box>
      {actions && <Box className={styles.actions}>{actions}</Box>}
    </Box>
  );
}
