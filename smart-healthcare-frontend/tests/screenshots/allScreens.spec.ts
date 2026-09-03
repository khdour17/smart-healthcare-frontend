import { ROUTES } from '../config/app.config';
import {
  BUTTONS,
  FIELD_LABELS,
  ICON_BUTTONS,
  MENU_ITEMS,
  RECORD_FILTERS,
} from '../config/messages';
import { test } from '../fixtures/testFixtures';
import {
  COMMON,
  dialogButton,
  drawerButton,
  firstMatch,
  firstRowAction,
  formField,
  iconButton,
  recordFilter,
  tableRow,
  tableRowCheckbox,
} from '../selectors/common.selectors';
import { LOGIN_PAGE } from '../selectors/loginPage.selectors';
import {
  PEOPLE,
  USERS,
  WRONG_PASSWORD,
} from '../testData/common.data';
import {
  FREE_DAYS,
  PRESCRIPTION,
  REPLACED_WORK_HOURS,
} from '../testData/doctor.data';
import { CHANGED_PROFILE } from '../testData/patient.data';
import {
  captureOverlay,
  captureScreen,
  useDesktopScreen,
  useMobileScreen,
} from './capture';
import {
  newVisitor,
  nextWorkingDays,
  RECORD_ENTRY,
  sampleDoctor,
  VISIT_NOTES,
  VISIT_REASONS,
} from './screenshotData';

const WEEKS_TO_LOOK_AHEAD = 3;

test.afterEach(async ({ adminPage, commonPage, loginPage }) => {
  await commonPage.clearSession();
  await loginPage.loginAs(USERS.ADMIN);
  await adminPage.removeCreatedUsers();
});

