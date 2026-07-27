import type { Listing } from "../types/Listing";
import { API_CONFIG, API_ENDPOINTS } from "../config/api";

interface CreateListingRequest {
  category_id: number;
  title: string;
  description: string;
  price: number;
  province?: string;
  city?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  listingId?: string;
  error?: string;
}

interface ListingsApiResponse {
  success: boolean;
  message?: string;
  data: Listing[];
}

export interface PaymentVerificationResponse {
  success: boolean;
  data: {
    id: string;
    status: string;
    payment_status: string;
    is_published: boolean;
  };
}

class ListingsService {
  async getFeaturedListings(): Promise<Listing[]> {
    return this.getLatestListings();
  }

  async getLatestListings(): Promise<Listing[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LISTINGS}/latest`
      );

      const data: ListingsApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch listings");
      }

      const listings = data.data || data;
      return Array.isArray(listings) ? listings : [];
    } catch (error) {
      console.error("Error fetching latest listings:", error);
      return [];
    }
  }

  async getListingById(id: string | number): Promise<Listing | undefined> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LISTINGS}/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch listing");
      }

      const listing = data.data || data;
      return listing as Listing;
    } catch (error) {
      console.error("Error fetching listing:", error);
      throw error;
    }
  }

  async createListing(
    listing: CreateListingRequest,
    token: string
  ): Promise<ApiResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LISTINGS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listing),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Unable to create listing."
      );
    }

    return data;
  }

  /**
   * Verify payment status after PayFast redirects back.
   * The frontend polls this endpoint until the webhook
   * has published the listing.
   */
  async verifyPayment(
    listingId: string
  ): Promise<PaymentVerificationResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PAYMENTS}/verify/${listingId}`
    );

    const data: PaymentVerificationResponse = await response.json();

    if (!response.ok) {
      throw new Error("Unable to verify payment.");
    }

    return data;
  }
}

export const listingsService = new ListingsService();