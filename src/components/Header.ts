import { Page, Locator } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * Shared top-bar component present on all authenticated pages.
 * Exposes cart badge count and the hamburger menu trigger.
 */
export class Header {
  private readonly menuButton: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  /** Click the shopping-cart icon to navigate to /cart.html. */
  async clickCart(): Promise<void> {
    logger.debug('Clicking cart icon');
    await this.cartLink.click();
  }

  /** Returns the number shown in the cart badge, or 0 when badge is absent. */
  async getCartBadgeCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  /** Returns true when the cart badge is displayed (i.e. cart is not empty). */
  async isCartBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isVisible();
  }

  /** Open the side navigation menu. */
  async openMenu(): Promise<void> {
    logger.debug('Opening side menu');
    await this.menuButton.click();
  }
}
