import { Container, Heading, PrimaryButton } from "../ui";
import styles from "./MarketplaceHero.module.css";

import sevenShieldIcon from "../../assets/images/sevenshield.png";

export default function MarketplaceHero() {
  const scrollToListings = () => {
    const section = document.getElementById("featured-listings");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const goToPostAd = () => {
    window.location.href = "/post-ad";
  };

  return (
    <section className={styles.hero}>
      <Container size="large">
        <div className={styles.heroBanner}>
          <div className={styles.overlay}>
            <Heading
              as="h1"
              size="xl"
              className={styles.title}
            >
              South Africa's Trusted Marketplace

              <img
                src={sevenShieldIcon}
                alt="Seven Shield"
                className={styles.shieldIcon}
              />
            </Heading>

            <div className={styles.companyBadge}>
              An Affiliate of Rugby Anthem Zone (Pty) Ltd
            </div>

            <p className={styles.tagline}>
              Every Deal Starts With Trust.
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <PrimaryButton
            size="large"
            onClick={scrollToListings}
          >
            Search Listings
          </PrimaryButton>

          <PrimaryButton
            variant="outline"
            size="large"
            onClick={goToPostAd}
          >
            Post Your Ad for R7
          </PrimaryButton>
        </div>
      </Container>
    </section>
  );
}