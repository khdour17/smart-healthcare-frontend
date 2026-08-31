import { ROUTES } from '../config/app.config';
import {
  BUTTONS,
  FIELD_LABELS,
  PAGE_TITLES,
  selectedCountText,
  TEXTS,
} from '../config/messages';
import { USERS } from '../config/testData';
import { test } from '../fixtures/testFixtures';
import {
  newAdmin,
  newDoctor,
  newPatient,
} from '../helpers/userData';
import {
  COMMON,
  dialogButton,
  drawerButton,
  formField,
  tableRow,
  tableRowCheckbox,
} from '../selectors/common.selectors';

test.beforeEach(async ({ loginPage }) => {
  await loginPage.loginAs(USERS.ADMIN);
});

test.describe('Verify Admin Access', () => {
  test('TC-012 Verify that an admin can not open a patient page', async ({ commonPage }) => {
    await commonPage.goto(ROUTES.PATIENT_APPOINTMENTS);

    await commonPage.verifyUrl(ROUTES.DASHBOARD);
  });
});

test.describe('Verify Admin Doctors', () => {
  test('TC-013 Verify that the admin can see the list of doctors', async ({ adminPage }) => {
    const doctor = newDoctor();
    const username = doctor[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.DOCTORS);
    await adminPage.addUser(doctor, BUTTONS.CREATE_DOCTOR);

    await adminPage.verifyItemContainsText(tableRow(username), doctor[FIELD_LABELS.FULL_NAME]);
    await adminPage.verifyItemContainsText(tableRow(username), doctor[FIELD_LABELS.SPECIALTY]);
    await adminPage.verifyItemContainsText(tableRow(username), doctor[FIELD_LABELS.EMAIL]);

    await adminPage.deleteRows([username], BUTTONS.DELETE);
  });

  test('TC-014 Verify that the admin can add a new doctor', async ({ adminPage }) => {
    const doctor = newDoctor();
    const username = doctor[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.addUser(doctor, BUTTONS.CREATE_DOCTOR);

    await adminPage.verifyItemMissing(COMMON.DRAWER);
    await adminPage.verifyItemExists(tableRow(username));

    await adminPage.deleteRows([username], BUTTONS.DELETE);
  });

  test('TC-015 Verify that a doctor can not be added with a username that is taken', async ({ adminPage }) => {
    const doctor = newDoctor();
    const username = doctor[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.addUser(doctor, BUTTONS.CREATE_DOCTOR);
    await adminPage.verifyItemExists(tableRow(username));

    await adminPage.addUser(
      newDoctor({ [FIELD_LABELS.USERNAME]: username }),
      BUTTONS.CREATE_DOCTOR,
    );

    await adminPage.verifyAlert(COMMON.DRAWER_ALERT, TEXTS.CREATE_DOCTOR_ERROR);
    await adminPage.verifyItemExists(COMMON.DRAWER);

    await adminPage.clickOnItem(drawerButton(BUTTONS.CANCEL));
    await adminPage.deleteRows([username], BUTTONS.DELETE);
  });

  test('TC-016 Verify that a doctor can not be added with an email that is taken', async ({ adminPage }) => {
    const doctor = newDoctor();
    const username = doctor[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.addUser(doctor, BUTTONS.CREATE_DOCTOR);
    await adminPage.verifyItemExists(tableRow(username));

    await adminPage.addUser(
      newDoctor({ [FIELD_LABELS.EMAIL]: doctor[FIELD_LABELS.EMAIL] }),
      BUTTONS.CREATE_DOCTOR,
    );

    await adminPage.verifyAlert(COMMON.DRAWER_ALERT, TEXTS.CREATE_DOCTOR_ERROR);
    await adminPage.verifyItemExists(COMMON.DRAWER);

    await adminPage.clickOnItem(drawerButton(BUTTONS.CANCEL));
    await adminPage.deleteRows([username], BUTTONS.DELETE);
  });

  test('TC-017 Verify that the required fields must be filled in the form', async ({ adminPage }) => {
    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.addUser(
      newDoctor({ [FIELD_LABELS.USERNAME]: '' }),
      BUTTONS.CREATE_DOCTOR,
    );

    await adminPage.verifyFieldIsRequired(formField(FIELD_LABELS.USERNAME));
    await adminPage.verifyItemExists(COMMON.DRAWER);
  });

  test('TC-018 Verify that Cancel throws away what was typed', async ({ adminPage }) => {
    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.clickOnItem(COMMON.ADD_BUTTON);
    await adminPage.fillForm(newDoctor());
    await adminPage.clickOnItem(drawerButton(BUTTONS.CANCEL));

    await adminPage.verifyItemMissing(COMMON.DRAWER);

    await adminPage.clickOnItem(COMMON.ADD_BUTTON);

    await adminPage.verifyItemHasValue(formField(FIELD_LABELS.USERNAME), '');
    await adminPage.verifyItemHasValue(formField(FIELD_LABELS.EMAIL), '');
    await adminPage.verifyItemHasValue(formField(FIELD_LABELS.SPECIALTY), '');
  });

  test('TC-019 Verify that the admin can delete one doctor', async ({ adminPage }) => {
    const doctor = newDoctor();
    const username = doctor[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.addUser(doctor, BUTTONS.CREATE_DOCTOR);
    await adminPage.verifyItemExists(tableRow(username));

    await adminPage.deleteRows([username], BUTTONS.DELETE);

    await adminPage.verifyItemMissing(tableRow(username));
  });

  test('TC-020 Verify that the admin can delete more than one doctor at the same time', async ({ adminPage }) => {
    const firstDoctor = newDoctor();
    const secondDoctor = newDoctor();
    const firstUsername = firstDoctor[FIELD_LABELS.USERNAME];
    const secondUsername = secondDoctor[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.addUser(firstDoctor, BUTTONS.CREATE_DOCTOR);
    await adminPage.addUser(secondDoctor, BUTTONS.CREATE_DOCTOR);

    await adminPage.checkItem(tableRowCheckbox(firstUsername));
    await adminPage.checkItem(tableRowCheckbox(secondUsername));

    await adminPage.verifyTextExists(selectedCountText(2));

    await adminPage.clickOnItem(COMMON.DELETE_SELECTED_BUTTON);
    await adminPage.clickOnItem(dialogButton(BUTTONS.DELETE));

    await adminPage.verifyItemMissing(tableRow(firstUsername));
    await adminPage.verifyItemMissing(tableRow(secondUsername));
  });

  test('TC-021 Verify that Cancel in the ConfirmDialog keeps the doctor', async ({ adminPage }) => {
    const doctor = newDoctor();
    const username = doctor[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_DOCTORS);
    await adminPage.addUser(doctor, BUTTONS.CREATE_DOCTOR);

    await adminPage.checkItem(tableRowCheckbox(username));
    await adminPage.clickOnItem(COMMON.DELETE_SELECTED_BUTTON);
    await adminPage.clickOnItem(dialogButton(BUTTONS.CANCEL));

    await adminPage.verifyItemMissing(COMMON.DIALOG);
    await adminPage.verifyItemExists(tableRow(username));

    await adminPage.deleteRows([username], BUTTONS.DELETE);
  });
});

test.describe('Verify Admin Patients', () => {
  test('TC-022 Verify that the admin can see the list of patients', async ({ adminPage }) => {
    const patient = newPatient();
    const username = patient[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_PATIENTS);
    await adminPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.PATIENTS);
    await adminPage.addUser(patient, BUTTONS.CREATE_PATIENT);

    await adminPage.verifyItemContainsText(tableRow(username), patient[FIELD_LABELS.FULL_NAME]);
    await adminPage.verifyItemContainsText(tableRow(username), patient[FIELD_LABELS.DATE_OF_BIRTH]);
    await adminPage.verifyItemContainsText(tableRow(username), patient[FIELD_LABELS.EMAIL]);

    await adminPage.deleteRows([username], BUTTONS.DELETE);
  });

  test('TC-023 Verify that the admin can add a new patient with and without the optional fields', async ({ adminPage }) => {
    const fullPatient = newPatient();
    const minimalPatient = newPatient({
      [FIELD_LABELS.PHONE]: '',
      [FIELD_LABELS.ADDRESS]: '',
    });
    const fullUsername = fullPatient[FIELD_LABELS.USERNAME];
    const minimalUsername = minimalPatient[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_PATIENTS);
    await adminPage.addUser(fullPatient, BUTTONS.CREATE_PATIENT);

    await adminPage.verifyItemMissing(COMMON.DRAWER);

    await adminPage.addUser(minimalPatient, BUTTONS.CREATE_PATIENT);

    await adminPage.verifyItemMissing(COMMON.DRAWER);
    await adminPage.verifyItemExists(tableRow(fullUsername));
    await adminPage.verifyItemExists(tableRow(minimalUsername));

    await adminPage.deleteRows([fullUsername, minimalUsername], BUTTONS.DELETE);
  });
});

test.describe('Verify Admin Admins', () => {
  test('TC-024 Verify that the admin can see the list of admins', async ({ adminPage }) => {
    const admin = newAdmin();
    const username = admin[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_ADMINS);
    await adminPage.verifyItemContainsText(COMMON.PAGE_HEADING, PAGE_TITLES.ADMINS);
    await adminPage.addUser(admin, BUTTONS.CREATE_ADMIN);

    await adminPage.verifyItemContainsText(tableRow(username), admin[FIELD_LABELS.FULL_NAME]);
    await adminPage.verifyItemContainsText(tableRow(username), admin[FIELD_LABELS.DEPARTMENT]);

    await adminPage.deleteRows([username], BUTTONS.DELETE);
  });

  test('TC-025 Verify that the admin can add another admin', async ({ adminPage, loginPage }) => {
    const admin = newAdmin();
    const username = admin[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_ADMINS);
    await adminPage.addUser(admin, BUTTONS.CREATE_ADMIN);

    await adminPage.verifyItemExists(tableRow(username));

    await adminPage.logout();
    await loginPage.loginAs({ username, password: admin[FIELD_LABELS.PASSWORD] });

    await adminPage.logout();
    await loginPage.loginAs(USERS.ADMIN);
    await adminPage.goto(ROUTES.ADMIN_ADMINS);
    await adminPage.deleteRows([username], BUTTONS.DELETE);
  });

  test('TC-026 Verify that the admin can delete another admin', async ({ adminPage }) => {
    const admin = newAdmin();
    const username = admin[FIELD_LABELS.USERNAME];

    await adminPage.goto(ROUTES.ADMIN_ADMINS);
    await adminPage.addUser(admin, BUTTONS.CREATE_ADMIN);
    await adminPage.verifyItemExists(tableRow(username));

    await adminPage.deleteRows([username], BUTTONS.DELETE);

    await adminPage.verifyItemMissing(tableRow(username));
  });

  test('TC-027 Verify that the admin can not delete himself', async ({ adminPage }) => {
    await adminPage.goto(ROUTES.ADMIN_ADMINS);
    await adminPage.deleteRows([USERS.ADMIN.username], BUTTONS.DELETE);

    await adminPage.verifyAlert(COMMON.DIALOG_ALERT, TEXTS.DELETE_OWN_ADMIN_ERROR);
    await adminPage.verifyItemExists(COMMON.DIALOG);

    await adminPage.clickOnItem(dialogButton(BUTTONS.CANCEL));

    await adminPage.verifyItemExists(tableRow(USERS.ADMIN.username));
  });
});
