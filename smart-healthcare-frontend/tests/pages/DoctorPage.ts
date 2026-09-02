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
  tableRow,
} from '../selectors/common.selectors';
import { CommonPage } from './CommonPage';

interface WorkHours {
  START: string;
  END: string;
  SLOT_MINUTES: string;
}

export class DoctorPage extends CommonPage {
  async showCalendarView(): Promise<void> {
    await this.clickOnItem(iconButton(ICON_BUTTONS.CALENDAR_VIEW));
  }

  async showListView(): Promise<void> {
    await this.clickOnItem(iconButton(ICON_BUTTONS.LIST_VIEW));
  }

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

  async pickPatient(patientName: string): Promise<void> {
    await this.clickOnItem(COMMON.PATIENT_PICKER);
    await this.clickOnItem(`[role="option"]:text-is("${patientName}")`);
  }

  async addRecordEntry(fields: Record<string, string>): Promise<void> {
    await this.clickOnItem(COMMON.ADD_BUTTON);
    await this.fillForm(fields);
    await this.clickOnItem(drawerButton(BUTTONS.ADD_ENTRY));
  }

  async editRecordEntry(title: string, newTitle: string): Promise<void> {
    await this.clickOnItem(`${COMMON.TIMELINE_ENTRY}:has-text("${title}") ${iconButton(ICON_BUTTONS.EDIT_ENTRY)}`);
    await this.fillItem(formField(FIELD_LABELS.TITLE), newTitle);
    await this.clickOnItem(drawerButton(BUTTONS.SAVE_CHANGES));
  }

  async deleteRecordEntry(title: string): Promise<void> {
    await this.clickOnItem(`${COMMON.TIMELINE_ENTRY}:has-text("${title}") ${iconButton(ICON_BUTTONS.DELETE_ENTRY)}`);
    await this.clickOnItem(dialogButton(BUTTONS.DELETE));
  }
}
