import {
  COMMON,
  dialogButton,
  drawerButton,
  tableRowCheckbox,
} from '../selectors/common.selectors';
import { CommonPage } from './CommonPage';

export class AdminPage extends CommonPage {
  async addUser(fields: Record<string, string>, submitLabel: string): Promise<void> {
    await this.clickOnItem(COMMON.ADD_BUTTON);
    await this.fillForm(fields);
    await this.clickOnItem(drawerButton(submitLabel));
  }

  async deleteRows(cellTexts: string[], confirmLabel: string): Promise<void> {
    for (const cellText of cellTexts) {
      await this.checkItem(tableRowCheckbox(cellText));
    }

    await this.clickOnItem(COMMON.DELETE_SELECTED_BUTTON);
    await this.clickOnItem(dialogButton(confirmLabel));
  }
}
