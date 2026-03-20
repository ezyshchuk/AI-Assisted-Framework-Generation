import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { InventoryItemPage } from '@pages/InventoryItemPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutInformationPage } from '@pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '@pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';
import { EnvHelper } from '@utils/envHelper';

/** Shape of the custom page-object fixtures. */
interface PageFixtures {
  /** Unauthenticated login page. */
  loginPage: LoginPage;
  /** Inventory list page (use after login). */
  inventoryPage: InventoryPage;
  /** Product detail page. */
  inventoryItemPage: InventoryItemPage;
  /** Shopping cart page. */
  cartPage: CartPage;
  /** Checkout — customer information step. */
  checkoutInformationPage: CheckoutInformationPage;
  /** Checkout — order overview step. */
  checkoutOverviewPage: CheckoutOverviewPage;
  /** Checkout — order complete page. */
  checkoutCompletePage: CheckoutCompletePage;
  /**
   * Pre-authenticated inventory page.
   * Logs in with the configured credentials before handing the page to the test,
   * so specs requiring an authenticated session contain zero setup boilerplate.
   */
  authenticatedInventoryPage: InventoryPage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  inventoryItemPage: async ({ page }, use) => {
    await use(new InventoryItemPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutInformationPage: async ({ page }, use) => {
    await use(new CheckoutInformationPage(page));
  },

  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  authenticatedInventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(EnvHelper.username, EnvHelper.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.assertOnPage();

    await use(inventoryPage);
  },
});

// Re-export expect so tests only import from this module.
export { expect } from '@playwright/test';
