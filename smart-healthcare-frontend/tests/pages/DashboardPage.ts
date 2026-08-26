import type { Locator, Page } from '@playwright/test';

import { ROUTES } from '../config/app.config';
import { welcomeText } from '../config/messages';
import { DASHBOARD_PAGE } from '../selectors/dashboardPage.selectors';

export class DashboardPage {
  readonly page: Page;

  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.welcomeHeading = page.locator(DASHBOARD_PAGE.WELCOME_HEADING);
  }

  async open(): Promise<void> {
    await this.page.goto(ROUTES.DASHBOARD);
  }

  welcomeFor(username: string): Locator {
    return this.welcomeHeading.filter({ hasText: welcomeText(username) });
  }
}
