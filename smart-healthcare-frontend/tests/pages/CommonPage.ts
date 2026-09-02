import { expect, type Page } from '@playwright/test';

import {
  ICON_BUTTONS,
  USER_MENU_ITEMS,
} from '../config/messages';
import {
  COMMON,
  formField,
  iconButton,
  leftMenuItem,
  listOption,
  rowAction,
  selectField,
  userMenuItem,
} from '../selectors/common.selectors';
import type { MenuExpectation } from '../types';

export class CommonPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async clickOnItem(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  async clickOnText(text: string): Promise<void> {
    await this.page.getByText(text, { exact: true }).click();
  }

  async fillItem(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).fill(value);
  }

  async checkItem(selector: string): Promise<void> {
    await this.page.locator(selector).check();
  }

  async fillForm(fields: Record<string, string>): Promise<void> {
    for (const [label, value] of Object.entries(fields)) {
      await this.fillItem(formField(label), value);
    }
  }

  async chooseOption(fieldLabel: string, optionLabel: string): Promise<void> {
    await this.clickOnItem(selectField(fieldLabel));
    await this.clickOnItem(listOption(optionLabel));
  }

  async chooseFirstOption(fieldLabel: string): Promise<void> {
    await this.clickOnItem(selectField(fieldLabel));
    await this.clickOnItem(COMMON.FIRST_LIST_OPTION);
  }

  async showCalendarView(): Promise<void> {
    await this.clickOnItem(iconButton(ICON_BUTTONS.CALENDAR_VIEW));
  }

  async showListView(): Promise<void> {
    await this.clickOnItem(iconButton(ICON_BUTTONS.LIST_VIEW));
  }

  async clickRowAction(cellText: string, actionLabel: string): Promise<void> {
    await this.clickOnItem(rowAction(cellText, actionLabel));
  }

  async verifyToast(message: string): Promise<void> {
    await this.verifyItemContainsText(COMMON.TOAST, message);
  }

  async verifyItemExists(selector: string): Promise<void> {
    await expect(this.page.locator(selector).first()).toBeVisible();
  }

  async verifyItemMissing(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(0);
  }

  async verifyItemContainsText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector).first()).toContainText(text);
  }

  async verifyItemHasCount(selector: string, count: number): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(count);
  }

  async verifyItemHasNotText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector).first()).not.toHaveText(text);
  }

  async verifyItemIsDisabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector).first()).toBeDisabled();
  }

  async verifyItemIsEnabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector).first()).toBeEnabled();
  }

  async readText(selector: string): Promise<string> {
    return this.page.locator(selector).first().innerText();
  }

  async countItems(selector: string): Promise<number> {
    return this.page.locator(selector).count();
  }

  async verifyItemHasValue(selector: string, value: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  async verifyTextExists(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: true }).first()).toBeVisible();
  }

  async verifyAlert(selector: string, message: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(message);
  }

  async verifyUrl(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${path}$`));
  }

  async verifyUrlIsNot(path: string): Promise<void> {
    await expect(this.page).not.toHaveURL(new RegExp(path));
  }

  async verifyFieldIsRequired(selector: string): Promise<void> {
    const isEmpty = await this.page
      .locator(selector)
      .evaluate((field) => (field as HTMLInputElement).validity.valueMissing);

    expect(isEmpty).toBe(true);
  }

  async verifyLeftMenu(expected: MenuExpectation): Promise<void> {
    for (const label of expected.shown) {
      await this.verifyItemExists(leftMenuItem(label));
    }

    for (const label of expected.hidden) {
      await this.verifyItemMissing(leftMenuItem(label));
    }
  }

  async logout(): Promise<void> {
    await this.clickOnItem(COMMON.AVATAR_BUTTON);
    await this.clickOnItem(userMenuItem(USER_MENU_ITEMS.LOGOUT));
  }
}
