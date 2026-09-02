import { defineConfig, devices } from '@playwright/test';

import { BASE_URL } from './tests/config/app.config';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  workers: 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 90_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: true,
  },
});
