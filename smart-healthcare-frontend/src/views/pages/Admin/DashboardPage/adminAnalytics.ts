import type { AppointmentResponse } from '../../../../api/appointments/AppointmentsAPI';
import type { DoctorResponse } from '../../../../api/doctors/DoctorsAPI';
import type { BarChartPoint } from '../../../../components/BarChart/BarChart';

const DOCTORS_SHOWN = 6;

export function countBySpecialty(doctors: DoctorResponse[]): BarChartPoint[] {
  const counts = new Map<string, number>();

  for (const doctor of doctors) {
    counts.set(doctor.specialty, (counts.get(doctor.specialty) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([specialty, value]) => ({ label: specialty, value }))
    .sort((first, second) => second.value - first.value);
}

export function busiestDoctors(
  doctors: DoctorResponse[],
  appointments: AppointmentResponse[],
): BarChartPoint[] {
  return doctors
    .map((doctor) => ({
      label: doctor.name,
      caption: `${doctor.name} (${doctor.specialty})`,
      value: appointments.filter((appointment) => appointment.doctorId === doctor.id).length,
    }))
    .sort((first, second) => second.value - first.value)
    .slice(0, DOCTORS_SHOWN);
}
