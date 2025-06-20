import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        viewport: null, // disables Playwright's viewport control
        userAgent:
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/117.0.0.0 Safari/537.36',
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],

  testMatch: ['search-input.spec.ts'], // Specify the test file to run
  use: {
    baseURL: 'https://www.udacity.com/',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 120000,
  retries: process.env.CI ? 2 : 1,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'jsonReporter/jsonReports.json' }],
    ['dot'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
      },
    ],
    ['list'],
  ],
  fullyParallel: false,
  grep: /@smoke/, // Run only tests tagged with @smoke
});
