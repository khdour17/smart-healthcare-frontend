import { FIELD_LABELS } from '../config/messages';

const DAYS_IN_WEEK = 7;
const MONDAY = 1;
const SUNDAY = 0;

function futureDate(weekday: number, weeksAhead: number): string {
  const date = new Date();
  const daysToWeekday = (weekday - date.getDay() + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  date.setDate(date.getDate() + daysToWeekday + weeksAhead * DAYS_IN_WEEK);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export const BOOKING_DATES = {
  FULL_CYCLE: futureDate(MONDAY, 4),
  KEPT: futureDate(MONDAY, 5),
  DETAILS: futureDate(MONDAY, 6),
  TAKEN_SLOT: futureDate(MONDAY, 7),
  JOURNEY: futureDate(MONDAY, 8),
  DAY_OFF: futureDate(SUNDAY, 4),
};

export const DAY_OFF_NAME = 'SUNDAY';

export const BOOKING_REASON = 'Feeling tired';

const SLOT_SEPARATOR = ' – ';

export function slotStart(slot: string): string {
  return slot.split(SLOT_SEPARATOR)[0];
}

export const PROFILE = {
  [FIELD_LABELS.PHONE]: '0791234567',
  [FIELD_LABELS.ADDRESS]: 'Amman, Jordan',
};

export const CHANGED_PROFILE = {
  [FIELD_LABELS.PHONE]: '0799999999',
  [FIELD_LABELS.ADDRESS]: 'Irbid, Jordan',
};
