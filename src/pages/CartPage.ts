import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '@components/Header';
import { logger } from '@utils/logger';

/** Page object for the shopping cart page (/cart.html). */
export class CartPage extends BasePage {
  /** Shared header component (cart badge, burger menu). */
  readonly header: Header;

  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /** Assert that the cart page is loaded and shows the "Your Cart" heading. */
  async assertOnPage(): Promise<void> {
    await this.waitForUrl(/cart/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  /** Number of distinct line items in the cart. */
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /** Ordered list of product names currently in the cart. */
  async getItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  /** Remove the cart line item at the given zero-based index. */
  async removeItemByIndex(index: number): Promise<void> {
    logger.info(`Removing cart item[${index}]`);
    await this.cartItems.nth(index).getByRole('button', { name: 'Remove' }).click();
  }

  /** Proceed to checkout. */
  async checkout(): Promise<void> {
    logger.info('Proceeding to checkout');
    await this.checkoutButton.click();
  }

  /** Return to the inventory page without checking out. */
  async continueShopping(): Promise<void> {
    logger.info('Continuing shopping');
    await this.continueShoppingButton.click();
  }
}
