import { test, expect } from '../base/pomFixture';
import { createRequire } from 'module';
import { description, step } from 'allure-js-commons';

const require = createRequire(import.meta.url);
const pageTitle = require('../testData/pageTitle.json');
const catalogData = require('../testData/catalogData.json');

test.beforeEach(async ({ page, baseURL }) => {
  try {
    // Navigate to the Udacity Launch Page before each test
    await step('Navigate to Udacity Launch Page', async () => {
      await page.goto(`${baseURL}`);
      // Wait for the page to load completely
      await page.waitForLoadState('domcontentloaded'); // Ensure the DOM is fully loaded
      // Verify the page title
      await expect(page).toHaveTitle(pageTitle.launchPageTitle);
    });
  } catch (error) {
    console.error('Error navigating to the page:', error);
  }
});

test('@smoke Catalog Search Functionality With Valid Data', async ({
  headerPage,
  catalogPage,
  apiClient,
}) => {
  description(`Search with valid data: ${catalogData.validSearchText}`); // Add a description for the test
  await headerPage.catalog(); // Navigate to the catalog page
  await catalogPage.search(catalogData.validSearchText); // Perform a search with valid data
  await catalogPage.sortByRating(catalogData.ratingFilter); // Sort by rating
  await catalogPage.skillFilter(catalogData.skillSearchInput); // Apply the skill filter
  await catalogPage.levelFilter(); // Apply the level filter
  await catalogPage.searchResults(
    catalogData.skillSearchInput,
    catalogData.skillValue,
    catalogData.levelFilter,
    apiClient,
    true // enforceOrder=true: STRICT order validation - will FAIL if order doesn't match
  );
});

test('@smoke Search with invalid data', async ({ headerPage, catalogPage, apiClient }) => {
  description(`Search with invalid data: ${catalogData.invalidSearchText}`);
  await headerPage.catalog(); // Navigate to the catalog page
  await catalogPage.search(catalogData.invalidSearchText); // Perform a search with invalid data
  await catalogPage.searchResults(
    catalogData.invalidSearchText,
    null,
    null,
    apiClient,
    false // enforceOrder=false: No order validation needed for invalid search
  );
});
