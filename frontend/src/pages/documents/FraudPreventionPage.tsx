import { Container, Heading } from "../../components/ui";
import styles from "./FraudPreventionPage.module.css";

export default function FraudPreventionPage() {
  return (
    <Container size="medium">
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.icon}>🚫</div>
          <Heading as="h1" size="xl">Fraud Prevention</Heading>
          <p className={styles.subtitle}>
            Knowledge is your best defence. Learn how to spot and avoid scams.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Common Scams to Avoid</h2>
            <div className={styles.scam}>
              <h3>🔄 Overpayment Scams</h3>
              <p>Buyer sends more than the asking price and asks for the excess to be returned. The original payment is often fraudulent.</p>
            </div>
            <div className={styles.scam}>
              <h3>📧 Phishing Attempts</h3>
              <p>Scammers impersonate the marketplace to steal login details. Always check the sender's email address.</p>
            </div>
            <div className={styles.scam}>
              <h3>💰 Fake Payment Confirmation</h3>
              <p>Scammers send fake payment receipts. Always verify payment through the platform.</p>
            </div>
            <div className={styles.scam}>
              <h3>📱 Personal Contact Requests</h3>
              <p>Scammers ask to communicate outside the platform. Always use Safe Verified Contact.</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>How Seven Shield Protects You</h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <span className={styles.cardIcon}>✓</span>
                <h3>Seller Verification</h3>
                <p>All sellers are verified through mobile and email confirmation.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>🛡️</span>
                <h3>Transaction Monitoring</h3>
                <p>Suspicious activity is flagged and investigated.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>📱</span>
                <h3>Safe Communication</h3>
                <p>All contact happens through Safe Verified Contact.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>🤝</span>
                <h3>Resolution Support</h3>
                <p>If something goes wrong, we help you resolve it.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Warning Signs</h2>
            <ul className={styles.list}>
              <li>⚠️ Seller asks for payment via gift cards or wire transfer</li>
              <li>⚠️ Listing has no photos or uses stock images</li>
              <li>⚠️ Seller refuses to meet in person for local items</li>
              <li>⚠️ Urgent "must sell today" pressure tactics</li>
              <li>⚠️ Seller creates multiple accounts with similar listings</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>What to Do If You Suspect Fraud</h2>
            <ol className={styles.list}>
              <li>Stop all communication with the seller</li>
              <li>Do not make any payments</li>
              <li>Report the listing immediately</li>
              <li>Contact Seven Shield support</li>
              <li>Document everything (screenshots, emails, messages)</li>
            </ol>
          </section>
        </div>
      </div>
    </Container>
  );
}