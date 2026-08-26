import type { Locator, Page } from '@playwright/test';

import { TEXTS } from '../config/messages';
import { NOT_FOUND_PAGE } from '../selectors/notFoundPage.selectors';

export class NotFoundPage {
  readonly page: Page;

  readonly title: Locator;
  readonly message: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.locator(NOT_FOUND_PAGE.TITLE).filter({ hasText: TEXTS.NOT_FOUND_TITLE });
    this.message = page.getByText(TEXTS.NOT_FOUND_MESSAGE);
    this.backButton = page.locator(NOT_FOUND_PAGE.BACK_BUTTON);
  }
}
