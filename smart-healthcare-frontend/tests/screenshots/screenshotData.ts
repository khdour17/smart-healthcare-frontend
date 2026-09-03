import { FIELD_LABELS } from '../config/messages';
import {
  newDoctor,
  newPatient,
} from '../testData/admin.data';

const SATURDAY = 6;
const SUNDAY = 0;

export const VISITOR_NAME = 'Omar Haddad';

export const VISIT_REASONS = [
  'Chest pain for two days',
  'Follow up on the blood test',
  'Yearly check up',
];

export const VISIT_NOTES = 'Blood pressure normal, no further tests needed.';

export const RECORD_ENTRY = {
  TITLE: 'Cardiology follow up',
  DESCRIPTION: 'Blood pressure back to normal. Review again in six months.',
};

export function newVisitor(): Record<string, string> {
  return newPatient({
    [FIELD_LABELS.FULL_NAME]: VISITOR_NAME,
    [FIELD_LABELS.DATE_OF_BIRTH]: '1988-04-22',
    [FIELD_LABELS.PHONE]: '0791234567',
    [FIELD_LABELS.ADDRESS]: 'Amman, Jordan',
  });
}

export function sampleDoctor(): Record<string, string> {
  return newDoctor({
    [FIELD_LABELS.FULL_NAME]: 'Dr. Rania Odeh',
    [FIELD_LABELS.SPECIALTY]: 'Dermatology',
  });
}

export function nextWorkingDays(count: number): string[] {
  const days: string[] = [];
  const date = new Date();

  while (days.length < count) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() === SATURDAY || date.getDay() === SUNDAY) continue;

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    days.push(`${date.getFullYear()}-${month}-${day}`);
  }

  return days;
}
