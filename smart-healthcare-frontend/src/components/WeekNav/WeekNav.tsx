import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Box,
  Button,
  IconButton,
  Typography,
} from '@mui/material';

import { weekRangeLabel } from '../../utils/weekDates';
import styles from './WeekNav.module.scss';

interface WeekNavProps {
  weekStart: Date;
  onChange: (weekStart: Date) => void;
  onToday: () => void;
}

export function WeekNav({ weekStart, onChange, onToday }: WeekNavProps) {
  function shift(weeks: number) {
    const moved = new Date(weekStart);
    moved.setDate(moved.getDate() + weeks * 7);
    onChange(moved);
  }

  return (
    <Box className={styles.nav}>
      <IconButton size="small" onClick={() => shift(-1)} aria-label="Previous week">
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <Typography variant="body2" className={styles.label}>{weekRangeLabel(weekStart)}</Typography>
      <IconButton size="small" onClick={() => shift(1)} aria-label="Next week">
        <ChevronRightIcon fontSize="small" />
      </IconButton>
      <Button size="small" onClick={onToday}>This week</Button>
    </Box>
  );
}
