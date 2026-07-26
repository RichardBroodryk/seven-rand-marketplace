import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  Heading,
  Loader,
  PrimaryButton,
} from "../components/ui";

import { listingsService } from "../services/listingsService";

import styles from "./CheckoutPage.module.css";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: number;
  province: string;
  city: string;
  status: string;
  seller_id: string;
  created_at: string;
}

// Category fee mapping - UPDATED with all premium categories
const PREMIUM_CATEGORIES = [
  1, 2, 3,    // Vehicles, Property, Commercial Equipment
  15,         // Farming
  16,         // Business & Industrial
  17,         // Boating & Marine
  18,         // Trucks & Heavy Vehicles
  19,         // Caravans & Camping
  21          // Trailers
];

const getSellerFee = (categoryId: number): number => {
  if (PREMIUM_CATEGORIES.includes(categoryId)) return 14;
  return 7;
};

const getCategoryName = (categoryId: number): string => {
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
  return map[categoryId] || "Unknown";
};

export default function CheckoutPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 // PayFast configuration - using API_CONFIG base URL
const payFastConfig = {
  sandbox: true,
  merchantId: "10000100",
  merchantKey: "46f0cd694581a",
  returnUrl: `${window.location.origin}/payment/success/${listingId}`,
  cancelUrl: `${window.location.origin}/payment/cancel/${listingId}`,
  notifyUrl: `https://seven-rand-marketplace.onrender.com/api/payments/webhook`,
};

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setError("No listing ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await listingsService.getListingById(listingId);
        const data = response && typeof response === 'object' && 'data' in response 
          ? response.data 
          : response;
        setListing(data as Listing);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

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

  // Check if listing is already published
  if (listing.status === "published") {
    return (
      <Container size="large">
        <div className={styles.alreadyPublished}>
          <div className={styles.successIcon}>✓</div>
          <Heading as="h1" size="xl">Listing Already Published</Heading>
          <p>This listing has already been published and is live on the marketplace.</p>
          <PrimaryButton onClick={() => navigate(`/listing/${listing.id}`)}>
            View Listing
          </PrimaryButton>
        </div>
      </Container>
    );
  }

  const sellerFee = getSellerFee(listing.category_id);
  const categoryName = getCategoryName(listing.category_id);
  const isPremium = PREMIUM_CATEGORIES.includes(listing.category_id);

  // Build PayFast form data - fixed custom_int1
  const payFastData = {
    merchant_id: payFastConfig.merchantId,
    merchant_key: payFastConfig.merchantKey,
    return_url: payFastConfig.returnUrl,
    cancel_url: payFastConfig.cancelUrl,
    notify_url: payFastConfig.notifyUrl,
    name_first: "",
    name_last: "",
    email_address: "",
    m_payment_id: listingId || "",
    amount: sellerFee.toFixed(2),
    item_name: `The Seven Rand Marketplace - Listing Fee (${categoryName})`,
    item_description: `Listing fee for "${listing.title}"`,
    // custom_int1 removed - was causing error with UUID
    custom_str1: listing.title,
    payment_method: "cc",
  };

  const actionUrl = payFastConfig.sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  return (
    <Container size="medium">
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading as="h1" size="xl">Checkout</Heading>
          <p className={styles.subtitle}>
            Review your listing details and complete payment to publish your advert.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Listing Summary */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Listing Summary</h2>

            <div className={styles.listingDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Title</span>
                <span className={styles.detailValue}>{listing.title}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Category</span>
                <span className={styles.detailValue}>
                  {categoryName}
                  {isPremium && (
                    <span className={styles.premiumBadge}>Premium</span>
                  )}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Price</span>
                <span className={styles.detailValue}>R{Number(listing.price).toFixed(2)}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>
                  {listing.city}, {listing.province}
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.feeSummary}>
              <div className={styles.feeRow}>
                <span>Listing Fee</span>
                <strong>R{sellerFee.toFixed(2)}</strong>
              </div>
              <div className={styles.feeRow}>
                <span>Payment Gateway</span>
                <strong>PayFast</strong>
              </div>
              <div className={styles.feeRow}>
                <span>Status After Payment</span>
                <strong>Published Live</strong>
              </div>
            </div>

            <div className={styles.note}>
              <p>
                <strong>Important:</strong> Your listing will be published immediately
                upon successful payment. You will receive a confirmation email once
                your listing is live.
              </p>
            </div>
          </div>

          {/* PayFast Payment Form */}
          <div className={styles.payment}>
            <h2 className={styles.paymentTitle}>Pay with PayFast</h2>

            <div className={styles.paymentAmount}>
              <span>Total Amount</span>
              <span className={styles.amount}>R{sellerFee.toFixed(2)}</span>
            </div>

            <div className={styles.paymentMethods}>
              <div className={styles.method}>
                <span>Credit Card</span>
                <span className={styles.methodIcon}>💳</span>
              </div>
              <div className={styles.method}>
                <span>Instant EFT</span>
                <span className={styles.methodIcon}>🏦</span>
              </div>
              <div className={styles.method}>
                <span>Mobile Wallet</span>
                <span className={styles.methodIcon}>📱</span>
              </div>
            </div>

            <form
              action={actionUrl}
              method="POST"
              className={styles.payFastForm}
            >
              {Object.entries(payFastData).map(([key, value]) => (
                <input
                  key={key}
                  type="hidden"
                  name={key}
                  value={value || ""}
                />
              ))}

              <PrimaryButton
                type="submit"
                fullWidth
                className={styles.payButton}
              >
                Pay Now - R{sellerFee.toFixed(2)}
              </PrimaryButton>
            </form>

            <p className={styles.secureNotice}>
              🔒 Secure payment processed by PayFast. Your payment information is
              encrypted and never stored by The Seven Rand Marketplace.
            </p>

            <p className={styles.sandboxNotice}>
              ⚠️ Testing in Sandbox Mode. No real payments will be processed.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}