import type { AppointmentResponse } from '../api/appointments/AppointmentsAPI';
import type { BarChartPoint } from '../components/BarChart/BarChart';
import type { ShareBarSegment } from '../components/ShareBar/ShareBar';
import type { AppointmentStatus } from '../types/common';
import { todayIso } from '../utils/todayIso';

const DAYS_SHOWN = 7;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function countByStatus(appointments: AppointmentResponse[], status: AppointmentStatus): number {
  return appointments.filter((appointment) => appointment.status === status).length;
}

export function upcomingAppointments(appointments: AppointmentResponse[]): AppointmentResponse[] {
  const today = todayIso();
  return appointments
    .filter((appointment) => appointment.status === 'SCHEDULED' && appointment.appointmentDate >= today)
    .sort((first, second) => (
      `${first.appointmentDate}${first.startTime}`.localeCompare(`${second.appointmentDate}${second.startTime}`)
    ));
}

export function appointmentShare(appointments: AppointmentResponse[]): ShareBarSegment[] {
  return [
    { label: 'Scheduled', value: countByStatus(appointments, 'SCHEDULED'), slot: 'one' },
    { label: 'Completed', value: countByStatus(appointments, 'COMPLETED'), slot: 'three' },
    { label: 'Cancelled', value: countByStatus(appointments, 'CANCELLED'), slot: 'two' },
  ];
}

export function lastSevenDays(appointments: AppointmentResponse[]): BarChartPoint[] {
  const points: BarChartPoint[] = [];

  for (let back = DAYS_SHOWN - 1; back >= 0; back -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - back);
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const date = `${day.getFullYear()}-${month}-${String(day.getDate()).padStart(2, '0')}`;

    points.push({
      label: WEEKDAYS[day.getDay()],
      caption: date,
      value: appointments.filter((appointment) => appointment.appointmentDate === date).length,
    });
  }

  return points;
}
