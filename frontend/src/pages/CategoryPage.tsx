import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Heading, Loader, PrimaryButton } from "../components/ui";
import { ListingCard } from "../components/listings";
import { categoryService } from "../services/categoryService";
import type { Listing } from "../types/Listing";
import styles from "./CategoryPage.module.css";

interface CategoryInfo {
    id: number;
    name: string;
    slug: string;
    is_premium: boolean;
}

// Category name mapping for display (fallback if API doesn't return name)
const categoryNames: Record<string, string> = {
    vehicles: "Vehicles",
    property: "Property",
    "commercial-equipment": "Commercial Equipment",
    electronics: "Electronics",
    furniture: "Furniture",
    "home-garden": "Home & Garden",
    fashion: "Fashion",
    sports: "Sports",
    other: "Other",
    jobs: "Jobs",
    services: "Services",
    pets: "Pets",
    gaming: "Gaming",
    "baby-kids": "Baby & Kids",
    farming: "Farming",
    "business-industrial": "Business & Industrial",
};

// Category icon mapping
const categoryIcons: Record<string, string> = {
    vehicles: "🚗",
    property: "🏡",
    "commercial-equipment": "🏗️",
    electronics: "📱",
    furniture: "🪑",
    "home-garden": "🌿",
    fashion: "👗",
    sports: "⚽",
    other: "📦",
    jobs: "💼",
    services: "🛠",
    pets: "🐶",
    gaming: "🎮",
    "baby-kids": "👶",
    farming: "🚜",
    "business-industrial": "📦",
};

export default function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<CategoryInfo | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState({
        sort_by: "newest" as "newest" | "price_asc" | "price_desc",
        province: "",
        city: "",
        min_price: "",
        max_price: "",
    });

    const limit = 12;

    const fetchCategoryListings = async (newOffset = 0) => {
        if (!slug) return;

        setLoading(true);
        try {
            const result = await categoryService.getListingsByCategory(slug, {
                limit,
                offset: newOffset,
                sort_by: filters.sort_by,
                province: filters.province || undefined,
                city: filters.city || undefined,
                min_price: filters.min_price ? Number(filters.min_price) : undefined,
                max_price: filters.max_price ? Number(filters.max_price) : undefined,
            });

            setCategory(result.category);

            if (newOffset === 0) {
                setListings(result.data);
            } else {
                setListings((prev) => [...prev, ...result.data]);
            }

            setTotal(result.pagination.total);
            setHasMore(result.pagination.hasMore);
            setOffset(newOffset);
        } catch (error) {
            console.error("Failed to fetch category listings:", error);
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryListings(0);
    }, [slug, filters.sort_by]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        // Reset offset when filters change
        fetchCategoryListings(0);
    };

    const handleLoadMore = () => {
        fetchCategoryListings(offset + limit);
    };

    // Get display name and icon
    const displayName = category?.name || categoryNames[slug || ""] || slug || "Category";
    const displayIcon = categoryIcons[slug || ""] || "📂";

    if (loading && offset === 0) {
        return (
            <Container size="large">
                <div className={styles.loadingContainer}>
                    <Loader size="large" />
                    <p>Loading category...</p>
                </div>
            </Container>
        );
    }

    // Check if category exists in our mapping (even if API didn't return it)
    const categoryExists = category || categoryNames[slug || ""];

    if (!categoryExists) {
        return (
            <Container size="large">
                <div className={styles.errorContainer}>
                    <Heading as="h1" size="xl">Category Not Found</Heading>
                    <p>The category "{slug}" doesn't exist.</p>
                    <PrimaryButton onClick={() => navigate("/")}>
                        Return to Home
                    </PrimaryButton>
                </div>
            </Container>
        );
    }

    return (
        <Container size="large">
            <div className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.categoryIcon}>{displayIcon}</div>
                    <Heading as="h1" size="xl">
                        {displayName}
                    </Heading>
                    {category?.is_premium && (
                        <span className={styles.premiumBadge}>⭐ Premium Category</span>
                    )}
                    <p className={styles.subtitle}>
                        Browse {displayName} listings from trusted sellers.
                    </p>
                </div>

                <div className={styles.results}>
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label>Sort By</label>
                            <select
                                value={filters.sort_by}
                                onChange={(e) => handleFilterChange("sort_by", e.target.value)}
                                className={styles.select}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Province</label>
                            <input
                                type="text"
                                placeholder="e.g. Gauteng"
                                value={filters.province}
                                onChange={(e) => handleFilterChange("province", e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label>City</label>
                            <input
                                type="text"
                                placeholder="e.g. Pretoria"
                                value={filters.city}
                                onChange={(e) => handleFilterChange("city", e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label>Price Range</label>
                            <div className={styles.priceRange}>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.min_price}
                                    onChange={(e) => handleFilterChange("min_price", e.target.value)}
                                    className={styles.priceInput}
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.max_price}
                                    onChange={(e) => handleFilterChange("max_price", e.target.value)}
                                    className={styles.priceInput}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.resultsGrid}>
                        {listings.length === 0 ? (
                            <div className={styles.noResults}>
                                <p>No listings in this category yet.</p>
                                <p className={styles.noResultsSubtext}>
                                    Be the first to post an ad in {displayName}!
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.resultsInfo}>
                                    Found {total} listing{total !== 1 ? "s" : ""}
                                </div>
                                <div className={styles.grid}>
                                    {listings.map((listing) => (
                                        <ListingCard key={listing.id} listing={listing} />
                                    ))}
                                </div>
                                {hasMore && (
                                    <div className={styles.loadMore}>
                                        <PrimaryButton onClick={handleLoadMore}>
                                            Load More
                                        </PrimaryButton>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
}