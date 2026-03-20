import { Page, Locator } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * Slide-out navigation menu accessible from the Header burger icon.
 * Call `header.openMenu()` before interacting with this component.
 */
export class SideMenu {
  private readonly closeButton: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly resetLink: Locator;
  private readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  /** Close the side menu without navigating. */
  async close(): Promise<void> {
    logger.debug('Closing side menu');
    await this.closeButton.click();
  }

  /** Navigate to the All Items (inventory) page. */
  async goToAllItems(): Promise<void> {
    logger.info('Navigating to All Items via side menu');
    await this.allItemsLink.click();
  }

  /** Reset app state (clears cart, resets sort order). */
  async resetAppState(): Promise<void> {
    logger.info('Resetting app state via side menu');
    await this.resetLink.click();
  }

  /** Log out — navigates back to the login page. */
  async logout(): Promise<void> {
    logger.info('Logging out via side menu');
    await this.logoutLink.click();
  }
}
