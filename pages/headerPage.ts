import { Page } from '@playwright/test';
import { createRequire } from 'module';
// import { allure } from 'allure-playwright';
import { step } from 'allure-js-commons';

const require = createRequire(import.meta.url);
const headerSelectors = require('../selectors/headerPageSelectors.json');

export default class HeaderPage {
  constructor(public page: Page) {} // Constructor to initialize the page object

  async catalog() {
    await step('Click on Catalog link', async () => {
      await this.page.locator(headerSelectors.Catalog).isVisible(); // Ensure the catalog button is visible before clicking
      await this.page.locator(headerSelectors.Catalog).click(); // Click on the catalog button
      //wait for the catalog page to load
      await this.page.waitForLoadState('domcontentloaded'); // Wait for the network to be idle
      // Verify the URL to ensure we are on the catalog page
      const url = this.page.url();
      if (!url.includes('/catalog')) {
        throw new Error(`Expected URL to include '/catalog', but got ${url}`);
      } else {
        console.log('Catalog page loaded successfully');
      }
    });
  }
}
