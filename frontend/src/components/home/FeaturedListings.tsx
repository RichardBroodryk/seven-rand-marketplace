import { useEffect, useState } from "react";
import type { Listing } from "../../types/Listing";
import { listingsService } from "../../services/listingsService";
import { ListingCard } from "../listings";
import { Container, Heading, Loader } from "../ui";
import styles from "./FeaturedListings.module.css";

// Import your custom shield icon
import sevenShieldIcon from "../../assets/images/sevenshield.png";

export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const data = await listingsService.getFeaturedListings();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  return (
    <section id="featured-listings" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <Heading as="h2" size="xl" align="center" className={styles.headingWithIcon}>
            Featured Listings
            <img 
              src={sevenShieldIcon} 
              alt="Seven Shield" 
              className={styles.shieldIcon}
            />
          </Heading>
          <p className={styles.subtitle}>
            Discover trusted listings from across South Africa.
          </p>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <Loader size="large" />
            <p>Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No listings available yet.</p>
            <p className={styles.emptySubtext}>Be the first to post an ad!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}