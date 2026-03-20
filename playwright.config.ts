import { defineConfig, devices } from '@playwright/test';
import { EnvHelper } from './src/utils/envHelper';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: EnvHelper.isCI,
  retries: EnvHelper.isCI ? 2 : 0,
  workers: EnvHelper.isCI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: EnvHelper.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: EnvHelper.headless,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'test-results',
});
