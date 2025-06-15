# Udacity UI Automation

This repository demonstrates a UI automation framework built with **TypeScript** and the **Playwright Test Runner**. It is designed to validate workflows on the Udacity catalog website, ensuring robust and scalable browser automation. **Allure** reporting is integrated for rich, interactive test reports, supporting end-to-end execution and cross-browser validation.

---

## ✅ Features Automated

The following test scenarios are automated and validated:

1. Launch the browser and navigate to the Udacity catalog page.
2. Perform search operations and validate search results against API responses.
3. Apply skill and level filters and verify UI and API consistency.
4. Sort catalog items by rating and validate the order.
5. Comprehensive error and edge case handling for invalid search/filter inputs.

---

## 🔧 Prerequisites

Ensure the following are installed/configured on your system:

- Node.js (includes npm)
- TypeScript (`npm install typescript`)
- Playwright (`npm install playwright`)
- Allure Commandline (for generating and viewing test reports)
- A modern browser (Chromium, Firefox, or WebKit — handled by Playwright)

> **Frameworks & Tools Used:**
> - Playwright Test Runner
> - Allure (reporting)
> - TypeScript

---

## 📁 Project Structure

```bash
Udacity/
│   
├── pages/
│     ├── CatalogPage.ts
│     └── headerPage.ts
│
├── base/
│     └── pomFixture.ts
│
├── selectors/
│     ├── catalogPageSelectors.json
│     └── headerPageSelectors.json
│
├── testData/
│     ├── catalogData.json
│     └── pageTitle.json
│
├── tests/
│     └── search-input.spec.ts
│
├── utils/
│     └── apiClient.ts
│
├── allure-report/
├── allure-results/
├── playwright-report/
├── package.json
├── playwright.config.ts
├── .env
├── .github
│     └── playwright.yml
└── README.md
```

---

## 📌 Key Components

### 1. **Page Classes (`pages` folder)**
Encapsulate locators and methods for interacting with specific pages of the Udacity catalog:
- `CatalogPage.ts`: Handles catalog search, filtering, and sorting.
- `headerPage.ts`: Handles header navigation and actions.

### 2. **Selectors Files (`selectors` folder)**
Centralized JSON files that store selectors for identifying web elements. Used by Page Classes to interact with elements during test execution:
- `catalogPageSelectors.json`: Selectors for catalog page elements (search, filters, results, etc).
- `headerPageSelectors.json`: Selectors for header elements.

### 3. **Data Files (`testData` folder)**
Centralized JSON files that store test data for validating various functionalities:
- `catalogData.json`: Data for catalog search/filter validation.
- `pageTitle.json`: Expected page titles for navigation validation.

### 4. **Test Files (`tests` folder)**
Contains the actual test scripts that validate Udacity catalog functionalities using the Page Object Model (POM):
- `search-input.spec.ts`: Playwright test cases for search, filter, and sort validation, including API/UI consistency checks.

### 5. **Base Files (`base` folder)**
Foundational files that set up the test environment and provide shared functionality:
- `pomFixture.ts`: Extends Playwright's `test` object to include custom fixtures for POM, initializing and providing instances of page classes and the API client for all test scripts.

### 6. **API Client (`utils` folder)**
- `apiClient.ts`: Contains a reusable API client for making catalog search/filter requests, supporting UI/API validation.

### 7. **Configuration File**
- `playwright.config.ts`: Central configuration for Playwright (browser settings, base URL, timeouts, reporters, etc).

---

## ▶️ How to Run the Tests

### Step 1: **Install Dependencies**

```bash
npm install
```

### Step 2: **Run the Test Suite and Generate the Allure Report**

```bash
npm run allure:full
```

This command (defined in `package.json`) will:
- Run all Playwright test cases
- Generate the Allure report from test results
- Serve the Allure report for easy viewing

---

## 📊 Reporting and Logging

- **Allure Report**: Rich test report with step logs, screenshots, and test details.
- **Playwright HTML Report**: Default Playwright report for quick debugging.

---

## 📌 Summary

This Playwright-based automation project ensures reliable and scalable validation of key functionalities on the Udacity catalog website. It is designed with the following principles:

- **Modularity**: Organized structure with separate folders for pages, selectors, test data, and base files.
- **Reusability**: Implements the Page Object Model (POM) to encapsulate page-specific logic and interactions.
- **Maintainability**: Centralized configuration and selectors for easy updates and scalability.
- **Comprehensive Reporting**: Generates detailed Allure and Playwright reports for traceability.
- **Streamlined Workflow**: Simplifies test execution and reporting with custom scripts like `npm run allure:full`.
