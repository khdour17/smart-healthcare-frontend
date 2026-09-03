import type { CalendarItem } from '../components/WeekCalendar/WeekCalendar';
import type { AppointmentStatus } from '../types/common';

export function appointmentTone(status: AppointmentStatus): CalendarItem['tone'] {
  if (status === 'COMPLETED') return 'success';
  if (status === 'CANCELLED') return 'muted';
  return 'primary';
}
