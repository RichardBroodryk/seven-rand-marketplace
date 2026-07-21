import { Container, Heading, PrimaryButton } from "../ui";
import styles from "./MarketplaceHero.module.css";

// Import your custom shield icon
import sevenShieldIcon from "../../assets/images/sevenshield.png";

export default function MarketplaceHero() {
  // Scroll to Featured Listings section
  const scrollToListings = () => {
    const section = document.getElementById("featured-listings");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Navigate to post ad page
  const goToPostAd = () => {
    window.location.href = "/post-ad";
  };

  return (
    <section className={styles.hero}>
      <Container size="large">
        <div className={styles.content}>
          <div className={styles.header}>
            <Heading as="h1" size="xl" className={styles.title}>
              South Africa's Trusted Marketplace
              <img 
                src={sevenShieldIcon} 
                alt="Seven Shield" 
                className={styles.shieldIcon}
              />
            </Heading>
            <p className={styles.subtitle}>
              Every Deal Starts With Trust.
            </p>
          </div>

          <div className={styles.actions}>
            <PrimaryButton size="large" onClick={scrollToListings}>
              Search Listings
            </PrimaryButton>
            <PrimaryButton variant="outline" size="large" onClick={goToPostAd}>
              Post Your Ad for R7
            </PrimaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}