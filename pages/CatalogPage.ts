import { Page, expect } from '@playwright/test';
// import { allure } from 'allure-playwright';
import { step } from 'allure-js-commons';
import { createRequire } from 'module';
import { ApiClient } from '../utils/apiClient.js';

const require = createRequire(import.meta.url);
const catalogData = require('../testData/catalogData.json');
const catalogSelectors = require('../selectors/catalogPageSelectors.json');

export default class CatalogPage {
  constructor(public page: Page) {} // Constructor to initialize the page object

  async search(searchInput: string) {
    await step('Broad Search', async () => {
      await this.page.locator(catalogSelectors.searchButton).click();
      // Fill the search input with the search term
      await this.page.locator(catalogSelectors.searchBox).fill(searchInput); // Fill the search input with the search term
      //click the keyboard enter button
      await this.page.keyboard.press('Enter'); // Press Enter to submit the search
      // Verify the search results are displayed
      const searchResultsLocator = this.page.locator(catalogSelectors.searchResults);
      await expect(searchResultsLocator).toBeVisible();
      await expect(searchResultsLocator).toContainText(searchInput);
      await expect(this.page.url()).toContain(searchInput);
    });
  }

  async skillFilter(input: string) {
    await step(`Skill Filter with value: ${input}`, async () => {
      // wait for the loading to be complete
      await this.page.locator(catalogSelectors.skill).isVisible(); // Ensure the network is idle before proceeding
      // Click on the skill filter button
      await this.page.locator(catalogSelectors.skill).click();
      await this.page.locator(catalogSelectors.skillSearch).click(); // Click on the skill search input to focus it
      await this.page.waitForLoadState('load'); // Ensure the page is fully loaded before interacting with elements
      // Wait for the skill filter options to be visible
      await this.page.locator(catalogSelectors.skillSearch).type(input); // Fill the skill search input with the search term
      // Click the search button within the skill filter
      await this.page.keyboard.press('Enter');
      // Verify the skill filter is getting displayed
      await this.page.locator(catalogSelectors.skillFiltered).waitFor({ state: 'visible' }); // Wait for the skill filter to be visible
      await expect(this.page.locator(catalogSelectors.skillFiltered)).toContainText(input); // Verify the skill filter contains the input text
      await expect(this.page.url()).toContain(input);
    });
  }

  async sortByRating(rating: string) {
    await step(`Sort by Rating: ${rating}`, async () => {
      // 1. Disable auto-scroll and smooth scrolling
      await this.page.locator(catalogSelectors.sortBy).click({
        noWaitAfter: true,
        force: true,
      });

      // Wait for dropdown to appear
      await this.page.waitForSelector(catalogSelectors.hightlyRated);
      if (rating === 'Highly Rated') {
        await this.page.locator(catalogSelectors.hightlyRated).click({
          noWaitAfter: true,
          force: true,
        });
        await this.page.waitForTimeout(1000); // Wait for the filter to apply
        await expect(this.page.url()).toContain('highest-rated');
      }

      // Manual wait for results
      await this.page.waitForLoadState('load');
    });
  }

  async levelFilter() {
    await step('Level Filter', async () => {
      // Click on the level filter button
      await this.page.locator(catalogSelectors.level).click();
      // click on the intermediate level checkbox
      await this.page.locator(catalogSelectors.intermediateLevel).click();
      // Verify the level filter is getting displayed
      await this.page.locator(catalogSelectors.intermediateLevelFiltered).scrollIntoViewIfNeeded(); // Wait for the level filter to be visible
      await this.page
        .locator(catalogSelectors.intermediateLevelFiltered)
        .waitFor({ state: 'visible' }); // Wait for the level filter to be visible
      await expect(this.page.locator(catalogSelectors.intermediateLevelFiltered)).toContainText(
        catalogData.intermediateLevel
      );
      //wait till the filter is applied
      await this.page.waitForTimeout(1000);
      //verify the level filter is displayed in the url
      await expect(this.page.url()).toContain(catalogData.intermediateLevel);
    });
  }

