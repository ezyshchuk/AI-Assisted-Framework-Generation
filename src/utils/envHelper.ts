/**
 * Centralized environment variable accessor.
 *
 * ALL code that needs environment configuration must use this helper.
 * Direct `process.env.*` access outside this module is prohibited.
 */

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(
      `[EnvHelper] Required environment variable "${key}" is not set and has no default.`,
    );
  }
  return value;
}

function getBoolEnv(key: string, defaultValue: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined) return defaultValue;
  return raw.toLowerCase() === 'true' || raw === '1';
}

export const EnvHelper = {
  /** Base URL for the application under test. Default: https://www.saucedemo.com */
  get baseUrl(): string {
    return getEnv('BASE_URL', 'https://www.saucedemo.com');
  },

  /** SauceDemo test username. Default: standard_user */
  get username(): string {
    return getEnv('SAUCE_USERNAME', 'standard_user');
  },

  /** SauceDemo test password. Default: secret_sauce */
  get password(): string {
    return getEnv('SAUCE_PASSWORD', 'secret_sauce');
  },

  /** Run browser in headless mode. Default: true */
  get headless(): boolean {
    return getBoolEnv('HEADLESS', true);
  },

  /** Whether the framework is running in a CI environment. Default: false */
  get isCI(): boolean {
    return getBoolEnv('CI', false);
  },
} as const;
