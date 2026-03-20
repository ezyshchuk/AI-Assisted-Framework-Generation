import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '@components/Header';
import { logger } from '@utils/logger';

/** Page object for the individual product detail page (/inventory-item.html). */
export class InventoryItemPage extends BasePage {
  /** Shared header component (cart badge, burger menu). */
  readonly header: Header;

  private readonly itemName: Locator;
  private readonly itemDescription: Locator;
  private readonly itemPrice: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.itemName = page.locator('.inventory_details_name');
    this.itemDescription = page.locator('.inventory_details_desc');
    this.itemPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.backButton = page.getByRole('button', { name: 'Back to products' });
  }

  /** Assert we are on a product detail page. */
  async assertOnPage(): Promise<void> {
    await this.waitForUrl(/inventory-item/);
  }

  /** Product name shown in the detail view. */
  async getName(): Promise<string> {
    return (await this.itemName.textContent()) ?? '';
  }

  /** Price string as displayed (e.g. "$29.99"). */
  async getPrice(): Promise<string> {
    return (await this.itemPrice.textContent()) ?? '';
  }

  /** Full description text. */
  async getDescription(): Promise<string> {
    return (await this.itemDescription.textContent()) ?? '';
  }

  /** Add the item to the cart. */
  async addToCart(): Promise<void> {
    logger.info('Adding item to cart from detail page');
    await this.addToCartButton.click();
  }

  /** Remove the item from the cart. */
  async remove(): Promise<void> {
    logger.info('Removing item from cart on detail page');
    await this.removeButton.click();
  }

  /** Go back to the inventory list. */
  async goBack(): Promise<void> {
    logger.info('Navigating back to inventory');
    await this.backButton.click();
  }
}
