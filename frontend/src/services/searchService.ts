import { API_CONFIG, API_ENDPOINTS } from "../config/api";
import type { Listing } from "../types/Listing";

interface SearchFilters {
  keyword?: string;
  category_id?: number;
  province?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
  sort_by?: "relevance" | "price_asc" | "price_desc" | "newest";
}

interface SearchResponse {
  success: boolean;
  data: Listing[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class SearchService {
  async search(filters: SearchFilters): Promise<SearchResponse> {
    // Build query string
    const params = new URLSearchParams();

    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.category_id) params.append("category_id", String(filters.category_id));
    if (filters.province) params.append("province", filters.province);
    if (filters.city) params.append("city", filters.city);
    if (filters.min_price) params.append("min_price", String(filters.min_price));
    if (filters.max_price) params.append("max_price", String(filters.max_price));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.offset) params.append("offset", String(filters.offset));
    if (filters.sort_by) params.append("sort_by", filters.sort_by);

    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SEARCH}?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Search failed.");
    }

    return data;
  }
}

export const searchService = new SearchService();