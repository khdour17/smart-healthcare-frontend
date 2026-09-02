import { ROUTES } from '../config/app.config';
import {
  BUTTONS,
  FIELD_LABELS,
  ICON_BUTTONS,
  PAGE_TITLES,
  TEXTS,
} from '../config/messages';
import { test } from '../fixtures/testFixtures';
import {

  COMMON,
  dialogButton,
  drawerButton,
  firstRowAction,
  formField,
  iconButton,
  tableRow,
} from '../selectors/common.selectors';
import {
  PEOPLE,
  uniqueText,
  USERS,
} from '../testData/common.data';
import {
  EXISTING_DIAGNOSIS,
  FREE_DAYS,
  newRecordEntry,
  REPLACED_WORK_HOURS,
  SPECIALTY,
  WORK_HOURS,
} from '../testData/doctor.data';

test.beforeEach(async ({ loginPage }) => {
  await loginPage.loginAs(USERS.DOCTOR);
});

test.describe('Verify Doctor Access', () => {
  test('TC-028 Verify that a doctor can not open an admin page', async ({ commonPage }) => {
    await commonPage.goto(ROUTES.ADMIN_ADMINS);

    await commonPage.verifyUrl(ROUTES.DASHBOARD);
  });

  test('TC-029 Verify that a doctor can not open a patient page', async ({ commonPage }) => {
    await commonPage.goto(ROUTES.PATIENT_PRESCRIPTIONS);

    await commonPage.verifyUrl(ROUTES.DASHBOARD);
  });
});

test.describe('Verify Doctor Work Hours', () => {
  test('TC-030 Verify that the doctor can add work hours for a day and delete them again', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_WORK_HOURS);
    await doctorPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.WORK_HOURS);

    await doctorPage.addWorkHours(FREE_DAYS.ADD, WORK_HOURS);

    await doctorPage.verifyToast(TEXTS.WORK_HOURS_SAVED);
    await doctorPage.showListView();
    await doctorPage.verifyItemContainsText(tableRow(FREE_DAYS.ADD), WORK_HOURS.START);
    await doctorPage.verifyItemContainsText(tableRow(FREE_DAYS.ADD), `${WORK_HOURS.SLOT_MINUTES} min`);

    await doctorPage.deleteWorkHours(FREE_DAYS.ADD);

    await doctorPage.verifyToast(TEXTS.WORK_HOURS_REMOVED);
    await doctorPage.verifyItemMissing(tableRow(FREE_DAYS.ADD));
  });

  test('TC-031 Verify that saving the same day again replaces the old hours', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_WORK_HOURS);
    await doctorPage.addWorkHours(FREE_DAYS.REPLACE, WORK_HOURS);
    await doctorPage.showListView();
    await doctorPage.verifyItemContainsText(tableRow(FREE_DAYS.REPLACE), WORK_HOURS.START);

    await doctorPage.addWorkHours(FREE_DAYS.REPLACE, REPLACED_WORK_HOURS);

    await doctorPage.verifyItemHasCount(tableRow(FREE_DAYS.REPLACE), 1);
    await doctorPage.verifyItemContainsText(tableRow(FREE_DAYS.REPLACE), REPLACED_WORK_HOURS.START);

    await doctorPage.deleteWorkHours(FREE_DAYS.REPLACE);
  });

  test('TC-032 Verify that the work hours form needs a day before it saves', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_WORK_HOURS);
    await doctorPage.clickOnItem(COMMON.ADD_BUTTON);
    await doctorPage.clickOnItem(drawerButton(BUTTONS.SAVE));

    await doctorPage.verifyItemExists(COMMON.DRAWER);
  });

  test('TC-033 Verify that Cancel throws away what was typed in the work hours form', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_WORK_HOURS);
    await doctorPage.clickOnItem(COMMON.ADD_BUTTON);
    await doctorPage.fillItem(formField(FIELD_LABELS.START_TIME), REPLACED_WORK_HOURS.START);
    await doctorPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await doctorPage.verifyItemMissing(COMMON.DRAWER);

    await doctorPage.clickOnItem(COMMON.ADD_BUTTON);

    await doctorPage.verifyItemHasValue(formField(FIELD_LABELS.START_TIME), WORK_HOURS.START);
  });

  test('TC-034 Verify that the work hours calendar shows a block for every working day', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_WORK_HOURS);
    await doctorPage.showCalendarView();

    await doctorPage.verifyItemExists(COMMON.CALENDAR_ITEM);
    await doctorPage.verifyItemContainsText(COMMON.CALENDAR_ITEM, WORK_HOURS.START);
  });

  test('TC-035 Verify that the view the doctor picked is still there after a reload', async ({ doctorPage, page }) => {
    await doctorPage.goto(ROUTES.DOCTOR_WORK_HOURS);
    await doctorPage.showListView();

    await page.reload();

    await doctorPage.verifyItemExists(COMMON.TABLE_ROW);
    await doctorPage.verifyItemMissing(COMMON.CALENDAR_ITEM);
  });
});