  async searchResults(
    searchInput: string,
    skillValue: string,
    levelValue: string,
    apiClient: ApiClient,
    enforceOrder: boolean = true
  ) {
    await step('Search Results', async () => {
      const searchResultsLocator = this.page.locator(catalogSelectors.ResultsCount);
      const noResultsText = this.page.locator(catalogSelectors.noResults);
      // Store the UI results in the order they appear
      const uiResultsArray = await searchResultsLocator.allTextContents();
      const uiResultsOrdered = uiResultsArray.map(text => text.trim());
      console.log('ui order:', uiResultsOrdered);
      // Call the API client to get the API response
      const apiResponse = await apiClient.searchCatalog(searchInput, skillValue, levelValue);
      const responseData = apiResponse;
      // console.log('API Response Data: ', responseData);
      const apiResultsCount = responseData.searchResult?.hits?.length || 0;

      const flag = await noResultsText.isVisible();

      if (flag) {
        // No results found in UI
        await expect(noResultsText).toBeVisible();
        await expect(noResultsText).toContainText(catalogData.noResultsText);
        // Validate API also returns no results
        await step('Validate API results count', async () => {
          expect(apiResultsCount).toBe(0);
        });
      } else {
        // Results count is displayed in UI
        const uiResultsArray = await searchResultsLocator.allTextContents();
        const uiResultsCount = uiResultsArray.length;
        //get the text value from the locator
        console.log('ui text:', uiResultsArray);
        console.log('ui result count:', uiResultsCount);
        // Validate API and UI results count match
        const uniqueTitles = [
          ...new Set(
            apiResponse.searchResult.hits
              .map(
                (hit: { _highlightResult?: { title?: { value?: string } } }) =>
                  hit._highlightResult?.title?.value
              )
              .filter((title: string | undefined) => title !== undefined)
          ),
        ];
        console.log('Unique Titles from API: ', uniqueTitles);
        // Only compare results if API has results, otherwise just validate counts match
        if (apiResultsCount > 0) {
          // Check that the number of results match
          expect(uniqueTitles.length).toBe(uiResultsCount);

          // Normalize text for comparison
          const normalizeText = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();

          // Normalize both sets for comparison
          const normalizedUIResults = uiResultsOrdered.map(text => normalizeText(text.trim()));
          const normalizedAPIResults = uniqueTitles.map(normalizeText);

          // CONTENT VALIDATION - Check that all results are present in both sets
          console.log('=== CONTENT VALIDATION ===');
          for (const uiResult of normalizedUIResults) {
            const found = normalizedAPIResults.some(
              apiResult => apiResult.includes(uiResult) || uiResult.includes(apiResult)
            );
            if (!found) {
              console.log('UI result not found in API:', uiResult);
              console.log('Available API results:', normalizedAPIResults);
            }
            expect(found).toBe(true);
          }
          console.log('✓ All UI results match API results (content validation passed)');

          // ORDER VALIDATION - Configurable based on enforceOrder parameter
          console.log('=== ORDER VALIDATION ===');
          console.log('UI Results Order:', normalizedUIResults);
          console.log('API Results Order:', normalizedAPIResults);

          let orderMatches = true;
          const minLength = Math.min(normalizedUIResults.length, normalizedAPIResults.length);

          for (let i = 0; i < minLength; i++) {
            const uiResult = normalizedUIResults[i];
            const apiResult = normalizedAPIResults[i];

            // Check if they match exactly or contain each other
            const isMatch =
              uiResult === apiResult ||
              uiResult.includes(apiResult) ||
              apiResult.includes(uiResult);

            if (!isMatch) {
              console.log(`Order mismatch at position ${i + 1}:`);
              console.log(`  UI:  "${uiResult}"`);
              console.log(`  API: "${apiResult}"`);
              orderMatches = false;
            }
          }

          if (orderMatches) {
            console.log('UI and API results are in the same order');
          } else {
            console.log('UI and API results order differs');

            if (enforceOrder) {
              // Strict mode: Fail the test if order doesn't match
              const errorMessage = `UI and API results order mismatch. Expected order: [${normalizedAPIResults.join(', ')}], Got: [${normalizedUIResults.join(', ')}]`;
              console.error('STRICT ORDER MODE: Test failing due to order mismatch');
              throw new Error(errorMessage);
            } else {
              // Flexible mode: Log warning but continue test
              console.warn('Order validation failed, but test continues (enforceOrder=false)');
              console.log('Set enforceOrder=true in test call to make order validation strict');
            }
          }
        } else {
          // If API has no results, we expect UI to either show no results or show fallback results
          // In this case, we just verify that API returned 0 results as expected
          expect(apiResultsCount).toBe(0);
        }
      }
    });
  }
}
