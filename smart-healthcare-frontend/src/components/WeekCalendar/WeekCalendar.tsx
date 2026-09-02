import type { CSSProperties } from 'react';

import {
  Box,
  Tooltip,
  Typography,
} from '@mui/material';

import { EmptyState } from '../EmptyState/EmptyState';
import styles from './WeekCalendar.module.scss';

type CalendarTone = 'primary' | 'success' | 'muted';

interface CalendarDay {
  key: string;
  label: string;
  subLabel?: string;
  highlighted?: boolean;
}

export interface CalendarItem {
  id: string;
  dayKey: string;
  startTime: string;
  endTime: string;
  title: string;
  subtitle?: string;
  tone: CalendarTone;
  onClick?: () => void;
}

interface WeekCalendarProps {
  days: CalendarDay[];
  items: CalendarItem[];
  emptyMessage?: string;
}

interface PlacedItem {
  item: CalendarItem;
  top: number;
  height: number;
  lane: number;
  lanes: number;
}

const DEFAULT_FIRST_HOUR = 8;
const DEFAULT_LAST_HOUR = 18;
const MINUTES_IN_HOUR = 60;
const MIN_SLOT_HEIGHT = 46;
const MIN_HOUR_HEIGHT = 56;
const MAX_HOUR_HEIGHT = 160;

const toneClass: Record<CalendarTone, string> = {
  primary: styles.tonePrimary,
  success: styles.toneSuccess,
  muted: styles.toneMuted,
};

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_IN_HOUR + minutes;
}

function hourHeight(items: CalendarItem[]): number {
  if (items.length === 0) return MIN_HOUR_HEIGHT;

  const shortest = Math.min(...items.map((item) => toMinutes(item.endTime) - toMinutes(item.startTime)));
  if (shortest <= 0) return MIN_HOUR_HEIGHT;

  const needed = (MINUTES_IN_HOUR / shortest) * MIN_SLOT_HEIGHT;
  return Math.min(Math.max(Math.round(needed), MIN_HOUR_HEIGHT), MAX_HOUR_HEIGHT);
}

function hourRange(items: CalendarItem[]): { firstHour: number; lastHour: number } {
  if (items.length === 0) return { firstHour: DEFAULT_FIRST_HOUR, lastHour: DEFAULT_LAST_HOUR };

  const starts = items.map((item) => Math.floor(toMinutes(item.startTime) / MINUTES_IN_HOUR));
  const ends = items.map((item) => Math.ceil(toMinutes(item.endTime) / MINUTES_IN_HOUR));

  return {
    firstHour: Math.max(Math.min(...starts) - 1, 0),
    lastHour: Math.min(Math.max(...ends) + 1, 24),
  };
}

function placeDay(dayItems: CalendarItem[], firstHour: number, lastHour: number): PlacedItem[] {
  const gridStart = firstHour * MINUTES_IN_HOUR;
  const gridLength = (lastHour - firstHour) * MINUTES_IN_HOUR;
  const sorted = [...dayItems].sort((first, second) => toMinutes(first.startTime) - toMinutes(second.startTime));

  const laneEnds: number[] = [];
  const placed = sorted.map((item) => {
    const start = toMinutes(item.startTime);
    const end = toMinutes(item.endTime);
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      laneEnds.push(end);
      lane = laneEnds.length - 1;
    } else {
      laneEnds[lane] = end;
    }

    return {
      item,
      top: ((start - gridStart) / gridLength) * 100,
      height: ((end - start) / gridLength) * 100,
      lane,
      lanes: 1,
    };
  });

  return placed.map((entry) => ({ ...entry, lanes: laneEnds.length }));
}

export function WeekCalendar({ days, items, emptyMessage = 'Nothing to show yet.' }: WeekCalendarProps) {
  const shownItems = items.filter((item) => days.some((day) => day.key === item.dayKey));
  const { firstHour, lastHour } = hourRange(items);
  const rowHeight = hourHeight(items);
  const hours = Array.from({ length: lastHour - firstHour }, (_, index) => firstHour + index);

  return (
    <Box className={styles.calendar} style={{ '--hour-height': `${rowHeight}px` } as CSSProperties}>
      <Box className={styles.axis}>
        <Box className={styles.axisHead} />
        {hours.map((hour) => (
          <Box key={hour} className={styles.axisHour}>
            <Typography variant="caption" className={styles.axisLabel}>
              {String(hour).padStart(2, '0')}:00
            </Typography>
          </Box>
        ))}
      </Box>

      <Box className={styles.days}>
        {days.map((day) => {
          const placed = placeDay(items.filter((item) => item.dayKey === day.key), firstHour, lastHour);

          return (
            <Box key={day.key} className={styles.day}>
              <Box className={`${styles.dayHead} ${day.highlighted ? styles.dayHeadToday : ''}`}>
                <Typography variant="body2" className={styles.dayLabel}>{day.label}</Typography>
                {day.subLabel && (
                  <Typography variant="caption" className={styles.daySubLabel}>{day.subLabel}</Typography>
                )}
              </Box>

              <Box className={styles.dayBody}>
                {hours.map((hour) => <Box key={hour} className={styles.hourCell} />)}

                {placed.map(({ item, top, height, lane, lanes }) => (
                  <Tooltip
                    key={item.id}
                    title={item.subtitle ? `${item.title} - ${item.subtitle}` : item.title}
                    placement="top"
                  >
                    <Box
                      className={`${styles.item} ${toneClass[item.tone]} ${item.onClick ? styles.clickable : ''}`}
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                        left: `${(lane / lanes) * 100}%`,
                        width: `${100 / lanes}%`,
                      }}
                      onClick={item.onClick}
                    >
                      <Typography variant="caption" className={styles.itemTitle}>{item.title}</Typography>
                      {item.subtitle && (
                        <Typography variant="caption" className={styles.itemSubtitle}>{item.subtitle}</Typography>
                      )}
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      {shownItems.length === 0 && (
        <Box className={styles.empty}><EmptyState message={emptyMessage} /></Box>
      )}
    </Box>
  );
}
