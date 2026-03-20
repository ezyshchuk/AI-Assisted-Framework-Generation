import { test, expect } from '@fixtures/index';

test.describe('Cart', () => {
  test('should update the cart badge count when an item is added', async ({
    authenticatedInventoryPage,
  }) => {
    expect(await authenticatedInventoryPage.header.isCartBadgeVisible()).toBe(false);

    await authenticatedInventoryPage.addItemToCartByIndex(0);
    expect(await authenticatedInventoryPage.header.getCartBadgeCount()).toBe(1);

    await authenticatedInventoryPage.addItemToCartByIndex(1);
    expect(await authenticatedInventoryPage.header.getCartBadgeCount()).toBe(2);
  });

  test('should reflect correct item count in the cart page', async ({
    authenticatedInventoryPage,
    cartPage,
  }) => {
    await authenticatedInventoryPage.addItemToCartByIndex(0);
    await authenticatedInventoryPage.addItemToCartByIndex(1);

    await authenticatedInventoryPage.header.clickCart();
    await cartPage.assertOnPage();

    expect(await cartPage.getItemCount()).toBe(2);
  });

  test('should remove an item directly from the cart', async ({
    authenticatedInventoryPage,
    cartPage,
  }) => {
    await authenticatedInventoryPage.addItemToCartByIndex(0);
    await authenticatedInventoryPage.header.clickCart();
    await cartPage.assertOnPage();

    expect(await cartPage.getItemCount()).toBe(1);

    await cartPage.removeItemByIndex(0);

    expect(await cartPage.getItemCount()).toBe(0);
    expect(await cartPage.header.isCartBadgeVisible()).toBe(false);
  });

  test('should allow adding an item to cart from its detail page', async ({
    authenticatedInventoryPage,
    inventoryItemPage,
  }) => {
    await authenticatedInventoryPage.openItemByIndex(0);
    await inventoryItemPage.assertOnPage();

    expect(await inventoryItemPage.header.isCartBadgeVisible()).toBe(false);

    await inventoryItemPage.addToCart();

    expect(await inventoryItemPage.header.getCartBadgeCount()).toBe(1);
  });
});
