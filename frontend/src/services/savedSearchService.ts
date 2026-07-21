import { API_CONFIG } from "../config/api";

interface SavedSearch {
  id: string;
  keyword: string | null;
  category_id: number | null;
  province: string | null;
  city: string | null;
  min_price: number | null;
  max_price: number | null;
  created_at: string;
}

interface SaveSearchData {
  keyword?: string;
  category_id?: number;
  province?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
}

class SavedSearchService {
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

  async saveSearch(data: SaveSearchData): Promise<SavedSearch> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/saved-searches`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save search.");
    }

    return result.data;
  }

  async getSavedSearches(): Promise<SavedSearch[]> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/saved-searches`,
      {
        headers: this.getHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to get saved searches.");
    }

    return result.data;
  }

  async deleteSavedSearch(id: string): Promise<void> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/saved-searches/${id}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete saved search.");
    }
  }
}

export const savedSearchService = new SavedSearchService();