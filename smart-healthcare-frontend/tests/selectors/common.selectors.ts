export const COMMON = {
  ALERT: '[role="alert"]',
  AVATAR_BUTTON: 'button[aria-label="Open the user menu"]',
  PAGE_HEADING: '.MuiTypography-h5',
  ADD_BUTTON: 'main .MuiButton-contained',
  TABLE_ROW: '.MuiTableBody-root .MuiTableRow-root',
  DRAWER: '.MuiDrawer-paper',
  DRAWER_ALERT: '.MuiDrawer-paper [role="alert"]',
  DIALOG: '[role="dialog"]',
  DIALOG_ALERT: '[role="dialog"] [role="alert"]',
  DIALOG_MESSAGE: '.MuiDialogContentText-root',
  TOAST: '.MuiSnackbar-root',
  FIRST_LIST_OPTION: '[role="listbox"] [role="option"]:first-child',
  CALENDAR_ITEM: 'main [class*="item_"]',
  CALENDAR_DAY: 'main [class*="dayLabel"]',
  WEEK_LABEL: 'main [class*="weekLabel"]',
  PATIENT_PICKER: 'main .MuiFormControl-root:has(.MuiFormLabel-root:text-is("Patient")) input',
  TIMELINE_ENTRY: 'main [class*="stream"] [class*="item_"]',
  FIRST_TIMELINE_ENTRY: 'main [class*="stream"] [class*="item_"]:first-child',
  MENU_SWITCH: 'main .MuiSwitch-root input',
};

export function leftMenuItem(label: string): string {
  return `.MuiListItemButton-root:has(:text-is("${label}"))`;
}

export function userMenuItem(label: string): string {
  return `[role="menuitem"]:text-is("${label}")`;
}

export function tableRow(cellText: string): string {
  return `${COMMON.TABLE_ROW}:has(.MuiTableCell-root:text-is("${cellText}"))`;
}

export function tableRowCheckbox(cellText: string): string {
  return `${tableRow(cellText)} input[type="checkbox"]`;
}

export function formField(label: string): string {
  return `${COMMON.DRAWER} .MuiFormControl-root:has(.MuiFormLabel-root:text-is("${label}")) .MuiInputBase-input:not([aria-hidden="true"])`;
}

export function selectField(label: string): string {
  return `${COMMON.DRAWER} .MuiFormControl-root:has(.MuiFormLabel-root:text-is("${label}")) [role="combobox"]`;
}

export function fieldHelperText(label: string): string {
  return `${COMMON.DRAWER} .MuiFormControl-root:has(.MuiFormLabel-root:text-is("${label}")) .MuiFormHelperText-root`;
}

export function listOption(label: string): string {
  return `[role="option"]:text-is("${label}")`;
}

export function listOptionContaining(label: string): string {
  return `[role="option"]:has-text("${label}")`;
}

export function drawerButton(label: string): string {
  return `${COMMON.DRAWER} button:text-is("${label}")`;
}

export function dialogButton(label: string): string {
  return `${COMMON.DIALOG} button:text-is("${label}")`;
}

export function iconButton(label: string): string {
  return `button[aria-label="${label}"]`;
}

export function rowAction(cellText: string, actionLabel: string): string {
  return `${tableRow(cellText)} button[aria-label="${actionLabel}"]`;
}

export function firstRowAction(actionLabel: string): string {
  return `${COMMON.TABLE_ROW}:first-child button[aria-label="${actionLabel}"]`;
}

export function timelineEntry(text: string): string {
  return `${COMMON.TIMELINE_ENTRY}:has-text("${text}")`;
}

export function recordFilter(label: string): string {
  return `main .MuiToggleButton-root:text-is("${label}")`;
}
