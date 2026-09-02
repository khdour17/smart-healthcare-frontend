import { ROUTES } from '../config/app.config';
import {
  BUTTONS,
  cancelAppointmentMessage,
  doctorNotAvailableMessage,
  FIELD_LABELS,
  ICON_BUTTONS,
  PAGE_TITLES,
  RECORD_FILTERS,
  STATUSES,
  TEXTS,
} from '../config/messages';
import { test } from '../fixtures/testFixtures';
import {
  COMMON,
  dialogButton,
  drawerButton,
  fieldHelperText,
  firstRowAction,
  formField,
  iconButton,
  recordFilter,
  selectField,
  tableRow,
} from '../selectors/common.selectors';
import {
  PEOPLE,
  uniqueText,
  USERS,
} from '../testData/common.data';
import {
  BOOKING_DATES,
  BOOKING_REASON,
  CHANGED_PROFILE,
  DAY_OFF_NAME,
  PROFILE,
  slotStart,
} from '../testData/patient.data';

test.beforeEach(async ({ loginPage }) => {
  await loginPage.loginAs(USERS.PATIENT);
});

test.describe('Verify Patient Access', () => {
  test('TC-053 Verify that a patient can not open an admin page', async ({ commonPage }) => {
    await commonPage.goto(ROUTES.ADMIN_DOCTORS);

    await commonPage.verifyUrl(ROUTES.DASHBOARD);
  });

  test('TC-054 Verify that a patient can not open a doctor page', async ({ commonPage }) => {
    await commonPage.goto(ROUTES.DOCTOR_WORK_HOURS);

    await commonPage.verifyUrl(ROUTES.DASHBOARD);
  });
});

test.describe('Verify Patient Appointments', () => {
  test('TC-055 Verify that the patient can book an appointment, cancel it and delete it', async ({ patientPage }) => {
    const reason = uniqueText(BOOKING_REASON);

    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.MY_APPOINTMENTS);

    await patientPage.bookAppointment(PEOPLE.DOCTOR_NAME, BOOKING_DATES.FULL_CYCLE, reason);

    await patientPage.verifyToast(TEXTS.APPOINTMENT_BOOKED);
    await patientPage.showListView();
    await patientPage.verifyItemContainsText(tableRow(reason), PEOPLE.DOCTOR_NAME);
    await patientPage.verifyItemContainsText(tableRow(reason), BOOKING_DATES.FULL_CYCLE);
    await patientPage.verifyItemContainsText(tableRow(reason), STATUSES.SCHEDULED);

    await patientPage.cancelAppointment(reason);

    await patientPage.verifyToast(TEXTS.APPOINTMENT_CANCELLED);
    await patientPage.verifyItemContainsText(tableRow(reason), STATUSES.CANCELLED);

    await patientPage.deleteAppointment(reason);

    await patientPage.verifyToast(TEXTS.APPOINTMENT_DELETED);
    await patientPage.verifyItemMissing(tableRow(reason));
  });

  test('TC-056 Verify that the booking form does not book before a doctor and a date are picked', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.openBookingForm();

    await patientPage.verifyItemIsDisabled(drawerButton(BUTTONS.BOOK_APPOINTMENT));

    await patientPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await patientPage.verifyItemMissing(COMMON.DRAWER);
  });

  test('TC-057 Verify that a day the doctor does not work offers no times', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.openBookingForm();
    await patientPage.pickDoctorAndDate(PEOPLE.DOCTOR_NAME, BOOKING_DATES.DAY_OFF);

    await patientPage.verifyItemContainsText(
      fieldHelperText(FIELD_LABELS.TIME),
      doctorNotAvailableMessage(DAY_OFF_NAME),
    );
    await patientPage.verifyItemIsDisabled(drawerButton(BUTTONS.BOOK_APPOINTMENT));
  });

  test('TC-058 Verify that Cancel throws away what was typed in the booking form', async ({ patientPage }) => {
    const reason = uniqueText(BOOKING_REASON);

    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.openBookingForm();
    await patientPage.fillItem(formField(FIELD_LABELS.REASON), reason);
    await patientPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await patientPage.verifyItemMissing(COMMON.DRAWER);

    await patientPage.openBookingForm();

    await patientPage.verifyItemHasValue(formField(FIELD_LABELS.REASON), '');
  });

  test('TC-059 Verify that Keep it in the ConfirmDialog keeps the appointment', async ({ patientPage }) => {
    const reason = uniqueText(BOOKING_REASON);

    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    const time = await patientPage.bookAppointment(PEOPLE.DOCTOR_NAME, BOOKING_DATES.KEPT, reason);
    await patientPage.showListView();
    await patientPage.clickRowAction(reason, ICON_BUTTONS.CANCEL_APPOINTMENT);

    await patientPage.verifyItemContainsText(
      COMMON.DIALOG_MESSAGE,
      cancelAppointmentMessage(PEOPLE.DOCTOR_NAME, BOOKING_DATES.KEPT, slotStart(time)),
    );

    await patientPage.clickOnItem(dialogButton(BUTTONS.KEEP_IT));

    await patientPage.verifyItemMissing(COMMON.DIALOG);
    await patientPage.verifyItemContainsText(tableRow(reason), STATUSES.SCHEDULED);

    await patientPage.removeAppointment(reason);
  });

  test('TC-060 Verify that a time that is already booked is not offered again', async ({ patientPage }) => {
    const reason = uniqueText(BOOKING_REASON);

    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    const time = await patientPage.bookAppointment(PEOPLE.DOCTOR_NAME, BOOKING_DATES.TAKEN_SLOT, reason);

    await patientPage.verifyToast(TEXTS.APPOINTMENT_BOOKED);

    await patientPage.openBookingForm();
    await patientPage.pickDoctorAndDate(PEOPLE.DOCTOR_NAME, BOOKING_DATES.TAKEN_SLOT);
    await patientPage.pickFirstFreeTime();

    await patientPage.verifyItemHasNotText(selectField(FIELD_LABELS.TIME), time);

    await patientPage.clickOnItem(drawerButton(BUTTONS.CANCEL));
    await patientPage.showListView();
    await patientPage.removeAppointment(reason);
  });

  test('TC-061 Verify that the appointments calendar shows a column for every day of the week', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.showCalendarView();

    await patientPage.verifyItemHasCount(COMMON.CALENDAR_DAY, 7);
    await patientPage.verifyItemExists(COMMON.WEEK_LABEL);
  });

  test('TC-062 Verify that the patient can walk to the next week and come back', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.showCalendarView();
    const thisWeek = await patientPage.readText(COMMON.WEEK_LABEL);

    await patientPage.clickOnItem(iconButton(ICON_BUTTONS.NEXT_WEEK));

    await patientPage.verifyItemHasNotText(COMMON.WEEK_LABEL, thisWeek);

    await patientPage.clickOnText(BUTTONS.THIS_WEEK);

    await patientPage.verifyItemContainsText(COMMON.WEEK_LABEL, thisWeek);
  });

  test('TC-063 Verify that the patient can open the details of an appointment', async ({ patientPage }) => {
    const reason = uniqueText(BOOKING_REASON);

    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.bookAppointment(PEOPLE.DOCTOR_NAME, BOOKING_DATES.DETAILS, reason);
    await patientPage.showListView();
    await patientPage.clickRowAction(reason, ICON_BUTTONS.VIEW_DETAILS);

    await patientPage.verifyItemContainsText(COMMON.DRAWER, TEXTS.APPOINTMENT_DETAILS);
    await patientPage.verifyItemContainsText(COMMON.DRAWER, PEOPLE.DOCTOR_NAME);
    await patientPage.verifyItemContainsText(COMMON.DRAWER, reason);

    await patientPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await patientPage.verifyItemMissing(COMMON.DRAWER);

    await patientPage.removeAppointment(reason);
  });

  test('TC-064 Verify that the view the patient picked is still there after a reload', async ({ patientPage, page }) => {
    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.showListView();

    await page.reload();

    await patientPage.verifyItemExists(COMMON.TABLE_ROW);
    await patientPage.verifyItemMissing(COMMON.CALENDAR_DAY);
  });
});

