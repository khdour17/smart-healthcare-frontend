export const MUI = {
  ALERT: '[role="alert"]',
  LIST: '.MuiList-root',
  LIST_ITEM_BUTTON: '.MuiListItemButton-root',
  MENU_ITEM: '[role="menuitem"]',
};

export function fieldLabel(label: string): RegExp {
  return new RegExp(`^${label}`);
}
