import { FIELD_LABELS } from '../config/messages';

export const FREE_DAYS = {
  ADD: 'Saturday',
  REPLACE: 'Sunday',
};

export const WORK_HOURS = {
  START: '09:00',
  END: '17:00',
  SLOT_MINUTES: '30',
};

export const REPLACED_WORK_HOURS = {
  START: '10:00',
  END: '15:00',
  SLOT_MINUTES: '60',
};

export const VISIT_NOTES = 'Patient seen, everything looks fine.';

export function uniqueTitle(prefix: string): string {
  const unique = `${Date.now().toString().slice(-7)}${Math.floor(Math.random() * 100)}`;
  return `${prefix} ${unique}`;
}

export function newPrescription(): Record<string, string> {
  return {
    [FIELD_LABELS.MEDICINES]: 'Paracetamol 500mg',
    [FIELD_LABELS.DIAGNOSIS]: 'Seasonal flu',
    [FIELD_LABELS.INSTRUCTIONS]: 'One tablet every eight hours for three days.',
  };
}

export function newRecordEntry(title: string): Record<string, string> {
  return {
    [FIELD_LABELS.TITLE]: title,
    [FIELD_LABELS.DESCRIPTION]: 'Written by the end to end test.',
  };
}