test.describe('Verify Doctor Appointments', () => {
  test('TC-036 Verify that the doctor can see his appointments on the calendar', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_SCHEDULE);
    await doctorPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.APPOINTMENTS);
    await doctorPage.showCalendarView();

    await doctorPage.verifyItemHasCount(COMMON.CALENDAR_DAY, 7);
  });

  test('TC-037 Verify that the doctor can walk to the week before and come back', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_SCHEDULE);
    await doctorPage.showCalendarView();
    const thisWeek = await doctorPage.readText(COMMON.WEEK_LABEL);

    await doctorPage.clickOnItem(iconButton(ICON_BUTTONS.PREVIOUS_WEEK));

    await doctorPage.verifyItemHasNotText(COMMON.WEEK_LABEL, thisWeek);

    await doctorPage.clickOnText(BUTTONS.THIS_WEEK);

    await doctorPage.verifyItemContainsText(COMMON.WEEK_LABEL, thisWeek);
  });

  test('TC-038 Verify that the doctor can open the details of an appointment', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_SCHEDULE);
    await doctorPage.showListView();
    await doctorPage.clickOnItem(firstRowAction(ICON_BUTTONS.VIEW_DETAILS));

    await doctorPage.verifyItemExists(COMMON.DRAWER);
    await doctorPage.verifyItemContainsText(COMMON.DRAWER, TEXTS.APPOINTMENT_DETAILS);

    await doctorPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await doctorPage.verifyItemMissing(COMMON.DRAWER);
  });
});

test.describe('Verify Doctor Medical Records', () => {
  test('TC-039 Verify that the doctor can write an entry in a patient record', async ({ doctorPage }) => {
    const title = uniqueText('Checkup');

    await doctorPage.goto(ROUTES.DOCTOR_MEDICAL_RECORDS);
    await doctorPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.MEDICAL_RECORDS);
    await doctorPage.pickPatient(PEOPLE.PATIENT_NAME);
    await doctorPage.addRecordEntry(newRecordEntry(title));

    await doctorPage.verifyToast(TEXTS.RECORD_ENTRY_SAVED);
    await doctorPage.verifyTextExists(title);

    await doctorPage.deleteRecordEntry(title);

    await doctorPage.verifyToast(TEXTS.RECORD_ENTRY_DELETED);
  });

  test('TC-040 Verify that the doctor can change an entry he already wrote', async ({ doctorPage }) => {
    const title = uniqueText('First');
    const changed = uniqueText('Changed');

    await doctorPage.goto(ROUTES.DOCTOR_MEDICAL_RECORDS);
    await doctorPage.pickPatient(PEOPLE.PATIENT_NAME);
    await doctorPage.addRecordEntry(newRecordEntry(title));
    await doctorPage.verifyTextExists(title);

    await doctorPage.editRecordEntry(title, changed);

    await doctorPage.verifyTextExists(changed);
    await doctorPage.verifyItemMissing(`text="${title}"`);

    await doctorPage.deleteRecordEntry(changed);
  });

  test('TC-041 Verify that the entry form does not save without a title', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_MEDICAL_RECORDS);
    await doctorPage.pickPatient(PEOPLE.PATIENT_NAME);
    await doctorPage.clickOnItem(COMMON.ADD_BUTTON);

    await doctorPage.verifyItemIsDisabled(drawerButton(BUTTONS.ADD_ENTRY));

    await doctorPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await doctorPage.verifyItemMissing(COMMON.DRAWER);
  });
});

