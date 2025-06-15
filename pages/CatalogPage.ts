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

    async skillFilter(input: string) {
        await step(`Skill Filter with value: ${input}`, async () => {
            // wait for the loading to be complete
            await this.page.locator(catalogSelectors.skill).isVisible(); // Ensure the network is idle before proceeding
            // Click on the skill filter button
            await this.page.locator(catalogSelectors.skill).click();
            await this.page.locator(catalogSelectors.skillSearch).click(); // Click on the skill search input to focus it
            await this.page.waitForLoadState('load') // Ensure the page is fully loaded before interacting with elements
            // Wait for the skill filter options to be visible
            await this.page.locator(catalogSelectors.skillSearch).type(input); // Fill the skill search input with the search term
            // Click the search button within the skill filter
            await this.page.keyboard.press('Enter');
            // Verify the skill filter is getting displayed
            await this.page.locator(catalogSelectors.skillFiltered).waitFor({ state: 'visible' }); // Wait for the skill filter to be visible
            // await this.page.waitForSelector(catalogSelectors.skillFiltered); // Wait for the skill filter to be visible
            await expect(this.page.locator(catalogSelectors.skillFiltered)).toContainText(input); // Verify the skill filter contains the input text
        
        });
    }

    async sortByRating(rating: string) {
        await step(`Sort by Rating: ${rating}`, async () => {
            await this.page.locator(catalogSelectors.sortBy).click(); // Click on the sort by dropdown
            // Select the rating option from the dropdown
            if(rating === 'Highly Rated') {
                await this.page.locator(catalogSelectors.hightlyRated).click(); // Click on the rating option
            }
            // Optionally, wait for results to update (e.g., wait for network idle or a loading spinner to disappear)
            await this.page.waitForLoadState('networkidle');
        });

    }

    async levelFilter() {
        await step('Level Filter', async () => {
            // Click on the level filter button
            await this.page.locator(catalogSelectors.level).click();
            // click on the intermediate level checkbox
            await this.page.locator(catalogSelectors.intermediateLevel).click (); 
            // Verify the level filter is getting displayed
             await this.page.evaluate(() => window.scrollTo(0, 0));
            // await this.page.locator(catalogSelectors.intermediateLevelFiltered).scrollIntoViewIfNeeded(); // Wait for the level filter to be visible
            await this.page.locator(catalogSelectors.intermediateLevelFiltered).waitFor({ state: 'visible' }); // Wait for the level filter to be visible
            await expect(this.page.locator(catalogSelectors.intermediateLevelFiltered)).toContainText(catalogData.intermediateLevel);
            
        });
    }

    async searchResults(searchInput: string, skillValue, levelValue, apiClient: ApiClient) {
        await step('Search Results', async () => {
            const searchResultsLocator = this.page.locator(catalogSelectors.ResultsCount);
            const noResultsText = this.page.locator(catalogSelectors.noResults);

            // Call the API client to get the API response
            const apiResponse = await apiClient.searchCatalog(searchInput, skillValue, levelValue);
            expect(apiResponse.status()).toBe(200);
            const responseData = await apiResponse.json();
            console.log("API Response Data: ", responseData);
            const apiResultsCount = responseData.searchResult?.hits?.length || 0;

            const flag = await noResultsText.isVisible()

            // console.log("Flag value: ", flag);
            console.log("API Results Count: ", apiResultsCount);
            console.log("Search Input: ", searchInput);

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
                const uiResultsCount = await searchResultsLocator.count();
                // Validate API and UI results count match
                const uniqueTitles = [
                    ...new Set(
                        responseData.searchResult.hits
                        .map((hit: any) => hit._highlightResult?.title?.value)
                        .filter((title: string | undefined) => title !== undefined)
                    )
                ];  
                console.log("Unique Titles from API: ", uniqueTitles);
                expect(apiResultsCount).toBe(uiResultsCount);
            }
        });
    }

    
}