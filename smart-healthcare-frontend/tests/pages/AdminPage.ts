import {
  BUTTONS,
  FIELD_LABELS,
  ICON_BUTTONS,
} from '../config/messages';
import {
  COMMON,
  dialogButton,
  drawerButton,
  iconButton,
  tableRow,
  tableRowCheckbox,
} from '../selectors/common.selectors';
import { CommonPage } from './CommonPage';

interface CreatedUser {
  listUrl: string;
  username: string;
}

export class AdminPage extends CommonPage {
  private readonly createdUsers: CreatedUser[] = [];

  async addUser(fields: Record<string, string>, submitLabel: string): Promise<void> {
    const listUrl = this.page.url();

    await this.clickOnItem(COMMON.ADD_BUTTON);
    await this.fillForm(fields);
    await this.clickOnItem(drawerButton(submitLabel));

    const username = fields[FIELD_LABELS.USERNAME];
    if (username) {
      this.createdUsers.push({ listUrl, username });
    }
  }

  async deleteRows(cellTexts: string[], confirmLabel: string): Promise<void> {
    for (const cellText of cellTexts) {
      await this.checkItem(tableRowCheckbox(cellText));
    }

    await this.clickOnItem(iconButton(ICON_BUTTONS.DELETE_SELECTED));
    await this.clickOnItem(dialogButton(confirmLabel));
  }

  async removeCreatedUsers(): Promise<void> {
    for (const { listUrl, username } of this.createdUsers) {
      await this.goto(listUrl);
      await this.verifyItemExists(COMMON.TABLE_ROW);

      if (await this.countItems(tableRow(username)) === 0) continue;

      await this.deleteRows([username], BUTTONS.DELETE);
      await this.verifyItemMissing(tableRow(username));
    }

    this.createdUsers.length = 0;
  }
}
