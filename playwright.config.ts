import { defineConfig, devices } from '@playwright/test';
import { dot } from 'node:test/reporters';

export default defineConfig({

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        viewport: null, // disables Playwright's viewport control
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    }
  ],

  testMatch: ['search-input.spec.ts'], // Specify the test file to run
  use: {
    baseURL: 'https://www.udacity.com/',
    headless: process.env.CI? true:false,
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  timeout: 120000,
  retries: process.env.CI? 2:1,
  reporter: [
    ['html', { open: 'never' }], 
    ['json', { outputFile: 'jsonReporter/jsonReports.json' }],
    ['dot'],
    ['allure-playwright', {
      outputFolder: 'allure-results', 
    }],
    ['list'],
  ],
  fullyParallel: false,
  grep: /@smoke/ // Run only tests tagged with @smoke
});


