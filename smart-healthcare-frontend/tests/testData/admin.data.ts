import { FIELD_LABELS } from '../config/messages';

function uniqueUsername(prefix: string): string {
  const unique = `${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000)}`;
  return `${prefix}_${unique}`;
}

export function newDoctor(overrides: Record<string, string> = {}): Record<string, string> {
  const username = uniqueUsername('doctor');

  return {
    [FIELD_LABELS.USERNAME]: username,
    [FIELD_LABELS.EMAIL]: `${username}@test.com`,
    [FIELD_LABELS.PASSWORD]: 'doctor123',
    [FIELD_LABELS.FULL_NAME]: 'Test Doctor',
    [FIELD_LABELS.SPECIALTY]: 'Cardiology',
    ...overrides,
  };
}

export function newPatient(overrides: Record<string, string> = {}): Record<string, string> {
  const username = uniqueUsername('patient');

  return {
    [FIELD_LABELS.USERNAME]: username,
    [FIELD_LABELS.EMAIL]: `${username}@test.com`,
    [FIELD_LABELS.PASSWORD]: 'patient123',
    [FIELD_LABELS.FULL_NAME]: 'Test Patient',
    [FIELD_LABELS.DATE_OF_BIRTH]: '1990-05-15',
    [FIELD_LABELS.PHONE]: '0790000000',
    [FIELD_LABELS.ADDRESS]: 'Amman',
    ...overrides,
  };
}

export function newAdmin(overrides: Record<string, string> = {}): Record<string, string> {
  const username = uniqueUsername('admin');

  return {
    [FIELD_LABELS.USERNAME]: username,
    [FIELD_LABELS.EMAIL]: `${username}@test.com`,
    [FIELD_LABELS.PASSWORD]: 'admin123',
    [FIELD_LABELS.FULL_NAME]: 'Test Admin',
    [FIELD_LABELS.DEPARTMENT]: 'IT',
    ...overrides,
  };
}
