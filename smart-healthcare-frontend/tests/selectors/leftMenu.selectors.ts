import { MUI } from './common.selectors';

export const LEFT_MENU = {
  ROOT: MUI.LIST,
  ITEM: MUI.LIST_ITEM_BUTTON,
};

export function menuItemByLabel(label: string): string {
  return `${LEFT_MENU.ITEM}:has(:text-is("${label}"))`;
}
