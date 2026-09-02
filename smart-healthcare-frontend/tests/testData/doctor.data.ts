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

export const SPECIALTY = 'Cardiology';

export const VISIT_NOTES = 'Patient seen, everything looks fine.';

export const PRESCRIPTION = {
  MEDICINE: 'Paracetamol 500mg',
  DIAGNOSIS: 'Chest infection',
  INSTRUCTIONS: 'One tablet every eight hours for three days.',
};

export function newRecordEntry(title: string): Record<string, string> {
  return {
    [FIELD_LABELS.TITLE]: title,
    [FIELD_LABELS.DESCRIPTION]: 'Written by the end to end test.',
  };
}