test.describe('Verify Doctor Prescriptions', () => {
  test('TC-042 Verify that the doctor can see the prescriptions he wrote', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_PRESCRIPTIONS);

    await doctorPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.PRESCRIPTIONS);
    await doctorPage.verifyItemExists(COMMON.TABLE_ROW);
  });

  test('TC-043 Verify that the doctor can open the details of a prescription', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_PRESCRIPTIONS);
    await doctorPage.clickOnItem(firstRowAction(ICON_BUTTONS.VIEW_DETAILS));

    await doctorPage.verifyItemExists(COMMON.DRAWER);
    await doctorPage.verifyItemContainsText(COMMON.DRAWER, TEXTS.PRESCRIPTION_DETAILS);

    await doctorPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await doctorPage.verifyItemMissing(COMMON.DRAWER);
  });

  test('TC-044 Verify that the doctor can change a prescription he already wrote', async ({ doctorPage }) => {
    const diagnosis = uniqueText(EXISTING_DIAGNOSIS);

    await doctorPage.goto(ROUTES.DOCTOR_PRESCRIPTIONS);
    await doctorPage.clickRowAction(EXISTING_DIAGNOSIS, ICON_BUTTONS.EDIT_PRESCRIPTION);
    await doctorPage.fillItem(formField(FIELD_LABELS.DIAGNOSIS), diagnosis);
    await doctorPage.clickOnItem(drawerButton(BUTTONS.SAVE_CHANGES));

    await doctorPage.verifyToast(TEXTS.PRESCRIPTION_SAVED);
    await doctorPage.verifyItemExists(tableRow(diagnosis));

    await doctorPage.clickRowAction(diagnosis, ICON_BUTTONS.EDIT_PRESCRIPTION);
    await doctorPage.fillItem(formField(FIELD_LABELS.DIAGNOSIS), EXISTING_DIAGNOSIS);
    await doctorPage.clickOnItem(drawerButton(BUTTONS.SAVE_CHANGES));

    await doctorPage.verifyItemMissing(tableRow(diagnosis));
    await doctorPage.verifyItemExists(tableRow(EXISTING_DIAGNOSIS));
  });

  test('TC-045 Verify that Cancel in the ConfirmDialog keeps the prescription', async ({ doctorPage }) => {
    await doctorPage.goto(ROUTES.DOCTOR_PRESCRIPTIONS);
    await doctorPage.verifyItemExists(COMMON.TABLE_ROW);
    const before = await doctorPage.countItems(COMMON.TABLE_ROW);

    await doctorPage.clickOnItem(firstRowAction(ICON_BUTTONS.DELETE_PRESCRIPTION));
    await doctorPage.clickOnItem(dialogButton(BUTTONS.CANCEL));

    await doctorPage.verifyItemMissing(COMMON.DIALOG);
    await doctorPage.verifyItemHasCount(COMMON.TABLE_ROW, before);
  });
});

test.describe('Verify Doctor Profile', () => {
  test('TC-046 Verify that the doctor can change his own specialty', async ({ doctorPage }) => {
    const changed = uniqueText(SPECIALTY);

    await doctorPage.goto(ROUTES.PROFILE);
    await doctorPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.PROFILE);

    await doctorPage.editProfile({ [FIELD_LABELS.SPECIALTY]: changed });

    await doctorPage.verifyToast(TEXTS.PROFILE_SAVED);
    await doctorPage.verifyTextExists(changed);

    await doctorPage.editProfile({ [FIELD_LABELS.SPECIALTY]: SPECIALTY });

    await doctorPage.verifyTextExists(SPECIALTY);
  });
});
