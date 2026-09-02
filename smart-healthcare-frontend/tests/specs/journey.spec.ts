import { ROUTES } from '../config/app.config';
import {
  BUTTONS,
  ICON_BUTTONS,
  RECORD_FILTERS,
  STATUSES,
  TEXTS,
} from '../config/messages';
import { test } from '../fixtures/testFixtures';
import {
  COMMON,
  recordFilter,
  tableRow,
  timelineEntry,
} from '../selectors/common.selectors';
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

test.describe('Verify A Visit From Booking To Prescription', () => {
  test('TC-072 Verify that a booked visit can be completed and prescribed for and shows up in the record', async ({
    loginPage,
    doctorPage,
    patientPage,
  }) => {
    const reason = uniqueText(BOOKING_REASON);
    const diagnosis = uniqueText(PRESCRIPTION.DIAGNOSIS);

    await loginPage.loginAs(USERS.PATIENT);
    await patientPage.goto(ROUTES.PATIENT_APPOINTMENTS);
    await patientPage.bookAppointment(PEOPLE.DOCTOR_NAME, BOOKING_DATES.JOURNEY, reason);

    await patientPage.verifyToast(TEXTS.APPOINTMENT_BOOKED);

    await patientPage.logout();

    await loginPage.loginAs(USERS.DOCTOR);
    await doctorPage.goto(ROUTES.DOCTOR_SCHEDULE);
    await doctorPage.showListView();

    await doctorPage.verifyItemContainsText(tableRow(reason), PEOPLE.PATIENT_NAME);

    await doctorPage.completeAppointment(reason, VISIT_NOTES);

    await doctorPage.verifyToast(TEXTS.APPOINTMENT_COMPLETED);
    await doctorPage.verifyItemContainsText(tableRow(reason), STATUSES.COMPLETED);

    await doctorPage.clickRowAction(reason, ICON_BUTTONS.ADD_PRESCRIPTION);
    await doctorPage.writePrescription({ ...PRESCRIPTION, DIAGNOSIS: diagnosis }, BUTTONS.SAVE_PRESCRIPTION);

    await doctorPage.verifyToast(TEXTS.PRESCRIPTION_SAVED);

    await doctorPage.logout();

    await loginPage.loginAs(USERS.PATIENT);
    await patientPage.goto(ROUTES.PATIENT_PRESCRIPTIONS);

    await patientPage.verifyItemContainsText(tableRow(diagnosis), PEOPLE.DOCTOR_NAME);

    await patientPage.goto(ROUTES.PATIENT_MEDICAL_RECORD);
    await patientPage.clickOnItem(recordFilter(RECORD_FILTERS.VISITS));

    await patientPage.verifyItemContainsText(timelineEntry(reason), STATUSES.COMPLETED);

    await patientPage.logout();

    await loginPage.loginAs(USERS.DOCTOR);
    await doctorPage.goto(ROUTES.DOCTOR_PRESCRIPTIONS);
    await doctorPage.deletePrescription(diagnosis);

    await doctorPage.verifyToast(TEXTS.PRESCRIPTION_DELETED);
    await doctorPage.verifyItemMissing(tableRow(diagnosis));
    await doctorPage.verifyItemMissing(COMMON.DIALOG);
  });
});
