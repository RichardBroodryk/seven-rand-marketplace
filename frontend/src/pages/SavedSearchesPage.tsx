import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Heading, Loader, PrimaryButton } from "../components/ui";
import { savedSearchService } from "../services/savedSearchService";
import styles from "./SavedSearchesPage.module.css";

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

export default function SavedSearchesPage() {
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const data = await savedSearchService.getSavedSearches();
        setSearches(data);
      } catch (error) {
        console.error("Failed to fetch saved searches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearches();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this saved search?")) return;
    try {
      await savedSearchService.deleteSavedSearch(id);
      setSearches(searches.filter((s) => s.id !== id));
    } catch (error) {
      alert("Failed to delete saved search.");
    }
  };

  const handleRunSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.keyword) params.set("q", search.keyword);
    if (search.category_id) params.set("category", String(search.category_id));
    if (search.province) params.set("province", search.province);
    if (search.city) params.set("city", search.city);
    if (search.min_price) params.set("min_price", String(search.min_price));
    if (search.max_price) params.set("max_price", String(search.max_price));
    navigate(`/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <Container size="large">
        <div className={styles.loadingContainer}>
          <Loader size="large" />
          <p>Loading saved searches...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container size="large">
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading as="h1" size="xl">🔍 Saved Searches</Heading>
          <p className={styles.subtitle}>
            Your saved searches. Run them anytime to find new listings.
          </p>
        </div>

        {searches.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No saved searches yet.</p>
            <p className={styles.emptySubtext}>
              Search for something and click "Save This Search" to get started.
            </p>
            <PrimaryButton onClick={() => navigate("/")}>
              Browse Marketplace
            </PrimaryButton>
          </div>
        ) : (
          <div className={styles.grid}>
            {searches.map((search) => (
              <div key={search.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3>{search.keyword || "All listings"}</h3>
                  <div className={styles.details}>
                    {search.category_id && <span>Category: {search.category_id}</span>}
                    {search.province && <span>Province: {search.province}</span>}
                    {search.city && <span>City: {search.city}</span>}
                    {search.min_price && <span>Min: R{search.min_price}</span>}
                    {search.max_price && <span>Max: R{search.max_price}</span>}
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.runButton}
                      onClick={() => handleRunSearch(search)}
                    >
                      🔍 Run Search
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(search.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}