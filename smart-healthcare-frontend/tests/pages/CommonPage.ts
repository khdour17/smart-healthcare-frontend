import { expect, type Page } from '@playwright/test';

import { USER_MENU_ITEMS } from '../config/messages';
import {
  COMMON,
  withExactChildText,
  withExactText,
} from '../selectors/common.selectors';

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

  async verifyItemExists(selector: string): Promise<void> {
    await expect(this.page.locator(selector).first()).toBeVisible();
  }

  async verifyItemMissing(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(0);
  }

  async verifyTextExists(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: true }).first()).toBeVisible();
  }

  async verifyAlert(message: string): Promise<void> {
    await expect(this.page.locator(COMMON.ALERT)).toContainText(message);
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

  leftMenuItem(label: string): string {
    return withExactChildText(COMMON.LEFT_MENU_ITEM, label);
  }

  async openMenuItem(label: string): Promise<void> {
    await this.clickOnItem(this.leftMenuItem(label));
  }

  async logout(): Promise<void> {
    await this.clickOnItem(COMMON.AVATAR_BUTTON);
    await this.clickOnItem(withExactText(COMMON.USER_MENU_ITEM, USER_MENU_ITEMS.LOGOUT));
  }
}
