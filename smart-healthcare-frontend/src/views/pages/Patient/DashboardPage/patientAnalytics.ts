import type { AppointmentResponse } from '../../../../api/appointments/AppointmentsAPI';
import type { BarChartPoint } from '../../../../components/BarChart/BarChart';

const DOCTORS_SHOWN = 6;

export function visitsPerDoctor(appointments: AppointmentResponse[]): BarChartPoint[] {
  const counts = new Map<string, number>();

  for (const appointment of appointments) {
    if (appointment.status === 'CANCELLED') continue;
    counts.set(appointment.doctorName, (counts.get(appointment.doctorName) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([doctorName, value]) => ({ label: doctorName, value }))
    .sort((first, second) => second.value - first.value)
    .slice(0, DOCTORS_SHOWN);
}
