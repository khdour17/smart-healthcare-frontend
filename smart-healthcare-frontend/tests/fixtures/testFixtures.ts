import { expect, test as base } from '@playwright/test';

import { CommonPage } from '../pages/CommonPage';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  commonPage: CommonPage;
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  commonPage: async ({ page }, use) => {
    await use(new CommonPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };
