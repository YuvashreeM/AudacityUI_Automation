import {test, expect} from "../base/pomFixture";
import pageTitle from "../testData/pageTitle.json"
import {step} from 'allure-js-commons';
import * as catalogData from "../testData/catalogData.json";

// const searchData:string = "NonExistentRandomTerm1234"


test.beforeEach(async ({ page, baseURL }) => {
    try{
        // Navigate to the Udacity Launch Page before each test
        await step("Navigate to Udacity Launch Page", async () => {
            await page.goto(`${baseURL}`); 
            // Wait for the page to load completely
            await page.waitForLoadState('domcontentloaded'); // Ensure the DOM is fully loaded
            // Verify the page title
            await expect(page).toHaveTitle(pageTitle.launchPageTitle);
        });
    }catch (error) {
        console.error("Error navigating to the page:", error);

    }
})

test ('@smoke Search with valid data',  async ({ page, headerPage, catalogPage, apiClient }) => {
    await headerPage.catalog(); // Navigate to the catalog page
    await catalogPage.search(catalogData.validSearchText); // Perform a search with invalid data
    await catalogPage.searchResults(catalogData.skillSearchInput,true, apiClient); // Verify the search results are displayed

})



test ('@smoke Search with invalid data',  async ({ page, headerPage, catalogPage, apiClient }) => {
    await headerPage.catalog(); // Navigate to the catalog page
    await catalogPage.search(catalogData.invalidSearchText); // Perform a search with invalid data
    await catalogPage.searchResults(catalogData.invalidSearchText,false, apiClient); // Verify the search results are displayed

})


    