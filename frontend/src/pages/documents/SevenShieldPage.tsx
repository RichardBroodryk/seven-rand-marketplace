import { Container, Heading } from "../../components/ui";
import styles from "./SevenShieldPage.module.css";

// Import your custom shield icon in different colors
import sevenShieldIcon from "../../assets/images/sevenshield.png";
// For colored shields, we'll use the PNG with CSS filters or different images
// For now, we'll use the same icon with different styling

export default function SevenShieldPage() {
  return (
    <Container size="medium">
      <div className={styles.page}>
        <div className={styles.header}>
          <img 
            src={sevenShieldIcon} 
            alt="Seven Shield" 
            className={styles.icon}
          />
          <Heading as="h1" size="xl">Seven Shield</Heading>
          <p className={styles.subtitle}>
            The heart of the platform. Trust. Verification. Protection.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>What is Seven Shield?</h2>
            <p>
              Seven Shield is not a logo. It's not decoration. It's the promise 
              that every transaction on The Seven Rand Marketplace is protected.
            </p>
            <p>
              When you see the Emerald Green Shield, you know you're dealing with 
              a verified seller. You know your purchase is protected. You know 
              you can buy with confidence.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What Seven Shield Provides</h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <img 
                  src={sevenShieldIcon} 
                  alt="Seven Shield" 
                  className={styles.cardIcon}
                />
                <h3>Verified Identity</h3>
                <p>Sellers are verified through mobile and email confirmation.</p>
              </div>
              <div className={styles.card}>
                <img 
                  src={sevenShieldIcon} 
                  alt="Seven Shield" 
                  className={styles.cardIcon}
                />
                <h3>Buyer Protection</h3>
                <p>Every transaction is covered by our Buyer Promise policy.</p>
              </div>
              <div className={styles.card}>
                <img 
                  src={sevenShieldIcon} 
                  alt="Seven Shield" 
                  className={styles.cardIcon}
                />
                <h3>Seller Reputation</h3>
                <p>Trust scores build naturally through honest transactions.</p>
              </div>
              <div className={styles.card}>
                <img 
                  src={sevenShieldIcon} 
                  alt="Seven Shield" 
                  className={styles.cardIcon}
                />
                <h3>Verified Contact</h3>
                <p>Safe Verified Contact ensures you reach a real, verified seller.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Trust Cannot Be Bought</h2>
            <p>
              <strong>This is absolute.</strong> Trust cannot be purchased. 
              Verification cannot be purchased. Marketplace Scores cannot be purchased. 
              Seven Shield cannot be purchased.
            </p>
            <p>
              Featured Listings never affect trust. Advertising never affects trust. 
              Trust must always be earned through honest transactions and verified identity.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Shield Levels</h2>
            <div className={styles.levels}>
              {/* Verified - Green Shield */}
              <div className={`${styles.level} ${styles.verified}`}>
                <img 
                  src={sevenShieldIcon} 
                  alt="Verified" 
                  className={styles.levelIcon}
                />
                <div>
                  <h4>Verified</h4>
                  <p>Full verification complete. Identity confirmed.</p>
                </div>
              </div>
              {/* Pending - Orange Shield */}
              <div className={`${styles.level} ${styles.pending}`}>
                <img 
                  src={sevenShieldIcon} 
                  alt="Pending Verification" 
                  className={styles.levelIcon}
                />
                <div>
                  <h4>Pending Verification</h4>
                  <p>Verification in progress. Seller is being checked.</p>
                </div>
              </div>
              {/* Unverified - Red Shield */}
              <div className={`${styles.level} ${styles.unverified}`}>
                <img 
                  src={sevenShieldIcon} 
                  alt="Not Verified" 
                  className={styles.levelIcon}
                />
                <div>
                  <h4>Not Verified</h4>
                  <p>Seller has not completed verification process.</p>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.cta}>
            <p className={styles.ctaText}>
              "Trust is the foundation of every great deal."
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}