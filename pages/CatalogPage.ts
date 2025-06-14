import {Page, expect} from "@playwright/test";
// import { allure } from 'allure-playwright';
import { step } from 'allure-js-commons';
import * as catalogData from "../testData/catalogData.json";
import * as catalogSelectors from "../selectors/catalogPageSelectors.json";
import { ApiClient } from '../utils/apiClient';

export default class CatalogPage {

    constructor(public page: Page) {} // Constructor to initialize the page object
  

    async search(searchInput) {
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
        });
    }

    async skillFilter() {
        await step('Skill Filter', async () => {
            // Click on the skill filter button
            await this.page.locator(catalogSelectors.skill).click();
            // Wait for the skill filter options to be visible
            await this.page.locator(catalogSelectors.skillSearch).fill(catalogData.skillSearchInput); // Fill the skill search input with the search term
            // Click the search button within the skill filter
            await this.page.keyboard.press('Enter');
            // Verify the skill filter is getting displayed
            const skillFilteredLocator = this.page.locator(catalogSelectors.skillFiltered);
            await expect(skillFilteredLocator).toBeVisible();
            await expect(skillFilteredLocator).toContainText(catalogData.skillSearchInput);
        });
    }

    async levelFilter() {
        await step('Level Filter', async () => {
            // Click on the level filter button
            await this.page.locator(catalogSelectors.level).click();
            // click on the intermediate level checkbox
            await this.page.locator(catalogSelectors.intermediateLevel).click (); 
            // Verify the level filter is getting displayed
            const levelFilteredLocator = this.page.locator(catalogSelectors.intermediateLevelFiltered);
            await expect(levelFilteredLocator).toBeVisible();
            await expect(levelFilteredLocator).toContainText(catalogData.intermediateLevel);
            
        });
    }

    async searchResults(searchInput: string,valid:boolean, apiClient: ApiClient) {
        await step('Search Results', async () => {
            const searchResultsLocator = this.page.locator(catalogSelectors.searchResults);
            const noResultsText = this.page.locator(catalogSelectors.noResults);

            // Call the API client to get the API response
            const apiResponse = await apiClient.searchCatalog(searchInput);
            expect(apiResponse.status()).toBe(200);
            const responseData = await apiResponse.json();
            const apiResultsCount = responseData.searchResult?.hits?.length || 0;



            // const flag = await noResultsText.isVisible()

            // console.log("Flag value: ", flag);
            console.log("API Results Count: ", apiResultsCount);
            console.log("Search Input: ", searchInput);

            if (!valid) {
                // No results found in UI
                await expect(noResultsText).toBeVisible();
                await expect(noResultsText).toContainText(catalogData.noResultsText);
                // Validate API also returns no results
                await step('Validate API results count', async () => {
                expect(apiResultsCount).toBe(0);
                });
                
            } else {
                // Results found in UI
                await expect(searchResultsLocator).toBeVisible();
                const uiResultsCount = await searchResultsLocator.count();
                // Validate API and UI results count match
                expect(apiResultsCount).toBe(uiResultsCount);
            }
        });
    }

    
}