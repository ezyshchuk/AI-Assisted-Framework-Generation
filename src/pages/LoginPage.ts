import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';

/** Page object for the Sauce Demo login screen (/). */
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorContainer = page.locator('[data-test="error"]');
  }

  /** Navigate to the login page. */
  async goto(): Promise<void> {
    await this.navigate('/');
  }

  /**
   * Fill credentials and submit the login form.
   * Does NOT assert success — callers decide what comes next.
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in as "${username}"`);
    await this.safeFill(this.usernameInput, username, 'username');
    await this.safeFill(this.passwordInput, password, 'password');
    await this.safeClick(this.loginButton, 'login-button');
  }

  /** Returns the text content of the error banner. */
  async getErrorMessage(): Promise<string> {
    return (await this.errorContainer.textContent()) ?? '';
  }

  /** Asserts that the error banner is visible and contains the given text. */
  async assertErrorContains(text: string): Promise<void> {
    await expect(this.errorContainer).toBeVisible();
    await expect(this.errorContainer).toContainText(text);
  }

  /** Returns whether the error banner is currently visible. */
  async isErrorVisible(): Promise<boolean> {
    return this.errorContainer.isVisible();
  }
}
