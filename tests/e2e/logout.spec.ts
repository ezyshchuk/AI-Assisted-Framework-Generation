import { test, expect } from '@fixtures/index';

test.describe('Logout', () => {
  test('should log out and return to the login page', async ({
    authenticatedInventoryPage,
    loginPage,
  }) => {
    await authenticatedInventoryPage.header.openMenu();
    await authenticatedInventoryPage.sideMenu.logout();

    // After logout the URL should be back at the root / login screen
    await loginPage.assertUrl('/');
    // Confirm the login form is visible again
    expect(await loginPage.isErrorVisible()).toBe(false);
  });
});
