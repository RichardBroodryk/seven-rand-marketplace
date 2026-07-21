import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Heading, Input, PrimaryButton, Loader } from "../components/ui";
import { ListingCard } from "../components/listings";
import { searchService } from "../services/searchService";
import { savedSearchService } from "../services/savedSearchService";
import type { Listing } from "../types/Listing";
import styles from "./SearchPage.module.css";

interface SearchFilters {
  keyword: string;
  category_id?: number;
  province?: string;
  city?: string;
  min_price?: string;
  max_price?: string;
  sort_by: string;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: searchParams.get("q") || "",
    category_id: searchParams.get("category") ? Number(searchParams.get("category")) : undefined,
    province: searchParams.get("province") || "",
    city: searchParams.get("city") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    sort_by: searchParams.get("sort") || "relevance",
  });
  const [savingSearch, setSavingSearch] = useState(false);
  const [searchSaved, setSearchSaved] = useState(false);

  const limit = 12;

  const performSearch = async (newOffset = 0) => {
    setLoading(true);
    try {
      const result = await searchService.search({
        keyword: filters.keyword || undefined,
        category_id: filters.category_id,
        province: filters.province || undefined,
        city: filters.city || undefined,
        min_price: filters.min_price ? Number(filters.min_price) : undefined,
        max_price: filters.max_price ? Number(filters.max_price) : undefined,
        limit,
        offset: newOffset,
        sort_by: filters.sort_by as any,
      });

      if (newOffset === 0) {
        setListings(result.data);
      } else {
        setListings((prev) => [...prev, ...result.data]);
      }

      setTotal(result.pagination.total);
      setHasMore(result.pagination.hasMore);
      setOffset(newOffset);
    } catch (error) {
      console.error("Search failed:", error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(0);
    const params = new URLSearchParams();
    if (filters.keyword) params.set("q", filters.keyword);
    if (filters.category_id) params.set("category", String(filters.category_id));
    if (filters.province) params.set("province", filters.province);
    if (filters.city) params.set("city", filters.city);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.sort_by !== "relevance") params.set("sort", filters.sort_by);
    setSearchParams(params);
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoadMore = () => {
    performSearch(offset + limit);
  };

  const handleSaveSearch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to save searches.");
      return;
    }

    setSavingSearch(true);
    try {
      await savedSearchService.saveSearch({
        keyword: filters.keyword || undefined,
        category_id: filters.category_id,
        province: filters.province || undefined,
        city: filters.city || undefined,
        min_price: filters.min_price ? Number(filters.min_price) : undefined,
        max_price: filters.max_price ? Number(filters.max_price) : undefined,
      });
      setSearchSaved(true);
      setTimeout(() => setSearchSaved(false), 3000);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save search.");
    } finally {
      setSavingSearch(false);
    }
  };

  return (
    <Container size="large">
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading as="h1" size="xl">Search Listings</Heading>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <Input
              id="keyword"
              name="keyword"
              type="text"
              placeholder="Search for items..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
              className={styles.searchInput}
            />
            <PrimaryButton type="submit">Search</PrimaryButton>
          </form>
          <div className={styles.searchActions}>
            <button
              className={styles.saveSearchButton}
              onClick={handleSaveSearch}
              disabled={savingSearch}
            >
              {savingSearch ? "Saving..." : "💾 Save This Search"}
            </button>
            {searchSaved && (
              <span className={styles.savedConfirmation}>✅ Search saved!</span>
            )}
          </div>
        </div>

        <div className={styles.results}>
          <div className={styles.filters}>
            {/* ... existing filters ... */}
          </div>

          <div className={styles.resultsGrid}>
            {loading && offset === 0 ? (
              <div className={styles.loadingContainer}>
                <Loader size="large" />
                <p>Searching...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className={styles.noResults}>
                <p>No listings found.</p>
                <p className={styles.noResultsSubtext}>Try adjusting your search filters.</p>
              </div>
            ) : (
              <>
                <div className={styles.resultsInfo}>
                  Found {total} result{total !== 1 ? "s" : ""}
                </div>
                <div className={styles.grid}>
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
                {hasMore && (
                  <div className={styles.loadMore}>
                    <PrimaryButton onClick={handleLoadMore} disabled={loading}>
                      {loading ? "Loading..." : "Load More"}
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