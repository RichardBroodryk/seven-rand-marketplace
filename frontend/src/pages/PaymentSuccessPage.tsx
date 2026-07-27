import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Heading,
  Loader,
  PrimaryButton,
} from "../components/ui";
import { listingsService } from "../services/listingsService";
import styles from "./PaymentSuccessPage.module.css";

const MAX_ATTEMPTS = 30;
const POLL_INTERVAL = 1000;

export default function PaymentSuccessPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();

  const [listingTitle, setListingTitle] = useState("Your listing");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) {
      setError("No listing ID provided.");
      setIsVerifying(false);
      return;
    }

    let attempts = 0;
    let isMounted = true;

    const loadListingTitle = async () => {
      try {
        const listing = await listingsService.getListingById(listingId);

        if (
          listing &&
          typeof listing === "object" &&
          "title" in listing &&
          listing.title
        ) {
          if (isMounted) {
            setListingTitle(String(listing.title));
          }
        }
      } catch (err) {
        console.error("Unable to load listing title:", err);
      }
    };

    const verifyPayment = async () => {
      try {
        const verification = await listingsService.verifyPayment(listingId);

        if (!isMounted) return;

        if (verification.data.is_published) {
          setIsVerified(true);
          setIsVerifying(false);
          clearInterval(interval);
        } else {
          attempts++;

          if (attempts >= MAX_ATTEMPTS) {
            setTimedOut(true);
            setIsVerifying(false);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Payment verification failed:", err);

        attempts++;

        if (attempts >= MAX_ATTEMPTS && isMounted) {
          setTimedOut(true);
          setIsVerifying(false);
          clearInterval(interval);
        }
      }
    };

    loadListingTitle();

    verifyPayment();

    const interval = window.setInterval(() => {
      verifyPayment();
    }, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [listingId]);

  if (error) {
    return (
      <Container size="large">
        <div className={styles.error}>
          <Heading as="h1" size="xl">
            Something went wrong
          </Heading>

          <p>{error}</p>

          <PrimaryButton onClick={() => navigate("/")}>
            Return to Home
          </PrimaryButton>
        </div>
      </Container>
    );
  }

  if (isVerifying) {
    return (
      <Container size="large">
        <div className={styles.loading}>
          <Loader size="large" />

          <Heading as="h2" size="lg">
            Verifying your payment...
          </Heading>

          <p>
            Your payment has been received.
            <br />
            We're securely confirming it and publishing your advert.
          </p>
        </div>
      </Container>
    );
  }

  if (timedOut) {
    return (
      <Container size="medium">
        <div className={styles.error}>
          <Heading as="h1" size="xl">
            Still verifying your payment
          </Heading>

          <p>
            Your payment is still being processed.
            <br />
            This can occasionally take a little longer.
          </p>

          <p>
            You can safely refresh this page in a few moments or return to the
            homepage and check your listing shortly.
          </p>

          <PrimaryButton onClick={() => window.location.reload()}>
            Check Again
          </PrimaryButton>

          <PrimaryButton
            variant="outline"
            onClick={() => navigate("/")}
          >
            Return to Home
          </PrimaryButton>
        </div>
      </Container>
    );
  }

  if (!isVerified) {
    return null;
  }

  return (
    <Container size="medium">
      <div className={styles.success}>
        <div className={styles.icon}>✅</div>

        <Heading as="h1" size="xl">
          Payment Successful!
        </Heading>

        <p className={styles.message}>
          Your listing <strong>"{listingTitle}"</strong> has been published
          successfully.
        </p>

        <div className={styles.actions}>
          <PrimaryButton
            onClick={() => navigate(`/listing/${listingId}`)}
          >
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