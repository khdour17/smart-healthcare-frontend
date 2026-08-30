export const COMMON = {
  ALERT: '[role="alert"]',
  AVATAR_BUTTON: 'header button',
  LEFT_MENU_ITEM: '.MuiListItemButton-root',
  USER_MENU_ITEM: '[role="menuitem"]',
};

export function withExactText(selector: string, text: string): string {
  return `${selector}:text-is("${text}")`;
}

export function withExactChildText(selector: string, text: string): string {
  return `${selector}:has(:text-is("${text}"))`;
}
