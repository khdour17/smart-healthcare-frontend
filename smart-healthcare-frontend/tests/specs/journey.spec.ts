import { ROUTES } from '../config/app.config';
import {
  BUTTONS,
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
  drawerButton,
  formField,
  recordFilter,
  tableRow,
  timelineEntry,
} from '../selectors/common.selectors';
import { newPatient } from '../testData/admin.data';
import {
  PEOPLE,
  uniqueText,
  USERS,
} from '../testData/common.data';
import {
  PRESCRIPTION,
  VISIT_NOTES,
} from '../testData/doctor.data';
import {
  BOOKING_DATES,
  BOOKING_REASON,
} from '../testData/patient.data';

test.afterEach(async ({ adminPage, commonPage, loginPage }) => {
  await commonPage.clearSession();
  await loginPage.loginAs(USERS.ADMIN);
  await adminPage.removeCreatedUsers();
});

test.describe('Verify A Visit From Booking To Prescription', () => {
  test('TC-078 Verify that a booked visit can be completed and prescribed for and shows up in the record', async ({
    adminPage,
    doctorPage,
    loginPage,
    patientPage,
  }) => {
    const patient = newPatient();
    const credentials = {
      username: patient[FIELD_LABELS.USERNAME],
      password: patient[FIELD_LABELS.PASSWORD],
    };
    const patientName = patient[FIELD_LABELS.FULL_NAME];
    const reason = uniqueText(BOOKING_REASON);
    const diagnosis = uniqueText(PRESCRIPTION.DIAGNOSIS);
    const changedDiagnosis = uniqueText(PRESCRIPTION.DIAGNOSIS);

    await loginPage.loginAs(USERS.ADMIN);
    await adminPage.goto(ROUTES.ADMIN_PATIENTS);
    await adminPage.addUser(patient, BUTTONS.CREATE_PATIENT);

    await adminPage.verifyItemExists(tableRow(credentials.username));

    await adminPage.logout();

    await loginPage.loginAs(credentials);
    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.bookAppointment(PEOPLE.DOCTOR_NAME, BOOKING_DATES.JOURNEY, reason);

    await patientPage.verifyToast(TEXTS.APPOINTMENT_BOOKED);

    await patientPage.logout();

    await loginPage.loginAs(USERS.DOCTOR);
    await doctorPage.goto(ROUTES.DOCTOR_SCHEDULE);
    await doctorPage.showListView();

    await doctorPage.verifyItemContainsText(tableRow(reason), patientName);

    await doctorPage.completeAppointment(reason, VISIT_NOTES);

    await doctorPage.verifyToast(TEXTS.APPOINTMENT_COMPLETED);
    await doctorPage.verifyItemContainsText(tableRow(reason), STATUSES.COMPLETED);

    await doctorPage.clickRowAction(reason, ICON_BUTTONS.ADD_PRESCRIPTION);
    await doctorPage.writePrescription({ ...PRESCRIPTION, DIAGNOSIS: diagnosis }, BUTTONS.SAVE_PRESCRIPTION);

    await doctorPage.verifyToast(TEXTS.PRESCRIPTION_SAVED);

    await doctorPage.logout();

    await loginPage.loginAs(credentials);
    await patientPage.goto(ROUTES.PATIENT_PRESCRIPTIONS);

    await patientPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.MY_PRESCRIPTIONS);
    await patientPage.verifyItemContainsText(tableRow(diagnosis), PEOPLE.DOCTOR_NAME);

    await patientPage.goto(ROUTES.PATIENT_MEDICAL_RECORD);
    await patientPage.clickOnItem(recordFilter(RECORD_FILTERS.VISITS));

    await patientPage.verifyItemContainsText(timelineEntry(reason), STATUSES.COMPLETED);

    await patientPage.logout();

    await loginPage.loginAs(USERS.DOCTOR);
    await doctorPage.goto(ROUTES.DOCTOR_PRESCRIPTIONS);
    await doctorPage.clickRowAction(diagnosis, ICON_BUTTONS.EDIT_PRESCRIPTION);
    await doctorPage.fillItem(formField(FIELD_LABELS.DIAGNOSIS), changedDiagnosis);
    await doctorPage.clickOnItem(drawerButton(BUTTONS.SAVE_CHANGES));

    await doctorPage.verifyToast(TEXTS.PRESCRIPTION_SAVED);
    await doctorPage.verifyItemExists(tableRow(changedDiagnosis));
    await doctorPage.verifyItemMissing(tableRow(diagnosis));

    await doctorPage.deletePrescription(changedDiagnosis);

    await doctorPage.verifyToast(TEXTS.PRESCRIPTION_DELETED);
    await doctorPage.verifyItemMissing(tableRow(changedDiagnosis));
    await doctorPage.verifyItemMissing(COMMON.DIALOG);
  });
});
