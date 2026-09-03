import { ROUTES } from '../config/app.config';
import {
  BUTTONS,
  FIELD_LABELS,
  ICON_BUTTONS,
  MENU_ITEMS,
  PAGE_TITLES,
  TEXTS,
} from '../config/messages';
import { test } from '../fixtures/testFixtures';
import {
  COMMON,
  drawerButton,
  formField,
  iconButton,
  leftMenuItem,
} from '../selectors/common.selectors';
import {
  DASHBOARD_TITLES,
  USERS,
} from '../testData/common.data';

test.describe('Verify Dashboard Per Role', () => {
  test('TC-071 Verify that the admin lands on the admin dashboard', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.ADMIN);

    await commonPage.verifyItemContainsText(COMMON.PAGE_HEADING, DASHBOARD_TITLES.ADMIN);
  });

  test('TC-072 Verify that the doctor lands on the doctor dashboard', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.DOCTOR);

    await commonPage.verifyItemContainsText(COMMON.PAGE_HEADING, DASHBOARD_TITLES.DOCTOR);
  });

  test('TC-073 Verify that the patient lands on the patient dashboard', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.PATIENT);

    await commonPage.verifyItemContainsText(COMMON.PAGE_HEADING, DASHBOARD_TITLES.PATIENT);
  });
});

test.describe('Verify Shared Profile', () => {
  test('TC-074 Verify that an admin can not edit his own profile', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.ADMIN);
    await commonPage.goto(ROUTES.PROFILE);

    await commonPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.PROFILE);
    await commonPage.verifyTextExists(USERS.ADMIN.username);
    await commonPage.verifyTextExists(TEXTS.ADMIN_PROFILE_HINT);
    await commonPage.verifyItemMissing(COMMON.ADD_BUTTON);
  });

  test('TC-075 Verify that the profile form does not save without a full name', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.PATIENT);
    await commonPage.goto(ROUTES.PROFILE);
    await commonPage.clickOnItem(COMMON.ADD_BUTTON);
    await commonPage.fillItem(formField(FIELD_LABELS.FULL_NAME), '');
    await commonPage.clickOnItem(drawerButton(BUTTONS.SAVE_CHANGES));

    await commonPage.verifyFieldIsRequired(formField(FIELD_LABELS.FULL_NAME));
    await commonPage.verifyItemExists(COMMON.DRAWER);

    await commonPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await commonPage.verifyItemMissing(COMMON.DRAWER);
  });
});

test.describe('Verify Shared Settings', () => {
  test('TC-076 Verify that the settings page shows who is signed in', async ({ loginPage, commonPage }) => {
    await loginPage.loginAs(USERS.DOCTOR);
    await commonPage.goto(ROUTES.SETTINGS);

    await commonPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.SETTINGS);
    await commonPage.verifyTextExists(USERS.DOCTOR.username);

    await commonPage.clickOnText(BUTTONS.GO_TO_PROFILE);

    await commonPage.verifyUrl(ROUTES.PROFILE);
    await commonPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.PROFILE);
  });

  test('TC-077 Verify that a collapsed side menu is still collapsed after a reload', async ({ loginPage, commonPage, page }) => {
    await loginPage.loginAs(USERS.PATIENT);
    await commonPage.goto(ROUTES.SETTINGS);

    await commonPage.verifyItemIsNotChecked(COMMON.MENU_SWITCH);
    await commonPage.verifyItemExists(leftMenuItem(MENU_ITEMS.SETTINGS));

    await commonPage.checkItem(COMMON.MENU_SWITCH);

    await commonPage.verifyItemMissing(leftMenuItem(MENU_ITEMS.SETTINGS));
    await commonPage.verifyItemExists(iconButton(ICON_BUTTONS.EXPAND_MENU));

    await page.reload();

    await commonPage.verifyItemIsChecked(COMMON.MENU_SWITCH);
    await commonPage.verifyItemExists(iconButton(ICON_BUTTONS.EXPAND_MENU));

    await commonPage.uncheckItem(COMMON.MENU_SWITCH);

    await commonPage.verifyItemExists(leftMenuItem(MENU_ITEMS.SETTINGS));
    await commonPage.verifyItemExists(iconButton(ICON_BUTTONS.COLLAPSE_MENU));
  });
});
