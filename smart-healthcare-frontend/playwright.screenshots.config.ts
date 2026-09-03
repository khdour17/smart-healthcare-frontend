import { defineConfig, devices } from '@playwright/test';

import { BASE_URL } from './tests/config/app.config';

export default defineConfig({
  testDir: './tests/screenshots',
  workers: 1,
  reporter: [['list']],
  timeout: 15 * 60_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: BASE_URL,
    screenshot: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
      },
    },
  ],
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: true,
  },
});
