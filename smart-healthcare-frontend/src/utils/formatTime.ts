/** Trims a backend LocalTime ("09:00:00") down to "09:00" for display. */
export function formatTime(time: string) {
  return time.slice(0, 5);
}
