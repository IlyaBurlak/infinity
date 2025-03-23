import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './tests/test-results',
  timeout: 60000,
  expect: { timeout: 10000 },

  reporter: [
    ['html', {
      outputFolder: './tests/playwright-report',
      open: 'never'
    }],
    ['line']
  ],

  use: {
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});