import { test, expect } from '@fixtures/index';

test.describe('Inventory page', () => {
  test('should display all 6 products', async ({ authenticatedInventoryPage }) => {
    const count = await authenticatedInventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('should sort products by name A → Z', async ({ authenticatedInventoryPage }) => {
    await authenticatedInventoryPage.sortBy('az');
    const names = await authenticatedInventoryPage.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('should sort products by name Z → A', async ({ authenticatedInventoryPage }) => {
    await authenticatedInventoryPage.sortBy('za');
    const names = await authenticatedInventoryPage.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('should sort products by price low → high', async ({ authenticatedInventoryPage }) => {
    await authenticatedInventoryPage.sortBy('lohi');
    const prices = await authenticatedInventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('should sort products by price high → low', async ({ authenticatedInventoryPage }) => {
    await authenticatedInventoryPage.sortBy('hilo');
    const prices = await authenticatedInventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('should navigate to product detail page and verify title and price', async ({
    authenticatedInventoryPage,
    inventoryItemPage,
  }) => {
    const expectedName = await authenticatedInventoryPage.getItemNameByIndex(0);
    const expectedPrice = await authenticatedInventoryPage.getItemPriceByIndex(0);

    await authenticatedInventoryPage.openItemByIndex(0);
    await inventoryItemPage.assertOnPage();

    expect(await inventoryItemPage.getName()).toBe(expectedName);
    expect(await inventoryItemPage.getPrice()).toBe(expectedPrice);
  });
});
