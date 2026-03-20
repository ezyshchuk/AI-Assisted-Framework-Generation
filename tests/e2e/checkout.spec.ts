import { test, expect } from '@fixtures/index';

/** Helper: add the first item to cart, open cart, and click Checkout. */
async function reachCheckoutInfo(
  inventoryPage: import('@pages/InventoryPage').InventoryPage,
  cartPage: import('@pages/CartPage').CartPage,
): Promise<void> {
  await inventoryPage.addItemToCartByIndex(0);
  await inventoryPage.header.clickCart();
  await cartPage.assertOnPage();
  await cartPage.checkout();
}

test.describe('Checkout', () => {
  test('should show a validation error when First Name is missing', async ({
    authenticatedInventoryPage,
    cartPage,
    checkoutInformationPage,
  }) => {
    await reachCheckoutInfo(authenticatedInventoryPage, cartPage);
    await checkoutInformationPage.assertOnPage();

    // Submit without filling any field
    await checkoutInformationPage.clickContinue();
    await checkoutInformationPage.assertErrorContains('First Name is required');
  });

  test('should show a validation error when Last Name is missing', async ({
    authenticatedInventoryPage,
    cartPage,
    checkoutInformationPage,
  }) => {
    await reachCheckoutInfo(authenticatedInventoryPage, cartPage);
    await checkoutInformationPage.assertOnPage();

    await checkoutInformationPage.fillInformation('Jane', '', '');
    await checkoutInformationPage.clickContinue();
    await checkoutInformationPage.assertErrorContains('Last Name is required');
  });

  test('should show a validation error when Postal Code is missing', async ({
    authenticatedInventoryPage,
    cartPage,
    checkoutInformationPage,
  }) => {
    await reachCheckoutInfo(authenticatedInventoryPage, cartPage);
    await checkoutInformationPage.assertOnPage();

    await checkoutInformationPage.fillInformation('Jane', 'Doe', '');
    await checkoutInformationPage.clickContinue();
    await checkoutInformationPage.assertErrorContains('Postal Code is required');
  });

  test('should complete the full checkout happy path', async ({
    authenticatedInventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    // Step 1 — add item & open cart
    await authenticatedInventoryPage.addItemToCartByIndex(0);
    await authenticatedInventoryPage.header.clickCart();
    await cartPage.assertOnPage();
    expect(await cartPage.getItemCount()).toBe(1);

    // Step 2 — checkout form
    await cartPage.checkout();
    await checkoutInformationPage.assertOnPage();
    await checkoutInformationPage.fillInformation('Jane', 'Doe', '12345');
    await checkoutInformationPage.clickContinue();

    // Step 3 — overview
    await checkoutOverviewPage.assertOnPage();
    expect(await checkoutOverviewPage.getItemCount()).toBe(1);

    // Step 4 — confirm
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.assertOnPage();
    await checkoutCompletePage.assertOrderComplete();
  });
});
