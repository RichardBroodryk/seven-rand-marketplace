import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Heading, PrimaryButton, Loader, Badge, Price, SevenShield } from "../components/ui";
import { listingsService } from "../services/listingsService";
import type { Listing } from "../types/Listing";
import styles from "./ListingDetailPage.module.css";

interface ListingDetail extends Listing {
  seller?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    is_verified: boolean;
    reputation_score: number;
  };
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setError("No listing ID provided");
        setLoading(false);
        return;
      }

      try {
        const data = await listingsService.getListingById(id);
        if (data) {
          setListing(data as ListingDetail);
        } else {
          setError("Listing not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleContactClick = () => {
    alert("Safe Verified Contact - This will unlock seller contact details after payment.");
  };

  if (loading) {
    return (
      <Container size="large">
        <div className={styles.loadingContainer}>
          <Loader size="large" />
          <p>Loading listing details...</p>
        </div>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container size="large">
        <div className={styles.errorContainer}>
          <Heading as="h1" size="xl">Something went wrong</Heading>
          <p>{error || "Listing not found"}</p>
          <PrimaryButton onClick={() => navigate("/")}>
            Return to Home
          </PrimaryButton>
        </div>
      </Container>
    );
  }

  const categoryName = (() => {
    const map: Record<number, string> = {
      1: "Vehicles",
      2: "Property",
      3: "Commercial Equipment",
      4: "Electronics",
      5: "Furniture",
      6: "Home & Garden",
      7: "Fashion",
      8: "Sports",
      9: "Other",
      10: "Jobs",
      11: "Services",
      12: "Pets",
      13: "Gaming",
      14: "Baby & Kids",
      15: "Farming",
      16: "Business & Industrial",
      17: "Boating & Marine",
      18: "Trucks & Heavy Vehicles",
      19: "Caravans & Camping",
      20: "Tools & Equipment",
      21: "Trailers",
      22: "Cosmetics & Beauty",
    };
    return map[listing.category_id] || "Unknown";
  })();

  const sellerName = listing.seller
    ? `${listing.seller.first_name} ${listing.seller.last_name}`
    : "Verified Seller";

  const isPublished = listing.status === "published";

  // ✅ Use uploaded image if available, otherwise fallback to placeholder
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0].url 
    : `https://picsum.photos/seed/${listing.id}/800/600`;

  return (
    <Container size="large">
      <div className={styles.page}>
        <div className={styles.imageWrapper}>
          <img
            src={imageUrl}
            alt={listing.title}
            className={styles.image}
          />
          <div className={styles.imageOverlay}>
            <Badge variant={isPublished ? "success" : "warning"}>
              {isPublished ? "Live" : "Pending"}
            </Badge>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <div className={styles.header}>
              <div className={styles.breadcrumb}>
                <span>{categoryName}</span>
                <span className={styles.separator}>/</span>
                <span>{listing.city || "Unknown"}, {listing.province || "Unknown"}</span>
              </div>
              <Heading as="h1" size="xl">{listing.title}</Heading>
            </div>

            <div className={styles.priceBox}>
              <Price amount={listing.price} size="large" />
            </div>

            <div className={styles.description}>
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>{categoryName}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{listing.city || "Unknown"}, {listing.province || "Unknown"}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Listing ID</span>
                <span className={styles.detailValue}>{listing.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>
                  <Badge variant={isPublished ? "success" : "warning"}>
                    {isPublished ? "Published" : "Pending"}
                  </Badge>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.sellerSection}>
            <div className={styles.sellerCard}>
              <div className={styles.sellerHeader}>
                <div className={styles.sellerAvatar}>
                  {sellerName.charAt(0)}
                </div>
                <div>
                  <h3 className={styles.sellerName}>{sellerName}</h3>
                  {listing.seller?.is_verified && (
                    <span className={styles.verifiedBadge}>✓ Verified Seller</span>
                  )}
                </div>
              </div>

              <div className={styles.sellerStats}>
                <div className={styles.stat}>
                  <span>Reputation</span>
                  <strong>{listing.seller?.reputation_score || 100}</strong>
                </div>
                <div className={styles.stat}>
                  <span>Member Since</span>
                  <strong>2024</strong>
                </div>
              </div>

              <SevenShield className={styles.shield} />

              <PrimaryButton
                fullWidth
                onClick={handleContactClick}
                className={styles.contactButton}
              >
                🔒 Safe Verified Contact
              </PrimaryButton>

              <p className={styles.contactNote}>
                Pay R7 to unlock verified contact details and Seven Shield protection.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Tips Section */}
        <div className={styles.safetyTips}>
          <h3>🛡️ Safety Tips</h3>
          <div className={styles.tipsGrid}>
            <div className={styles.tip}>
              <span>🔍</span>
              <p>Check the seller's Seven Shield status before buying.</p>
            </div>
            <div className={styles.tip}>
              <span>📱</span>
              <p>Always use Safe Verified Contact to reach sellers.</p>
            </div>
            <div className={styles.tip}>
              <span>💰</span>
              <p>Never send money outside the platform.</p>
            </div>
            <div className={styles.tip}>
              <span>📸</span>
              <p>Document everything - take screenshots of listings and conversations.</p>
            </div>
          </div>
          <Link to="/safety-centre" className={styles.safetyLink}>
            Learn more about staying safe →
          </Link>
        </div>
        {/* End Safety Tips Section */}

      </div>
    </Container>
  );
}