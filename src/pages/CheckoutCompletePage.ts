import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';

/** Page object for the order-confirmation page (/checkout-complete.html). */
export class CheckoutCompletePage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /** Assert the order-complete page is loaded and shows the correct heading. */
  async assertOnPage(): Promise<void> {
    await this.waitForUrl(/checkout-complete/);
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
  }

  /** Assert the success banner reads the expected thank-you message. */
  async assertOrderComplete(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  /** Returns the descriptive text body shown below the header. */
  async getCompleteText(): Promise<string> {
    return (await this.completeText.textContent()) ?? '';
  }

  /** Navigate back to the products page. */
  async backToHome(): Promise<void> {
    logger.info('Returning to products from order confirmation');
    await this.backHomeButton.click();
  }
}
