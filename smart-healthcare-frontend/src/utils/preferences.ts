const MENU_COLLAPSED_KEY = 'menuCollapsed';
const PAGE_VIEW_PREFIX = 'pageView.';

export type PageView = 'calendar' | 'list';

export function getMenuCollapsed(): boolean {
  return localStorage.getItem(MENU_COLLAPSED_KEY) === 'true';
}

export function saveMenuCollapsed(collapsed: boolean): void {
  localStorage.setItem(MENU_COLLAPSED_KEY, String(collapsed));
}

export function getPageView(page: string): PageView {
  return localStorage.getItem(PAGE_VIEW_PREFIX + page) === 'list' ? 'list' : 'calendar';
}

export function savePageView(page: string, view: PageView): void {
  localStorage.setItem(PAGE_VIEW_PREFIX + page, view);
}
