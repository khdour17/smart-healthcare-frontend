export const COMMON = {
  ALERT: '[role="alert"]',
  AVATAR_BUTTON: 'header button',
  PAGE_HEADING: '.MuiTypography-h5',
  ADD_BUTTON: '.MuiButton-contained',
  TABLE_ROW: '.MuiTableBody-root .MuiTableRow-root',
  DELETE_SELECTED_BUTTON: '[data-testid="DeleteOutlinedIcon"]',
  DRAWER: '.MuiDrawer-paper',
  DRAWER_ALERT: '.MuiDrawer-paper [role="alert"]',
  DIALOG: '[role="dialog"]',
  DIALOG_ALERT: '[role="dialog"] [role="alert"]',
  DIALOG_MESSAGE: '.MuiDialogContentText-root',
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
  return `${COMMON.DRAWER} .MuiFormControl-root:has(label:text-is("${label}")) input`;
}

export function drawerButton(label: string): string {
  return `${COMMON.DRAWER} button:text-is("${label}")`;
}

export function dialogButton(label: string): string {
  return `${COMMON.DIALOG} button:text-is("${label}")`;
}
