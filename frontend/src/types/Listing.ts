export interface Listing {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  description: string;
  price: number;
  province: string;
  city: string;
  status: string;
  payment_status: string;
  payment_reference?: string;
  published_at?: string;
  views: number;
  contact_unlocks: number;
  created_at: string;
  updated_at: string;
  // Optional fields for UI
  featured?: boolean;
  premium?: boolean;
  verified?: boolean;
  image?: string;
  currency?: string;
  location?: string;
  postedDate?: string;
}