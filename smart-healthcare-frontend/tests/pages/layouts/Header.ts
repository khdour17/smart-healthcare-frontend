import type { Locator, Page } from '@playwright/test';

import { greetingText, USER_MENU_ITEMS } from '../../config/messages';
import { HEADER } from '../../selectors/layouts/header.selectors';

export class Header {
  readonly page: Page;

  readonly root: Locator;
  readonly avatarButton: Locator;
  readonly logoutItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.root = page.locator(HEADER.ROOT);
    this.avatarButton = page.locator(HEADER.AVATAR_BUTTON);
    this.logoutItem = page.locator(HEADER.USER_MENU_ITEM).filter({ hasText: USER_MENU_ITEMS.LOGOUT });
  }

  greetingFor(username: string): Locator {
    return this.root.getByText(greetingText(username), { exact: true });
  }

  async openUserMenu(): Promise<void> {
    await this.avatarButton.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutItem.click();
  }
}
