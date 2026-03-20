import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from '@components/Header';
import { SideMenu } from '@components/SideMenu';
import { logger } from '@utils/logger';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/** Page object for the products listing page (/inventory.html). */
export class InventoryPage extends BasePage {
  /** Shared header component (cart badge, burger menu). */
  readonly header: Header;
  /** Side navigation menu — open with header.openMenu() first. */
  readonly sideMenu: SideMenu;

  private readonly pageTitle: Locator;
  private readonly inventoryList: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.sideMenu = new SideMenu(page);
    this.pageTitle = page.locator('.title');
    this.inventoryList = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  /** Assert that the inventory page is loaded and shows the "Products" heading. */
  async assertOnPage(): Promise<void> {
    await this.waitForUrl(/inventory/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  /** Total number of inventory items visible on the page. */
  async getItemCount(): Promise<number> {
    return this.inventoryList.count();
  }

  /** Returns an ordered array of all visible product names. */
  async getItemNames(): Promise<string[]> {
    return this.inventoryList.locator('.inventory_item_name').allTextContents();
  }

  /** Returns an ordered array of all visible prices as numbers (no $ sign). */
  async getItemPrices(): Promise<number[]> {
    const texts = await this.inventoryList
      .locator('.inventory_item_price')
      .allTextContents();
    return texts.map((p) => parseFloat(p.replace('$', '')));
  }

  /** Change the sort order via the dropdown. */
  async sortBy(option: SortOption): Promise<void> {
    logger.info(`Sorting by: ${option}`);
    await this.sortDropdown.selectOption(option);
  }

  /** Click "Add to cart" on the item at the given zero-based index. */
  async addItemToCartByIndex(index: number): Promise<void> {
    logger.info(`Adding item[${index}] to cart`);
    await this.inventoryList
      .nth(index)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  /** Click "Remove" on the item at the given zero-based index. */
  async removeItemFromCartByIndex(index: number): Promise<void> {
    logger.info(`Removing item[${index}] from cart`);
    await this.inventoryList
      .nth(index)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  /** Click the item name/title link at the given zero-based index to open its detail page. */
  async openItemByIndex(index: number): Promise<void> {
    logger.info(`Opening item[${index}] detail page`);
    await this.inventoryList.nth(index).locator('.inventory_item_name').click();
  }

  /** Returns the name of the item at the given zero-based index. */
  async getItemNameByIndex(index: number): Promise<string> {
    return (
      (await this.inventoryList
        .nth(index)
        .locator('.inventory_item_name')
        .textContent()) ?? ''
    );
  }

  /** Returns the price text (e.g. "$29.99") of the item at the given index. */
  async getItemPriceByIndex(index: number): Promise<string> {
    return (
      (await this.inventoryList
        .nth(index)
        .locator('.inventory_item_price')
        .textContent()) ?? ''
    );
  }
}
