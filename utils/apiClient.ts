import { APIRequestContext } from '@playwright/test';

export class ApiClient {
    constructor(private request: APIRequestContext) {}

    async searchCatalog(query: string) {
        const requestBody = {
            searchText: query,
            sortBy: "relevance",
            page: 0,
            pageSize: 24,
            keys: [],
            skills: [],
            schools: [],
            rawDurations: [],
            semanticTypes: [],
            enrolledOnly: false
        };
        const response = await this.request.post(
            "https://api.udacity.com/api/unified-catalog/search",
            {
                data: requestBody,
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return response;
    }
}
