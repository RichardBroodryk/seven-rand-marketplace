import { API_CONFIG, API_ENDPOINTS } from "../config/api";
import type { Listing } from "../types/Listing";

interface DashboardStats {
    total: number;
    published: number;
    pending: number;
    total_views: number;
    total_contact_unlocks: number;
}

interface MyListingsResponse {
    success: boolean;
    data: Listing[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

class DashboardService {
    async getStats(): Promise<DashboardStats> {
        const token = localStorage.getItem("token");
        
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LISTINGS}/my/stats`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch stats.");
        }
        
        return data.data;
    }

    async getMyListings(
        filters: {
            limit?: number;
            offset?: number;
            status?: string;
            sort_by?: string;
        } = {}
    ): Promise<MyListingsResponse> {
        const token = localStorage.getItem("token");
        
        const params = new URLSearchParams();
        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.offset) params.append("offset", String(filters.offset));
        if (filters.status && filters.status !== "all") params.append("status", filters.status);
        if (filters.sort_by) params.append("sort_by", filters.sort_by);
        
        const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LISTINGS}/my/listings?${params.toString()}`;
        
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch your listings.");
        }
        
        return data;
    }

    async updateListing(id: string, updateData: Partial<Listing>): Promise<Listing> {
        const token = localStorage.getItem("token");
        
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LISTINGS}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            }
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Failed to update listing.");
        }
        
        return data.data;
    }

    async deleteListing(id: string): Promise<void> {
        const token = localStorage.getItem("token");
        
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LISTINGS}/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Failed to delete listing.");
        }
    }
}

export const dashboardService = new DashboardService();