test.describe('Screenshots', () => {
  test('Capture every screen of the app', async ({
    adminPage,
    commonPage,
    doctorPage,
    loginPage,
    page,
    patientPage,
  }) => {
    const visitor = newVisitor();
    const credentials = {
      username: visitor[FIELD_LABELS.USERNAME],
      password: visitor[FIELD_LABELS.PASSWORD],
    };
    const workingDays = nextWorkingDays(VISIT_REASONS.length);

    async function showWeekWithAppointments(): Promise<void> {
      for (let week = 0; week < WEEKS_TO_LOOK_AHEAD; week += 1) {
        if (await commonPage.countItems(COMMON.CALENDAR_ITEM) > 0) return;
        await commonPage.clickOnItem(iconButton(ICON_BUTTONS.NEXT_WEEK));
      }
    }

    await loginPage.open();

    await commonPage.verifyItemExists(LOGIN_PAGE.SUBMIT_BUTTON);
    await captureScreen(page, '01-login');

    await loginPage.fillCredentials({ username: USERS.PATIENT.username, password: WRONG_PASSWORD });
    await loginPage.submit();

    await commonPage.verifyItemExists(COMMON.ALERT);
    await captureScreen(page, '02-login-error');

    await loginPage.loginAs(USERS.ADMIN);

    await commonPage.verifyItemExists(COMMON.STAT_TILE);
    await captureScreen(page, '03-admin-dashboard');

    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.verifyItemExists(COMMON.TABLE_ROW);
    await captureScreen(page, '04-admin-doctors');

    await adminPage.clickOnItem(COMMON.ADD_BUTTON);
    await adminPage.fillForm(sampleDoctor());
    await captureOverlay(page, '05-admin-add-doctor');
    await adminPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await adminPage.checkItem(tableRowCheckbox(USERS.DOCTOR.username));
    await captureScreen(page, '06-admin-selected-rows');

    await adminPage.clickOnItem(iconButton(ICON_BUTTONS.DELETE_SELECTED));
    await captureOverlay(page, '07-admin-delete-dialog');
    await adminPage.clickOnItem(dialogButton(BUTTONS.CANCEL));
    await adminPage.clickOnItem(iconButton(ICON_BUTTONS.CLEAR_SELECTION));

    await adminPage.goto(ROUTES.ADMIN_PATIENTS);
    await adminPage.verifyItemExists(COMMON.TABLE_ROW);
    await captureScreen(page, '08-admin-patients');

    await adminPage.goto(ROUTES.ADMIN_ADMINS);
    await adminPage.verifyItemExists(COMMON.TABLE_ROW);
    await captureScreen(page, '09-admin-admins');

    await adminPage.goto(ROUTES.PROFILE);
    await adminPage.verifyItemExists(COMMON.STAT_TILE);
    await captureScreen(page, '10-admin-profile');

    await adminPage.goto(ROUTES.ADMIN_PATIENTS);
    await adminPage.addUser(visitor, BUTTONS.CREATE_PATIENT);
    await adminPage.verifyItemExists(tableRow(credentials.username));
    await adminPage.logout();

    await loginPage.loginAs(credentials);
    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);

    for (const [index, reason] of VISIT_REASONS.entries()) {
      await patientPage.bookAppointment(PEOPLE.DOCTOR_NAME, workingDays[index], reason);
      await patientPage.verifyItemExists(COMMON.TOAST);
      if (index === 0) await captureOverlay(page, '11-toast-after-booking');
    }

    await patientPage.showCalendarView();
    await showWeekWithAppointments();

    await patientPage.verifyItemExists(COMMON.CALENDAR_ITEM);
    await captureScreen(page, '12-patient-appointments-calendar');

    await patientPage.openBookingForm();
    await patientPage.pickDoctorAndDate(PEOPLE.DOCTOR_NAME, workingDays[0]);
    await patientPage.verifyItemIsEnabled(drawerButton(BUTTONS.BOOK_APPOINTMENT));
    await captureOverlay(page, '13-patient-book-appointment');
    await patientPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await patientPage.showListView();
    await patientPage.verifyItemExists(COMMON.TABLE_ROW);
    await captureScreen(page, '14-patient-appointments-list');

    await patientPage.clickRowAction(VISIT_REASONS[0], ICON_BUTTONS.CANCEL_APPOINTMENT);
    await captureOverlay(page, '15-patient-cancel-dialog');
    await patientPage.clickOnItem(dialogButton(BUTTONS.KEEP_IT));
    await patientPage.logout();

    await loginPage.loginAs(USERS.PATIENT);

    await commonPage.verifyItemExists(COMMON.STAT_TILE);
    await captureScreen(page, '16-patient-dashboard');

    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.showListView();
    await patientPage.clickOnItem(firstRowAction(ICON_BUTTONS.VIEW_DETAILS));

    await patientPage.verifyItemExists(COMMON.DRAWER);
    await captureOverlay(page, '17-patient-appointment-details');
    await patientPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await patientPage.goto(ROUTES.PATIENT_PRESCRIPTIONS);
    await patientPage.verifyItemExists(COMMON.TABLE_ROW);
    await captureScreen(page, '18-patient-prescriptions');

    await patientPage.clickOnItem(firstRowAction(ICON_BUTTONS.VIEW_DETAILS));
    await patientPage.verifyItemExists(COMMON.DRAWER);
    await captureOverlay(page, '19-patient-prescription-details');
    await patientPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await patientPage.goto(ROUTES.PATIENT_MEDICAL_RECORD);
    await patientPage.verifyItemExists(COMMON.TIMELINE_ENTRY);
    await captureScreen(page, '20-patient-medical-record');

    await patientPage.clickOnItem(recordFilter(RECORD_FILTERS.PRESCRIPTIONS));
    await patientPage.verifyItemExists(COMMON.TIMELINE_ENTRY);
    await captureScreen(page, '21-patient-record-filtered');

    await patientPage.goto(ROUTES.PROFILE);
    await patientPage.verifyItemExists(COMMON.STAT_TILE);
    await captureScreen(page, '22-patient-profile');

    await patientPage.clickOnItem(COMMON.ADD_BUTTON);
    await patientPage.fillForm(CHANGED_PROFILE);
    await captureOverlay(page, '23-patient-edit-profile');
    await patientPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await commonPage.goto(ROUTES.SETTINGS);
    await commonPage.verifyItemExists(COMMON.MENU_SWITCH);
    await captureScreen(page, '24-settings');

    await commonPage.checkItem(COMMON.MENU_SWITCH);
    await commonPage.verifyItemExists(iconButton(ICON_BUTTONS.EXPAND_MENU));
    await captureScreen(page, '25-collapsed-menu');
    await commonPage.uncheckItem(COMMON.MENU_SWITCH);

    await commonPage.clickOnItem(COMMON.AVATAR_BUTTON);
    await commonPage.verifyTextExists(MENU_ITEMS.SETTINGS);
    await captureOverlay(page, '26-user-menu');
    await commonPage.pressKey('Escape');

    await commonPage.goto(ROUTES.UNKNOWN);
    await commonPage.verifyTextExists(BUTTONS.BACK_TO_DASHBOARD);
    await captureScreen(page, '27-not-found');

    await useMobileScreen(page);
    await commonPage.goto(ROUTES.DASHBOARD);
    await commonPage.verifyItemExists(COMMON.STAT_TILE);
    await captureScreen(page, '28-mobile-dashboard');

    await commonPage.clickOnItem(iconButton(ICON_BUTTONS.OPEN_MENU));
    await commonPage.verifyItemExists(COMMON.MOBILE_MENU_ITEM);
    await captureOverlay(page, '29-mobile-menu');
    await commonPage.pressKey('Escape');
    await useDesktopScreen(page);

    await commonPage.logout();

    await loginPage.loginAs(USERS.DOCTOR);

    await commonPage.verifyItemExists(COMMON.STAT_TILE);
    await captureScreen(page, '30-doctor-dashboard');

    await doctorPage.goto(ROUTES.DOCTOR_SCHEDULE);
    await doctorPage.showCalendarView();
    await showWeekWithAppointments();

    await doctorPage.verifyItemExists(COMMON.CALENDAR_ITEM);
    await captureScreen(page, '31-doctor-schedule-calendar');

    await doctorPage.showListView();
    await doctorPage.verifyItemExists(COMMON.TABLE_ROW);
    await captureScreen(page, '32-doctor-schedule-list');

    await doctorPage.clickRowAction(VISIT_REASONS[0], ICON_BUTTONS.COMPLETE_APPOINTMENT);
    await doctorPage.fillItem(formField(FIELD_LABELS.NOTES), VISIT_NOTES);
    await captureOverlay(page, '33-doctor-complete-appointment');
    await doctorPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await doctorPage.clickOnItem(firstMatch(iconButton(ICON_BUTTONS.ADD_PRESCRIPTION)));
    await doctorPage.verifyItemExists(COMMON.DRAWER);
    await doctorPage.fillPrescription(PRESCRIPTION);
    await captureOverlay(page, '34-doctor-add-prescription');
    await doctorPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await doctorPage.clickOnItem(firstRowAction(ICON_BUTTONS.VIEW_DETAILS));
    await doctorPage.verifyItemExists(COMMON.DRAWER);
    await captureOverlay(page, '35-doctor-appointment-details');
    await doctorPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await doctorPage.goto(ROUTES.DOCTOR_WORK_HOURS);
    await doctorPage.showCalendarView();
    await doctorPage.verifyItemExists(COMMON.CALENDAR_ITEM);
    await captureScreen(page, '36-doctor-work-hours-calendar');

    await doctorPage.showListView();
    await doctorPage.verifyItemExists(COMMON.TABLE_ROW);
    await captureScreen(page, '37-doctor-work-hours-list');

    await doctorPage.clickOnItem(COMMON.ADD_BUTTON);
    await doctorPage.chooseOption(FIELD_LABELS.DAY_OF_WEEK, FREE_DAYS.ADD);
    await doctorPage.fillItem(formField(FIELD_LABELS.START_TIME), REPLACED_WORK_HOURS.START);
    await captureOverlay(page, '38-doctor-add-work-hours');
    await doctorPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await doctorPage.goto(ROUTES.DOCTOR_PRESCRIPTIONS);
    await doctorPage.verifyItemExists(COMMON.TABLE_ROW);
    await captureScreen(page, '39-doctor-prescriptions');

    await doctorPage.clickOnItem(firstRowAction(ICON_BUTTONS.EDIT_PRESCRIPTION));
    await doctorPage.verifyItemExists(COMMON.DRAWER);
    await captureOverlay(page, '40-doctor-edit-prescription');
    await doctorPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await doctorPage.clickOnItem(firstRowAction(ICON_BUTTONS.VIEW_DETAILS));
    await doctorPage.verifyItemExists(COMMON.DRAWER);
    await captureOverlay(page, '41-doctor-prescription-details');
    await doctorPage.clickOnItem(iconButton(ICON_BUTTONS.CLOSE));

    await doctorPage.goto(ROUTES.DOCTOR_MEDICAL_RECORDS);
    await doctorPage.pickPatient(PEOPLE.PATIENT_NAME);
    await doctorPage.verifyItemExists(COMMON.TIMELINE_ENTRY);
    await captureScreen(page, '42-doctor-medical-records');

    await doctorPage.clickOnItem(COMMON.ADD_BUTTON);
    await doctorPage.fillItem(formField(FIELD_LABELS.TITLE), RECORD_ENTRY.TITLE);
    await doctorPage.fillItem(formField(FIELD_LABELS.DESCRIPTION), RECORD_ENTRY.DESCRIPTION);
    await captureOverlay(page, '43-doctor-add-record-entry');
    await doctorPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await doctorPage.goto(ROUTES.PROFILE);
    await doctorPage.verifyItemExists(COMMON.STAT_TILE);
    await captureScreen(page, '44-doctor-profile');
  });
});
