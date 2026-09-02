import { ROUTES } from '../config/app.config';
import { LOGIN_PAGE } from '../selectors/loginPage.selectors';
import type { Credentials } from '../types';
import { CommonPage } from './CommonPage';

export class LoginPage extends CommonPage {
  async open(): Promise<void> {
    await this.goto(ROUTES.LOGIN);
  }

  async fillCredentials(credentials: Credentials): Promise<void> {
    await this.fillItem(LOGIN_PAGE.USERNAME_INPUT, credentials.username);
    await this.fillItem(LOGIN_PAGE.PASSWORD_INPUT, credentials.password);
  }

  async submit(): Promise<void> {
    await this.clickOnItem(LOGIN_PAGE.SUBMIT_BUTTON);
  }

  async login(credentials: Credentials): Promise<void> {
    await this.open();
    await this.fillCredentials(credentials);
    await this.submit();
  }

  async loginAs(credentials: Credentials): Promise<void> {
    await this.login(credentials);
    await this.verifyUrl(ROUTES.DASHBOARD);
  }
}
