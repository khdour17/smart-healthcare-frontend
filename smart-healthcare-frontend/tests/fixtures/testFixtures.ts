import { expect, test as base } from '@playwright/test';

import { DashboardPage } from '../pages/DashboardPage';
import { Header } from '../pages/layouts/Header';
import { LeftMenu } from '../pages/layouts/LeftMenu';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  notFoundPage: NotFoundPage;
  header: Header;
  leftMenu: LeftMenu;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  notFoundPage: async ({ page }, use) => {
    await use(new NotFoundPage(page));
  },

  header: async ({ page }, use) => {
    await use(new Header(page));
  },

  leftMenu: async ({ page }, use) => {
    await use(new LeftMenu(page));
  },
});

export { expect };
