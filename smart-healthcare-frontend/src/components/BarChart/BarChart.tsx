import {
  Box,
  Tooltip,
  Typography,
} from '@mui/material';

import styles from './BarChart.module.scss';

export interface BarChartPoint {
  label: string;
  value: number;
  caption?: string;
}

interface BarChartProps {
  points: BarChartPoint[];
  emptyMessage?: string;
}

const MIN_VISIBLE_HEIGHT = 2;

export function BarChart({ points, emptyMessage = 'Nothing to show yet.' }: BarChartProps) {
  const highest = Math.max(...points.map((point) => point.value), 0);

  if (points.length === 0 || highest === 0) {
    return <Typography variant="body2" color="textSecondary">{emptyMessage}</Typography>;
  }

  return (
    <Box className={styles.chart}>
      {points.map((point) => {
        const height = Math.max((point.value / highest) * 100, point.value > 0 ? MIN_VISIBLE_HEIGHT : 0);
        return (
          <Box key={point.label} className={styles.column}>
            <Typography variant="body2" className={styles.value}>{point.value > 0 ? point.value : ''}</Typography>
            <Box className={styles.track}>
              <Tooltip title={`${point.caption ?? point.label}: ${point.value}`} placement="top">
                <Box className={styles.fill} style={{ height: `${height}%` }} />
              </Tooltip>
            </Box>
            <Typography variant="caption" className={styles.label}>{point.label}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
