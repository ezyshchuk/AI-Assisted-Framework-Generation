import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';

/** Page object for the order summary page (/checkout-step-two.html). */
export class CheckoutOverviewPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  /** Assert that the checkout overview page is loaded. */
  async assertOnPage(): Promise<void> {
    await this.waitForUrl(/checkout-step-two/);
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  /** Number of line items shown in the order summary. */
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /** Item subtotal string as displayed (e.g. "Item total: $29.99"). */
  async getSubtotal(): Promise<string> {
    return (await this.subtotalLabel.textContent()) ?? '';
  }

  /** Tax string as displayed (e.g. "Tax: $2.40"). */
  async getTax(): Promise<string> {
    return (await this.taxLabel.textContent()) ?? '';
  }

  /** Grand total string as displayed (e.g. "Total: $32.39"). */
  async getTotal(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  /** Complete the purchase. */
  async finish(): Promise<void> {
    logger.info('Finishing order');
    await this.finishButton.click();
  }

  /** Cancel — returns to the inventory page. */
  async cancel(): Promise<void> {
    logger.info('Cancelling order on overview');
    await this.cancelButton.click();
  }
}
