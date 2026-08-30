export const COMMON = {
  ALERT: '[role="alert"]',
  AVATAR_BUTTON: 'header button',
};

export function leftMenuItem(label: string): string {
  return `.MuiListItemButton-root:has(:text-is("${label}"))`;
}

export function userMenuItem(label: string): string {
  return `[role="menuitem"]:text-is("${label}")`;
}
