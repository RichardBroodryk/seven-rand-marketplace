import { API_CONFIG } from "../config/api";

interface MarketplaceStats {
    active_listings: number;
    new_today: number;
    verified_sellers: number;
    seven_shield_verified: number;
}

class StatsService {
    async getMarketplaceStats(): Promise<MarketplaceStats> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/stats/marketplace`
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch stats.");
        }

        return data.data;
    }
}

export const statsService = new StatsService();