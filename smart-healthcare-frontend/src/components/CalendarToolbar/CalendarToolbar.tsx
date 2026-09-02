import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListIcon from '@mui/icons-material/ViewListOutlined';
import {
  Box,
  Button,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';

import type { PageView } from '../../utils/preferences';
import {
  startOfWeek,
  weekRangeLabel,
} from '../../utils/weekDates';
import styles from './CalendarToolbar.module.scss';

interface CalendarToolbarProps {
  view: PageView;
  onViewChange: (view: PageView) => void;
  weekStart?: Date;
  onWeekChange?: (weekStart: Date) => void;
}

export function CalendarToolbar({ view, onViewChange, weekStart, onWeekChange }: CalendarToolbarProps) {
  const showWeek = view === 'calendar' && weekStart !== undefined && onWeekChange !== undefined;

  function shift(weeks: number) {
    if (weekStart === undefined || onWeekChange === undefined) return;
    const moved = new Date(weekStart);
    moved.setDate(moved.getDate() + weeks * 7);
    onWeekChange(moved);
  }

  return (
    <Box className={styles.toolbar}>
      {showWeek ? (
        <Paper variant="outlined" className={styles.weekNav}>
          <IconButton size="small" onClick={() => shift(-1)} aria-label="Previous week">
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" className={styles.weekLabel}>{weekRangeLabel(weekStart)}</Typography>
          <IconButton size="small" onClick={() => shift(1)} aria-label="Next week">
            <ChevronRightIcon fontSize="small" />
          </IconButton>
          <Button size="small" onClick={() => onWeekChange(startOfWeek(new Date()))}>This week</Button>
        </Paper>
      ) : <span />}

      <ToggleButtonGroup
        exclusive
        size="small"
        value={view}
        onChange={(_, next) => next && onViewChange(next as PageView)}
      >
        <Tooltip title="Calendar view">
          <ToggleButton value="calendar" aria-label="Calendar view"><CalendarIcon fontSize="small" /></ToggleButton>
        </Tooltip>
        <Tooltip title="List view">
          <ToggleButton value="list" aria-label="List view"><ListIcon fontSize="small" /></ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
}
