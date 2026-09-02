import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined';
import ListIcon from '@mui/icons-material/ViewListOutlined';
import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';

import type { PageView } from '../../utils/preferences';
import styles from './ViewToggle.module.scss';

interface ViewToggleProps {
  view: PageView;
  onChange: (view: PageView) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={view}
      onChange={(_, next) => next && onChange(next as PageView)}
      className={styles.group}
    >
      <Tooltip title="Calendar view">
        <ToggleButton value="calendar" aria-label="Calendar view"><CalendarIcon fontSize="small" /></ToggleButton>
      </Tooltip>
      <Tooltip title="List view">
        <ToggleButton value="list" aria-label="List view"><ListIcon fontSize="small" /></ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}