test.describe('Verify Patient Prescriptions', () => {
  test('TC-065 Verify that the patient can see the prescriptions written for him', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_PRESCRIPTIONS);

    await patientPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.MY_PRESCRIPTIONS);
    await patientPage.verifyItemExists(COMMON.TABLE_ROW);
  });

  test('TC-066 Verify that the patient can open the details of a prescription', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_PRESCRIPTIONS);
    await patientPage.clickOnItem(firstRowAction(ICON_BUTTONS.VIEW_DETAILS));

    await patientPage.verifyItemContainsText(COMMON.DRAWER, TEXTS.PRESCRIPTION_DETAILS);

    await patientPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await patientPage.verifyItemMissing(COMMON.DRAWER);
  });
});

test.describe('Verify Patient Medical Record', () => {
  test('TC-067 Verify that the patient can see his own medical record', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_MEDICAL_RECORD);

    await patientPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.MY_MEDICAL_RECORD);
    await patientPage.verifyTextExists(PEOPLE.PATIENT_NAME);
    await patientPage.verifyItemExists(COMMON.TIMELINE_ENTRY);
  });

  test('TC-068 Verify that the record can be filtered down to one kind of item', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_MEDICAL_RECORD);
    await patientPage.clickOnItem(recordFilter(RECORD_FILTERS.VISITS));

    await patientPage.verifyItemContainsText(COMMON.TIMELINE_ENTRY, TEXTS.APPOINTMENT_WITH);

    await patientPage.clickOnItem(recordFilter(RECORD_FILTERS.PRESCRIPTIONS));

    await patientPage.verifyItemContainsText(COMMON.TIMELINE_ENTRY, TEXTS.PRESCRIPTION_FROM);
  });

  test('TC-069 Verify that the patient can open a visit from his record', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PATIENT_MEDICAL_RECORD);
    await patientPage.clickOnItem(recordFilter(RECORD_FILTERS.VISITS));
    await patientPage.clickOnItem(COMMON.FIRST_TIMELINE_ENTRY);

    await patientPage.verifyItemContainsText(COMMON.DRAWER, TEXTS.APPOINTMENT_DETAILS);

    await patientPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await patientPage.verifyItemMissing(COMMON.DRAWER);
  });
});

test.describe('Verify Patient Profile', () => {
  test('TC-070 Verify that the patient can change his phone and address', async ({ patientPage }) => {
    await patientPage.goto(ROUTES.PROFILE);

    await patientPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.PROFILE);
    await patientPage.verifyTextExists(USERS.PATIENT.username);

    await patientPage.editProfile(CHANGED_PROFILE);

    await patientPage.verifyToast(TEXTS.PROFILE_SAVED);
    await patientPage.verifyTextExists(CHANGED_PROFILE[FIELD_LABELS.PHONE]);
    await patientPage.verifyTextExists(CHANGED_PROFILE[FIELD_LABELS.ADDRESS]);

    await patientPage.editProfile(PROFILE);

    await patientPage.verifyTextExists(PROFILE[FIELD_LABELS.PHONE]);
    await patientPage.verifyTextExists(PROFILE[FIELD_LABELS.ADDRESS]);
  });
});
