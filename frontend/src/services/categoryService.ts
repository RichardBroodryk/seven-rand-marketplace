import { API_CONFIG, API_ENDPOINTS } from "../config/api";
import type { Listing } from "../types/Listing";

interface Category {
    id: number;
    name: string;
    slug: string;
    seller_fee: number;
    buyer_contact_fee: number;
    is_premium: boolean;
}

interface CategoryListingsResponse {
    success: boolean;
    category: {
        id: number;
        name: string;
        slug: string;
        is_premium: boolean;
    };
    data: Listing[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

class CategoryService {
    async getAllCategories(): Promise<Category[]> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CATEGORIES}`
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch categories.");
        }

        return data.data;
    }

    async getCategoryBySlug(slug: string): Promise<Category> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CATEGORIES}/slug/${slug}`
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Category not found.");
        }

        return data.data;
    }

    async getListingsByCategory(
        slug: string,
        filters: {
            limit?: number;
            offset?: number;
            sort_by?: "newest" | "price_asc" | "price_desc";
            min_price?: number;
            max_price?: number;
            province?: string;
            city?: string;
        } = {}
    ): Promise<CategoryListingsResponse> {
        const params = new URLSearchParams();

        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.offset) params.append("offset", String(filters.offset));
        if (filters.sort_by) params.append("sort_by", filters.sort_by);
        if (filters.min_price) params.append("min_price", String(filters.min_price));
        if (filters.max_price) params.append("max_price", String(filters.max_price));
        if (filters.province) params.append("province", filters.province);
        if (filters.city) params.append("city", filters.city);

        const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CATEGORIES}/${slug}/listings?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch category listings.");
        }

        return data;
    }
}

export const categoryService = new CategoryService();