import { ROUTES } from '../config/app.config';
import { BUTTONS } from '../config/messages';
import {
  EXPECTED_MENU_BY_ROLE,
  UNKNOWN_USER,
  WRONG_PASSWORD,
} from '../config/testData';
import { expect, test } from '../fixtures/testFixtures';
import { isMarkedRequired } from '../helpers/formHelper';
import { urlContaining, urlEndingWith } from '../helpers/urlHelper';
import {
  createAdmin,
  createDoctor,
  createPatient,
  deleteCreatedUsers,
} from '../helpers/userHelper';
import type { Credentials, UserRole } from '../types';

let usersByRole: Record<UserRole, Credentials>;

test.beforeAll(async () => {
  usersByRole = {
    ADMIN: await createAdmin(),
    DOCTOR: await createDoctor(),
    PATIENT: await createPatient(),
  };
});

test.afterAll(async () => {
  await deleteCreatedUsers();
});

test.describe('Verify Login', () => {
  test('TC-001 Verify that the admin can log in with the right username and password', async ({ loginPage, dashboardPage, header }) => {
    await loginPage.login(usersByRole.ADMIN);

    await expect(dashboardPage.welcomeFor(usersByRole.ADMIN.username)).toBeVisible();
    await expect(header.greetingFor(usersByRole.ADMIN.username)).toBeVisible();
  });

  test('TC-002 Verify that the doctor can log in with the right username and password', async ({ loginPage, dashboardPage, header }) => {
    await loginPage.login(usersByRole.DOCTOR);

    await expect(dashboardPage.welcomeFor(usersByRole.DOCTOR.username)).toBeVisible();
    await expect(header.greetingFor(usersByRole.DOCTOR.username)).toBeVisible();
  });

  test('TC-003 Verify that the patient can log in with the right username and password', async ({ loginPage, dashboardPage, header }) => {
    await loginPage.login(usersByRole.PATIENT);

    await expect(dashboardPage.welcomeFor(usersByRole.PATIENT.username)).toBeVisible();
    await expect(header.greetingFor(usersByRole.PATIENT.username)).toBeVisible();
  });

  test('TC-004 Verify that login fails when the password is wrong', async ({ page, loginPage }) => {
    await loginPage.login({ username: usersByRole.PATIENT.username, password: WRONG_PASSWORD });

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(page).toHaveURL(urlEndingWith(ROUTES.LOGIN));
  });

  test('TC-005 Verify that login fails when the user does not exist', async ({ page, loginPage }) => {
    await loginPage.login(UNKNOWN_USER);

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(page).toHaveURL(urlEndingWith(ROUTES.LOGIN));
  });

  test('TC-006 Verify that the form does not submit when the fields are empty', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.submit();

    expect(await isMarkedRequired(loginPage.usernameInput)).toBe(true);
    await expect(page).toHaveURL(urlEndingWith(ROUTES.LOGIN));
  });
});

test.describe('Verify Logout And Session', () => {
  test('TC-007 Verify that the user can log out', async ({ page, loginPage, dashboardPage, header }) => {
    await loginPage.login(usersByRole.PATIENT);
    await expect(dashboardPage.welcomeFor(usersByRole.PATIENT.username)).toBeVisible();

    await header.logout();

    await expect(page).toHaveURL(urlEndingWith(ROUTES.LOGIN));
    await expect(loginPage.signInButton).toBeVisible();

    await page.goBack();

    await expect(page).not.toHaveURL(urlContaining(ROUTES.DASHBOARD));
  });

  test('TC-008 Verify that a logged in user can not open the login page again', async ({ page, loginPage, dashboardPage }) => {
    await loginPage.login(usersByRole.PATIENT);
    await expect(dashboardPage.welcomeFor(usersByRole.PATIENT.username)).toBeVisible();

    await loginPage.open();

    await expect(page).toHaveURL(urlEndingWith(ROUTES.DASHBOARD));
    await expect(loginPage.signInButton).toBeHidden();
  });

  test('TC-009 Verify that a user who is not logged in can not open the dashboard', async ({ page, loginPage }) => {
    await page.goto(ROUTES.PATIENT_APPOINTMENTS);

    await expect(page).toHaveURL(urlEndingWith(ROUTES.LOGIN));
    await expect(loginPage.signInButton).toBeVisible();
  });
});

test.describe('Verify Left Menu Per Role', () => {
  test('TC-010a Verify that the left menu shows the right items for the admin', async ({ loginPage, dashboardPage, leftMenu }) => {
    await loginPage.login(usersByRole.ADMIN);
    await expect(dashboardPage.welcomeFor(usersByRole.ADMIN.username)).toBeVisible();

    for (const label of EXPECTED_MENU_BY_ROLE.ADMIN.shown) {
      await expect(leftMenu.itemByLabel(label)).toBeVisible();
    }

    for (const label of EXPECTED_MENU_BY_ROLE.ADMIN.hidden) {
      await expect(leftMenu.itemByLabel(label)).toHaveCount(0);
    }
  });

  test('TC-010b Verify that the left menu shows the right items for the doctor', async ({ loginPage, dashboardPage, leftMenu }) => {
    await loginPage.login(usersByRole.DOCTOR);
    await expect(dashboardPage.welcomeFor(usersByRole.DOCTOR.username)).toBeVisible();

    for (const label of EXPECTED_MENU_BY_ROLE.DOCTOR.shown) {
      await expect(leftMenu.itemByLabel(label)).toBeVisible();
    }

    for (const label of EXPECTED_MENU_BY_ROLE.DOCTOR.hidden) {
      await expect(leftMenu.itemByLabel(label)).toHaveCount(0);
    }
  });

  test('TC-010c Verify that the left menu shows the right items for the patient', async ({ loginPage, dashboardPage, leftMenu }) => {
    await loginPage.login(usersByRole.PATIENT);
    await expect(dashboardPage.welcomeFor(usersByRole.PATIENT.username)).toBeVisible();

    for (const label of EXPECTED_MENU_BY_ROLE.PATIENT.shown) {
      await expect(leftMenu.itemByLabel(label)).toBeVisible();
    }

    for (const label of EXPECTED_MENU_BY_ROLE.PATIENT.hidden) {
      await expect(leftMenu.itemByLabel(label)).toHaveCount(0);
    }
  });

  test('TC-011 Verify that a wrong adress shows the NotFoundPage', async ({ page, loginPage, dashboardPage, notFoundPage }) => {
    await loginPage.login(usersByRole.PATIENT);
    await expect(dashboardPage.welcomeFor(usersByRole.PATIENT.username)).toBeVisible();

    await page.goto(ROUTES.UNKNOWN);

    await expect(notFoundPage.title).toBeVisible();
    await expect(notFoundPage.message).toBeVisible();
    await expect(notFoundPage.backButton).toHaveText(BUTTONS.BACK_TO_DASHBOARD);
  });
});
