import {
  Box,
  Tooltip,
  Typography,
} from '@mui/material';

import styles from './ShareBar.module.scss';

export type ShareSlot = 'one' | 'two' | 'three';

export interface ShareBarSegment {
  label: string;
  value: number;
  slot: ShareSlot;
}

interface ShareBarProps {
  segments: ShareBarSegment[];
  emptyMessage?: string;
}

const slotClass: Record<ShareSlot, string> = {
  one: styles.slotOne,
  two: styles.slotTwo,
  three: styles.slotThree,
};

export function ShareBar({ segments, emptyMessage = 'Nothing to show yet.' }: ShareBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  if (total === 0) {
    return <Typography variant="body2" color="textSecondary">{emptyMessage}</Typography>;
  }

  const shown = segments.filter((segment) => segment.value > 0);

  return (
    <Box className={styles.root}>
      <Box className={styles.bar}>
        {shown.map((segment) => (
          <Tooltip
            key={segment.label}
            title={`${segment.label}: ${segment.value} of ${total}`}
            placement="top"
          >
            <Box
              className={`${styles.segment} ${slotClass[segment.slot]}`}
              style={{ flexGrow: segment.value }}
            />
          </Tooltip>
        ))}
      </Box>

      <Box className={styles.legend}>
        {segments.map((segment) => (
          <Box key={segment.label} className={styles.legendItem}>
            <Box className={`${styles.swatch} ${slotClass[segment.slot]}`} />
            <Typography variant="body2" color="textSecondary">{segment.label}</Typography>
            <Typography variant="body2" className={styles.legendValue}>{segment.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
