import type { Locator, Page } from '@playwright/test';

import { ROUTES } from '../config/app.config';
import { FIELD_LABELS } from '../config/messages';
import { requiredFieldLabel } from '../selectors/common.selectors';
import { LOGIN_PAGE } from '../selectors/loginPage.selectors';
import type { Credentials } from '../types';

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByLabel(requiredFieldLabel(FIELD_LABELS.USERNAME));
    this.passwordInput = page.getByLabel(requiredFieldLabel(FIELD_LABELS.PASSWORD));
    this.signInButton = page.locator(LOGIN_PAGE.SUBMIT_BUTTON);
    this.errorAlert = page.locator(LOGIN_PAGE.ERROR_ALERT);
  }

  async open(): Promise<void> {
    await this.page.goto(ROUTES.LOGIN);
  }

  async fillCredentials(credentials: Credentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
  }

  async submit(): Promise<void> {
    await this.signInButton.click();
  }

  async login(credentials: Credentials): Promise<void> {
    await this.open();
    await this.fillCredentials(credentials);
    await this.submit();
  }

  async isUsernameMarkedRequired(): Promise<boolean> {
    return this.usernameInput.evaluate(
      (input) => (input as HTMLInputElement).validity.valueMissing,
    );
  }
}
