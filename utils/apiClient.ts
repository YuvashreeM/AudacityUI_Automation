import { APIRequestContext } from '@playwright/test';

export class ApiClient {
    constructor(private request: APIRequestContext) {}

    async searchCatalog(query: string, skill: string, level: string): Promise<any> {
        const requestBody = {
            searchText: query,
            sortBy: "avgRating" ,
            page: 0,
            pageSize: 24,
            keys: [],
            skills: [skill],
            schools: [],
            rawDurations: [],
            difficulties: [level],
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
