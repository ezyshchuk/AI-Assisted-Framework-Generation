import { Page, Locator, expect } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * Abstract base for all page objects.
 * Provides safe interaction wrappers, navigation helpers, and common assertions.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Clicks a locator after asserting it is visible.
   * Prefer this over raw `.click()` to surface meaningful failures.
   */
  protected async safeClick(locator: Locator, description = 'element'): Promise<void> {
    logger.debug(`Clicking: ${description}`);
    await expect(locator).toBeVisible();
    await locator.click();
  }

  /**
   * Fills an input after asserting it is visible and clears it first.
   */
  protected async safeFill(locator: Locator, value: string, description = 'input'): Promise<void> {
    logger.debug(`Filling "${description}"`);
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }

  /** Navigate to a path relative to baseURL. */
  async navigate(path = '/'): Promise<void> {
    logger.info(`Navigating to: ${path}`);
    await this.page.goto(path);
  }

  /** Wait until the current URL matches the given string or pattern. */
  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  /** Assert the current URL. */
  async assertUrl(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expected);
  }

  /** Assert the page <title>. */
  async assertTitle(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
  }
}
