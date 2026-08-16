interface DatedSlot {
  appointmentDate: string;
  startTime: string;
}

export function bySoonestFirst(a: DatedSlot, b: DatedSlot) {
  return `${a.appointmentDate}${a.startTime}`.localeCompare(`${b.appointmentDate}${b.startTime}`);
}
