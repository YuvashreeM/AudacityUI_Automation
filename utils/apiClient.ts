import { APIRequestContext } from '@playwright/test';

const CATALOG_API_URL = process.env.UDACITY_CATALOG_API_URL || "https://api.udacity.com/api";

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
            `${CATALOG_API_URL}/unified-catalog/search`,
            {
            data: requestBody,
            headers: { 'Content-Type': 'application/json' }
            }
        );
        return response;
    }
}
