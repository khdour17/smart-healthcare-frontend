const MENU_COLLAPSED_KEY = 'menuCollapsed';

export function getMenuCollapsed(): boolean {
  return localStorage.getItem(MENU_COLLAPSED_KEY) === 'true';
}

export function saveMenuCollapsed(collapsed: boolean): void {
  localStorage.setItem(MENU_COLLAPSED_KEY, String(collapsed));
}
