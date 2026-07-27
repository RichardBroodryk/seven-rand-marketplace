import { useState, useEffect } from "react";
import type { Listing } from "../../types/Listing";
import { Link } from "react-router-dom";

import {
  Card,
  Price,
  PrimaryButton,
  SevenShield,
} from "../ui";

import ListingBadges from "./ListingBadges";
import ListingImage from "./ListingImage";
import ListingMeta from "./ListingMeta";

import { favouriteService } from "../../services/favouriteService";

import styles from "./ListingCard.module.css";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({
  listing,
}: ListingCardProps) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // ✅ Use uploaded image if available, otherwise fallback to placeholder
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0].url 
    : `https://picsum.photos/seed/${listing.id}/400/300`;

  // Format the date
  const formattedDate = listing.created_at
    ? new Date(listing.created_at).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  // Determine Seven Shield status (for demo, based on listing status)
  const shieldStatus = listing.status === "published" ? "verified" : "pending";

  // Check if listing is in favourites
  useEffect(() => {
    const checkFavourite = async () => {
      try {
        const result = await favouriteService.isFavourite(listing.id);
        setIsFavourite(result);
      } catch (error) {
        // Silent fail - user may not be logged in
      }
    };
    checkFavourite();
  }, [listing.id]);

  const toggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favLoading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to save favourites.");
      return;
    }

    setFavLoading(true);
    try {
      if (isFavourite) {
        await favouriteService.removeFavourite(listing.id);
        setIsFavourite(false);
      } else {
        await favouriteService.addFavourite(listing.id);
        setIsFavourite(true);
      }
    } catch (error) {
      console.error("Favourite error:", error);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link to={`/listing/${listing.id}`} className={styles.link}>
      <Card
        padding="large"
        shadow="medium"
        className={styles.card}
      >
        <div className={styles.imageWrapper}>
          <ListingImage
            image={imageUrl}
            title={listing.title}
          />

          <button
            className={styles.favouriteButton}
            onClick={toggleFavourite}
            disabled={favLoading}
            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
          >
            <span className={isFavourite ? styles.heartActive : styles.heartInactive}>
              ♥
            </span>
          </button>

          <ListingBadges
            featured={listing.featured || false}
            premium={listing.premium || false}
            verified={listing.verified || false}
          />
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>
            {listing.title}
          </h3>

          <Price
            amount={listing.price}
            size="large"
            currency="R"
          />

          <SevenShield
            status={shieldStatus}
            size="small"
            showLabel={true}
            className={styles.shield}
          />

          <ListingMeta
            location={`${listing.city || "Unknown"}, ${listing.province || "Unknown"}`}
            postedDate={formattedDate}
            views={listing.views || 0}
          />

          <PrimaryButton fullWidth>
            View Listing
          </PrimaryButton>
        </div>
      </Card>
    </Link>
  );
}