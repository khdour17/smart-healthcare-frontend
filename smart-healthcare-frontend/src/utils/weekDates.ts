const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_IN_WEEK = 7;

export interface WeekDay {
  key: string;
  label: string;
  subLabel: string;
  highlighted: boolean;
}

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${String(date.getDate()).padStart(2, '0')}`;
}

export function startOfWeek(date: Date): Date {
  const start = new Date(date);
  const weekday = start.getDay();
  start.setDate(start.getDate() - (weekday === 0 ? 6 : weekday - 1));
  start.setHours(0, 0, 0, 0);
  return start;
}

export function addWeeks(date: Date, weeks: number): Date {
  const moved = new Date(date);
  moved.setDate(moved.getDate() + weeks * DAYS_IN_WEEK);
  return moved;
}

export function weekDays(weekStart: Date): WeekDay[] {
  const today = toIsoDate(new Date());

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + index);
    const key = toIsoDate(day);

    return {
      key,
      label: DAY_LABELS[day.getDay()],
      subLabel: `${day.getDate()} ${MONTH_LABELS[day.getMonth()]}`,
      highlighted: key === today,
    };
  });
}

export function weekRangeLabel(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + DAYS_IN_WEEK - 1);

  const startPart = `${weekStart.getDate()} ${MONTH_LABELS[weekStart.getMonth()]}`;
  const endPart = `${end.getDate()} ${MONTH_LABELS[end.getMonth()]} ${end.getFullYear()}`;
  return `${startPart} - ${endPart}`;
}
