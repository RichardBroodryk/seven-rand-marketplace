import { Container, Heading } from "../ui";
import styles from "./PricingExplanation.module.css";

// Import your custom shield icon
import sevenShieldIcon from "../../assets/images/sevenshield.png";

export default function PricingExplanation() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <Heading as="h2" size="xl" align="center" className={styles.headingWithIcon}>
            Simple, Transparent Pricing
            <img 
              src={sevenShieldIcon} 
              alt="Seven Shield" 
              className={styles.shieldIcon}
            />
          </Heading>
          <p className={styles.subtitle}>
            Know exactly what you'll pay before you post. No surprises. No hidden fees.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Standard Categories - R7 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.badge}>Standard</span>
              <span className={styles.price}>R7</span>
            </div>
            <h3 className={styles.cardTitle}>Standard Categories</h3>
            <ul className={styles.list}>
              <li>📱 Electronics</li>
              <li>🪑 Furniture</li>
              <li>🌿 Home & Garden</li>
              <li>👗 Fashion</li>
              <li>💄 Cosmetics & Beauty</li>
              <li>⚽ Sports</li>
              <li>💼 Jobs</li>
              <li>🛠️ Services</li>
              <li>🐶 Pets</li>
              <li>🎮 Gaming</li>
              <li>👶 Baby & Kids</li>
              <li>🔧 Tools & Equipment</li>
              <li>📦 Other</li>
            </ul>
            <div className={styles.cardFooter}>
              <span className={styles.feeLabel}>Seller Fee</span>
              <span className={styles.feeValue}>R7</span>
            </div>
          </div>

          {/* Premium Categories - R14 */}
          <div className={`${styles.card} ${styles.premium}`}>
            <div className={styles.cardHeader}>
              <span className={`${styles.badge} ${styles.badgePremium}`}>Premium</span>
              <span className={styles.price}>R14</span>
            </div>
            <h3 className={styles.cardTitle}>Premium Categories</h3>
            <ul className={styles.list}>
              <li>🚗 Vehicles</li>
              <li>🏡 Property</li>
              <li>🏗️ Commercial Equipment</li>
              <li>🚜 Farming</li>
              <li>📦 Business & Industrial</li>
              <li>⛵ Boating & Marine</li>
              <li>🚛 Trucks & Heavy Vehicles</li>
              <li>🏕️ Caravans & Camping</li>
              <li>🚲 Trailers</li>
            </ul>
            <div className={styles.cardFooter}>
              <span className={styles.feeLabel}>Seller Fee</span>
              <span className={styles.feeValue}>R14</span>
            </div>
            <div className={styles.premiumNote}>
              ⭐ Premium categories get higher visibility and priority placement.
            </div>
          </div>

          {/* Buyer Contact - R7 / FREE */}
          <div className={`${styles.card} ${styles.buyer}`}>
            <div className={styles.cardHeader}>
              <span className={`${styles.badge} ${styles.badgeBuyer}`}>Buyer</span>
              <span className={styles.price}>R7</span>
            </div>
            <h3 className={styles.cardTitle}>Safe Verified Contact</h3>
            <ul className={styles.list}>
              <li>✓ Verified Mobile Number</li>
              <li>✓ Verified Email</li>
              <li>✓ Seven Shield Protection</li>
              <li>✓ Seller Trust Status</li>
            </ul>
            <div className={styles.cardFooter}>
              <span className={styles.feeLabel}>Buyer Fee</span>
              <span className={styles.feeValue}>R7</span>
            </div>
            <div className={styles.buyerNote}>
              🔒 <strong>FREE</strong> on Premium Categories (Vehicles, Property, Commercial Equipment, Farming, Business & Industrial, Boating & Marine, Trucks, Caravans, Trailers)
            </div>
          </div>
        </div>

        <div className={styles.summary}>
          <p className={styles.summaryText}>
            <strong>💡 How it works:</strong> Sellers pay <strong>R7</strong> for standard listings or <strong>R14</strong> for premium listings. 
            Buyers pay <strong>R7</strong> for Safe Verified Contact on standard listings — <strong>FREE</strong> on premium listings.
          </p>
          <p className={styles.summarySub}>
            Every transaction is protected by Seven Shield. Every deal starts with trust.
          </p>
        </div>
      </Container>
    </section>
  );
}