import type { DoctorAvailabilityResponse } from '../../../../api/availability/AvailabilityAPI';
import type { BarChartPoint } from '../../../../components/BarChart/BarChart';
import type { DayOfWeek } from '../../../../types/common';

const WEEK: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

function hoursBetween(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const minutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  return Math.max(Math.round(minutes / 60), 0);
}

export function weeklyHours(availability: DoctorAvailabilityResponse[]): BarChartPoint[] {
  return WEEK.map((day) => {
    const forDay = availability.filter((entry) => entry.dayOfWeek === day);
    const value = forDay.reduce((sum, entry) => sum + hoursBetween(entry.startTime, entry.endTime), 0);

    return {
      label: day.slice(0, 3).charAt(0) + day.slice(1, 3).toLowerCase(),
      caption: `${day.charAt(0)}${day.slice(1).toLowerCase()} hours`,
      value,
    };
  });
}
