import type { MouseEvent } from 'react';

export function openNativePicker(e: MouseEvent<HTMLInputElement>) {
  const input = e.currentTarget;
  if (typeof input.showPicker === 'function') {
    input.showPicker();
  }
}