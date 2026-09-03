import {
  BUTTONS,
  FIELD_LABELS,
  ICON_BUTTONS,
} from '../config/messages';
import {
  COMMON,
  dialogButton,
  drawerButton,
  formField,
  iconButton,
  listOption,
  tableRow,
  timelineEntry,
} from '../selectors/common.selectors';
import { CommonPage } from './CommonPage';

interface WorkHours {
  START: string;
  END: string;
  SLOT_MINUTES: string;
}

interface Prescription {
  MEDICINE: string;
  DIAGNOSIS: string;
  INSTRUCTIONS: string;
}

export class DoctorPage extends CommonPage {
  async addWorkHours(day: string, hours: WorkHours): Promise<void> {
    await this.clickOnItem(COMMON.ADD_BUTTON);
    await this.chooseOption(FIELD_LABELS.DAY_OF_WEEK, day);
    await this.fillItem(formField(FIELD_LABELS.START_TIME), hours.START);
    await this.fillItem(formField(FIELD_LABELS.END_TIME), hours.END);
    await this.fillItem(formField(FIELD_LABELS.SLOT_DURATION), hours.SLOT_MINUTES);
    await this.clickOnItem(drawerButton(BUTTONS.SAVE));
  }

  async deleteWorkHours(day: string): Promise<void> {
    await this.showListView();
    await this.clickOnItem(`${tableRow(day)} button`);
    await this.clickOnItem(dialogButton(BUTTONS.DELETE));
  }

  async completeAppointment(reason: string, notes: string): Promise<void> {
    await this.clickRowAction(reason, ICON_BUTTONS.COMPLETE_APPOINTMENT);
    await this.fillItem(formField(FIELD_LABELS.NOTES), notes);
    await this.clickOnItem(drawerButton(BUTTONS.COMPLETE));
  }

  async writePrescription(prescription: Prescription, submitLabel: string): Promise<void> {
    await this.fillItem(formField(FIELD_LABELS.DIAGNOSIS), prescription.DIAGNOSIS);
    await this.fillItem(formField(FIELD_LABELS.MEDICINES), prescription.MEDICINE);
    await this.pressKey('Enter');
    await this.fillItem(formField(FIELD_LABELS.INSTRUCTIONS), prescription.INSTRUCTIONS);
    await this.clickOnItem(drawerButton(submitLabel));
  }

  async deletePrescription(diagnosis: string): Promise<void> {
    await this.clickRowAction(diagnosis, ICON_BUTTONS.DELETE_PRESCRIPTION);
    await this.clickOnItem(dialogButton(BUTTONS.DELETE));
  }

  async pickPatient(patientName: string): Promise<void> {
    await this.clickOnItem(COMMON.PATIENT_PICKER);
    await this.clickOnItem(listOption(patientName));
  }

  async addRecordEntry(fields: Record<string, string>): Promise<void> {
    await this.clickOnItem(COMMON.ADD_BUTTON);
    await this.fillForm(fields);
    await this.clickOnItem(drawerButton(BUTTONS.ADD_ENTRY));
  }

  async editRecordEntry(title: string, newTitle: string): Promise<void> {
    await this.clickOnItem(`${timelineEntry(title)} ${iconButton(ICON_BUTTONS.EDIT_ENTRY)}`);
    await this.fillItem(formField(FIELD_LABELS.TITLE), newTitle);
    await this.clickOnItem(drawerButton(BUTTONS.SAVE_CHANGES));
  }

  async deleteRecordEntry(title: string): Promise<void> {
    await this.clickOnItem(`${timelineEntry(title)} ${iconButton(ICON_BUTTONS.DELETE_ENTRY)}`);
    await this.clickOnItem(dialogButton(BUTTONS.DELETE));
  }
}
