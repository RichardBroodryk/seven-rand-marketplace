import { Container, Heading } from "../../components/ui";
import styles from "./BuyerPromisePage.module.css";

export default function BuyerPromisePage() {
  return (
    <Container size="medium">
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.icon}>🤝</div>
          <Heading as="h1" size="xl">Buyer Promise</Heading>
          <p className={styles.subtitle}>
            Your trust is our priority. Here's what we guarantee.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Our Commitment to You</h2>
            <p>
              When you buy on The Seven Rand Marketplace, you're not just getting 
              a product. You're getting the peace of mind that comes with 
              Seven Shield protection.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What We Promise</h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <span className={styles.cardIcon}>🛡️</span>
                <h3>Seven Shield Protection</h3>
                <p>Every transaction is backed by Seven Shield. You buy with confidence.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>✓</span>
                <h3>Verified Sellers</h3>
                <p>All sellers are verified through mobile and email confirmation.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>📱</span>
                <h3>Safe Verified Contact</h3>
                <p>You receive verified contact details for every purchase.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>💰</span>
                <h3>Fair Resolution</h3>
                <p>If something goes wrong, we help resolve it fairly.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>When We Protect You</h2>
            <ul className={styles.list}>
              <li>✓ The seller's contact details are invalid or don't work</li>
              <li>✓ The listing was already sold before you paid</li>
              <li>✓ Fraud or scam is confirmed</li>
              <li>✓ The item is significantly different from the listing description</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Our Policy</h2>
            <p>
              Trust is more valuable than any fee. If any of the above situations occur, 
              we work with you to resolve the issue fairly. We don't hide behind fine print.
            </p>
            <p>
              <strong>Every deal starts with trust.</strong> That's our promise to you.
            </p>
          </section>

          <div className={styles.cta}>
            <p className={styles.ctaText}>
              "Buy with confidence. Buy with trust."
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}