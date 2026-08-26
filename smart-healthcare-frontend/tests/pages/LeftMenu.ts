import type { Locator, Page } from '@playwright/test';

import { LEFT_MENU, menuItemByLabel } from '../selectors/leftMenu.selectors';

export class LeftMenu {
  readonly page: Page;

  readonly root: Locator;

  constructor(page: Page) {
    this.page = page;

    this.root = page.locator(LEFT_MENU.ROOT).first();
  }

  itemByLabel(label: string): Locator {
    return this.root.locator(menuItemByLabel(label));
  }

  async openItem(label: string): Promise<void> {
    await this.itemByLabel(label).click();
  }
}
