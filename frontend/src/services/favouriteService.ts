import { API_CONFIG } from "../config/api";

interface Favourite {
    id: string;
    title: string;
    description: string;
    price: number;
    province: string;
    city: string;
    status: string;
    category_name: string;
    images: { url: string }[];
    favourited_at: string;
}

class FavouriteService {
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

    async getFavourites(): Promise<Favourite[]> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/favourites`,
            { headers: this.getHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to get favourites.");
        }

        return data.data;
    }

    async addFavourite(listingId: string): Promise<void> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/favourites/${listingId}`,
            {
                method: "POST",
                headers: this.getHeaders(),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add to favourites.");
        }
    }

    async removeFavourite(listingId: string): Promise<void> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/favourites/${listingId}`,
            {
                method: "DELETE",
                headers: this.getHeaders(),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to remove from favourites.");
        }
    }

    async isFavourite(listingId: string): Promise<boolean> {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/favourites/${listingId}`,
            { headers: this.getHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
            return false;
        }

        return data.data.is_favourite;
    }
}

export const favouriteService = new FavouriteService();