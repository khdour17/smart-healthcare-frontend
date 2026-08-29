import type { Locator } from '@playwright/test';

export function isMarkedRequired(field: Locator): Promise<boolean> {
  return field.evaluate((input) => (input as HTMLInputElement).validity.valueMissing);
}
