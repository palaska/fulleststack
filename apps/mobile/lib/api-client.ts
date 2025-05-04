import type { Client } from "@fulleststack/api-client";

import createApiClient from "@fulleststack/api-client";

import { API_BASE_URL } from "../constants/config";

// Create an API client instance
export const apiClient: Client = createApiClient(API_BASE_URL);

// Export the client type for easier imports
export type { Client };
