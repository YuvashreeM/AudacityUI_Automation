import {test as baseTest} from '@playwright/test';
import HeaderPage from "../pages/headerPage";
import CatalogPage from "../pages/CatalogPage";
import { ApiClient } from '../utils/apiClient';
// Importing the necessary page classes

type pages = {
    headerPage: HeaderPage;
    catalogPage: CatalogPage;  
    apiClient: ApiClient;  
}



// Creating a test fixture that extends the base test
const testPages = baseTest.extend<pages>({
    headerPage: async ({page}, use) => {
        await use(new HeaderPage(page));
    },
    catalogPage: async ({page}, use) => {
        await use(new CatalogPage(page));
    },
    apiClient: async ({request}, use) => {
        await use(new ApiClient(request));
    }
})


// Exporting the test fixture for use in test files
export const test = testPages;
export const expect = testPages.expect;