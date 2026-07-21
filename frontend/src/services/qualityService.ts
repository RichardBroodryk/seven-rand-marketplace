import { API_CONFIG } from "../config/api";

interface ListingQuality {
    score: number;
    level: "Excellent" | "Good" | "Needs Improvement";
    feedback: string[];
}

interface SellerHealth {
    score: number;
    level: "Excellent" | "Good" | "Needs Improvement";
    feedback: string[];
    stats: {
        total_listings: number;
        published_listings: number;
        publish_rate: number;
        total_views: number;
        total_contact_unlocks: number;
    };
}

class QualityService {
    private getToken(): string | null {
        return localStorage.getItem("token");
    }

    private getHeaders(): HeadersInit {
        const token = this.getToken();
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    }

    async getListingQuality(listingId: string): Promise<ListingQuality> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/quality/listing/${listingId}/quality`,
            { headers: this.getHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get listing quality.");
        }

        return data.data;
    }

    async getSellerHealth(): Promise<SellerHealth> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/quality/health`,
            { headers: this.getHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get seller health.");
        }

        return data.data;
    }

    async markAsSold(listingId: string): Promise<void> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/quality/listing/${listingId}/sold`,
            {
                method: "PUT",
                headers: this.getHeaders(),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to mark as sold.");
        }
    }

    async renewListing(listingId: string): Promise<void> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/quality/listing/${listingId}/renew`,
            {
                method: "PUT",
                headers: this.getHeaders(),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to renew listing.");
        }
    }
}

export const qualityService = new QualityService();