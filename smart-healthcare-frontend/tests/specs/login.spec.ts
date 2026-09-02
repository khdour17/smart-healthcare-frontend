import { ROUTES } from '../config/app.config';
import {
  BUTTONS,
  greetingText,
  MENU_ITEMS,
  PAGE_TITLES,
  TEXTS,
} from '../config/messages';
import {
  EXPECTED_MENU_BY_ROLE,
  UNKNOWN_USER,
  USERS,
  WRONG_PASSWORD,
} from '../testData/common.data';
import { test } from '../fixtures/testFixtures';
import {
  COMMON,
  userMenuItem,
} from '../selectors/common.selectors';
import { LOGIN_PAGE } from '../selectors/loginPage.selectors';

test.describe('Verify Login', () => {
  test('TC-001 Verify that the admin can log in with the right username and password', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.ADMIN);

    await commonPage.verifyTextExists(greetingText(USERS.ADMIN.username));
  });

  test('TC-002 Verify that the doctor can log in with the right username and password', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.DOCTOR);

    await commonPage.verifyTextExists(greetingText(USERS.DOCTOR.username));
  });

  test('TC-003 Verify that the patient can log in with the right username and password', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.PATIENT);

    await commonPage.verifyTextExists(greetingText(USERS.PATIENT.username));
  });

  test('TC-004 Verify that login fails when the password is wrong', async ({ loginPage, commonPage }) => {
    await loginPage.login({ username: USERS.PATIENT.username, password: WRONG_PASSWORD });

    await commonPage.verifyAlert(COMMON.ALERT, TEXTS.LOGIN_ERROR_MESSAGE);
    await commonPage.verifyUrl(ROUTES.LOGIN);
  });

  test('TC-005 Verify that login fails when the user does not exist', async ({ loginPage, commonPage }) => {
    await loginPage.login(UNKNOWN_USER);

    await commonPage.verifyAlert(COMMON.ALERT, TEXTS.LOGIN_ERROR_MESSAGE);
    await commonPage.verifyUrl(ROUTES.LOGIN);
  });

  test('TC-006 Verify that the password is not shown while it is typed', async ({ loginPage, commonPage }) => {
    await loginPage.open();
    await loginPage.fillCredentials(USERS.PATIENT);

    await commonPage.verifyItemHasValue(LOGIN_PAGE.PASSWORD_INPUT, USERS.PATIENT.password);
  });

  test('TC-007 Verify that the form does not submit when the fields are empty', async ({ loginPage, commonPage }) => {
    await loginPage.open();
    await loginPage.submit();

    await commonPage.verifyFieldIsRequired(LOGIN_PAGE.USERNAME_INPUT);
    await commonPage.verifyUrl(ROUTES.LOGIN);
  });
});

test.describe('Verify Logout And Session', () => {
  test('TC-008 Verify that the user can log out', async ({ page, loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.PATIENT);

    await commonPage.logout();

    await commonPage.verifyUrl(ROUTES.LOGIN);
    await commonPage.verifyItemExists(LOGIN_PAGE.SUBMIT_BUTTON);

    await page.goBack();

    await commonPage.verifyUrlIsNot(ROUTES.DASHBOARD);
  });

  test('TC-009 Verify that a logged in user can not open the login page again', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.PATIENT);

    await loginPage.open();

    await commonPage.verifyUrl(ROUTES.DASHBOARD);
    await commonPage.verifyItemMissing(LOGIN_PAGE.SUBMIT_BUTTON);
  });

  test('TC-010 Verify that a user who is not logged in can not open the dashboard', async ({ commonPage }) => {
    await commonPage.goto(ROUTES.PATIENT_APPOINTMENTS);

    await commonPage.verifyUrl(ROUTES.LOGIN);
    await commonPage.verifyItemExists(LOGIN_PAGE.SUBMIT_BUTTON);
  });

  test('TC-011 Verify that the user stays logged in after a reload', async ({ page, loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.DOCTOR);

    await page.reload();

    await commonPage.verifyUrl(ROUTES.DASHBOARD);
    await commonPage.verifyTextExists(greetingText(USERS.DOCTOR.username));
  });

  test('TC-012 Verify that the user menu opens the profile page', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.DOCTOR);

    await commonPage.clickOnItem(COMMON.AVATAR_BUTTON);
    await commonPage.clickOnItem(userMenuItem(MENU_ITEMS.PROFILE));

    await commonPage.verifyUrl(ROUTES.PROFILE);
    await commonPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.PROFILE);
  });
});

test.describe('Verify Left Menu Per Role', () => {
  test('TC-013 Verify that the left menu shows the right items for the admin', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.ADMIN);

    await commonPage.verifyLeftMenu(EXPECTED_MENU_BY_ROLE.ADMIN);
  });

  test('TC-014 Verify that the left menu shows the right items for the doctor', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.DOCTOR);

    await commonPage.verifyLeftMenu(EXPECTED_MENU_BY_ROLE.DOCTOR);
  });

  test('TC-015 Verify that the left menu shows the right items for the patient', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.PATIENT);

    await commonPage.verifyLeftMenu(EXPECTED_MENU_BY_ROLE.PATIENT);
  });

  test('TC-016 Verify that a wrong adress shows the NotFoundPage', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.PATIENT);

    await commonPage.goto(ROUTES.UNKNOWN);

    await commonPage.verifyTextExists(TEXTS.NOT_FOUND_TITLE);
    await commonPage.verifyTextExists(TEXTS.NOT_FOUND_MESSAGE);
    await commonPage.verifyTextExists(BUTTONS.BACK_TO_DASHBOARD);
  });
});
