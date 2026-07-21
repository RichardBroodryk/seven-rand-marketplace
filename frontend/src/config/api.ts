export const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
} as const;

export const API_ENDPOINTS = {
  HEALTH: "/health",
  AUTH: "/auth",
  LISTINGS: "/listings",
  PAYMENTS: "/payments",
  UPLOADS: "/uploads",
  SEARCH: "/search",
  CATEGORIES: "/categories",
} as const;