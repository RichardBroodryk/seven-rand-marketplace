import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Heading, PrimaryButton, Loader } from "../components/ui";
import { listingsService } from "../services/listingsService";
import styles from "./PaymentSuccessPage.module.css";

export default function PaymentSuccessPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [listingTitle, setListingTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkListing = async () => {
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
        
        if (data && typeof data === 'object' && 'title' in data) {
          setListingTitle(String(data.title || "Your listing"));
        } else {
          setListingTitle("Your listing");
        }
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setListingTitle("Your listing");
      } finally {
        setLoading(false);
      }
    };

    checkListing();
  }, [listingId]);

  if (loading) {
    return (
      <Container size="large">
        <div className={styles.loading}>
          <Loader size="large" />
          <p>Verifying payment...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="large">
        <div className={styles.error}>
          <Heading as="h1" size="xl">Something went wrong</Heading>
          <p>{error}</p>
          <PrimaryButton onClick={() => navigate("/")}>
            Return to Home
          </PrimaryButton>
        </div>
      </Container>
    );
  }

  return (
    <Container size="medium">
      <div className={styles.success}>
        <div className={styles.icon}>✅</div>
        <Heading as="h1" size="xl">Payment Successful!</Heading>
        <p className={styles.message}>
          Your listing "<strong>{listingTitle}</strong>" has been published successfully.
        </p>
        <div className={styles.actions}>
          <PrimaryButton onClick={() => navigate(`/listing/${listingId}`)}>
            View Your Listing
          </PrimaryButton>
          <PrimaryButton 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Return to Home
          </PrimaryButton>
        </div>
      </div>
    </Container>
  );
}