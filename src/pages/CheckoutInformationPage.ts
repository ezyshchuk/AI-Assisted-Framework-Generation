import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';

/** Page object for the checkout customer-information form (/checkout-step-one.html). */
export class CheckoutInformationPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorContainer = page.locator('[data-test="error"]');
  }

  /** Assert that the checkout information page is loaded. */
  async assertOnPage(): Promise<void> {
    await this.waitForUrl(/checkout-step-one/);
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  /**
   * Fill all three shipping fields.
   * Pass an empty string to leave a field blank (triggers validation error).
   */
  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    logger.info('Filling checkout shipping information');
    if (firstName !== '') await this.safeFill(this.firstNameInput, firstName, 'first name');
    if (lastName !== '') await this.safeFill(this.lastNameInput, lastName, 'last name');
    if (postalCode !== '') await this.safeFill(this.postalCodeInput, postalCode, 'postal code');
  }

  /** Submit the form by clicking Continue. */
  async clickContinue(): Promise<void> {
    logger.info('Submitting checkout information form');
    await this.continueButton.click();
  }

  /** Cancel — returns to the cart page. */
  async clickCancel(): Promise<void> {
    logger.info('Cancelling checkout information');
    await this.cancelButton.click();
  }

  /** Returns the validation error text. */
  async getErrorMessage(): Promise<string> {
    return (await this.errorContainer.textContent()) ?? '';
  }

  /** Assert that a validation error banner is visible and contains the expected text. */
  async assertErrorContains(text: string): Promise<void> {
    await expect(this.errorContainer).toBeVisible();
    await expect(this.errorContainer).toContainText(text);
  }
}
