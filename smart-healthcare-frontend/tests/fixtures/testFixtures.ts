import { expect, test as base } from '@playwright/test';

import { AdminPage } from '../pages/AdminPage';
import { CommonPage } from '../pages/CommonPage';
import { DoctorPage } from '../pages/DoctorPage';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  adminPage: AdminPage;
  commonPage: CommonPage;
  doctorPage: DoctorPage;
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },

  commonPage: async ({ page }, use) => {
    await use(new CommonPage(page));
  },

  doctorPage: async ({ page }, use) => {
    await use(new DoctorPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };
