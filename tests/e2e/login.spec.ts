import { test, expect } from '@fixtures/index';
import { EnvHelper } from '@utils/envHelper';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should log in successfully with valid credentials', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(EnvHelper.username, EnvHelper.password);
    await inventoryPage.assertOnPage();
  });

  test('should show an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.assertErrorContains('Username and password do not match');
  });

  test('should show an error when username is empty', async ({ loginPage }) => {
    await loginPage.login('', EnvHelper.password);
    await loginPage.assertErrorContains('Username is required');
  });

  test('should show an error when password is empty', async ({ loginPage }) => {
    await loginPage.login(EnvHelper.username, '');
    await loginPage.assertErrorContains('Password is required');
  });
});
