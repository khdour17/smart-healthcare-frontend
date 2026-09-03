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
  listOptionContaining,
  selectField,
} from '../selectors/common.selectors';
import { CommonPage } from './CommonPage';

export class PatientPage extends CommonPage {
  async openBookingForm(): Promise<void> {
    await this.clickOnItem(COMMON.ADD_BUTTON);
  }

  async pickDoctorAndDate(doctorName: string, date: string): Promise<void> {
    await this.clickOnItem(selectField(FIELD_LABELS.DOCTOR));
    await this.clickOnItem(listOptionContaining(doctorName));
    await this.fillItem(formField(FIELD_LABELS.DATE), date);
  }

  async pickFirstFreeTime(): Promise<string> {
    await this.verifyItemIsEnabled(drawerButton(BUTTONS.BOOK_APPOINTMENT));
    await this.chooseFirstOption(FIELD_LABELS.TIME);
    return this.readText(selectField(FIELD_LABELS.TIME));
  }

  async bookAppointment(doctorName: string, date: string, reason: string): Promise<string> {
    await this.openBookingForm();
    await this.pickDoctorAndDate(doctorName, date);
    const time = await this.pickFirstFreeTime();
    await this.fillItem(formField(FIELD_LABELS.REASON), reason);
    await this.clickOnItem(drawerButton(BUTTONS.BOOK_APPOINTMENT));
    return time;
  }

  async cancelAppointment(reason: string): Promise<void> {
    await this.clickRowAction(reason, ICON_BUTTONS.CANCEL_APPOINTMENT);
    await this.clickOnItem(dialogButton(BUTTONS.CANCEL_APPOINTMENT));
  }

  async deleteAppointment(reason: string): Promise<void> {
    await this.clickRowAction(reason, ICON_BUTTONS.DELETE_APPOINTMENT);
    await this.clickOnItem(dialogButton(BUTTONS.DELETE));
  }

  async removeAppointment(reason: string): Promise<void> {
    await this.cancelAppointment(reason);
    await this.deleteAppointment(reason);
  }
}
