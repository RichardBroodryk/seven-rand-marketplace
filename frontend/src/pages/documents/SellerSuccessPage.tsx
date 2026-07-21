import { Container, Heading } from "../../components/ui";
import styles from "./SellerSuccessPage.module.css";

export default function SellerSuccessPage() {
  return (
    <Container size="medium">
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.icon}>📈</div>
          <Heading as="h1" size="xl">Seller Success Centre</Heading>
          <p className={styles.subtitle}>
            Build trust. Sell faster. Grow your reputation.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>What Makes a Great Listing?</h2>
            <div className={styles.tips}>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>📷</span>
                <div>
                  <h3>Use High-Quality Photos</h3>
                  <p>Clear, well-lit photos show buyers exactly what they're getting. Include multiple angles and close-ups of important details.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>✍️</span>
                <div>
                  <h3>Write Honest Descriptions</h3>
                  <p>Be transparent about condition, age, and any flaws. Honesty builds trust and reduces buyer questions.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>💰</span>
                <div>
                  <h3>Price Fairly</h3>
                  <p>Research similar listings. Competitive pricing attracts buyers and speeds up your sale.</p>
                </div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>📱</span>
                <div>
                  <h3>Respond Quickly</h3>
                  <p>Fast responses build confidence. Buyers appreciate sellers who are available and communicative.</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>How Seven Shield Helps You</h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <span className={styles.cardIcon}>🛡️</span>
                <h3>Build Trust Instantly</h3>
                <p>The Seven Shield badge tells buyers you're verified. Trust starts before they even read your listing.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>⭐</span>
                <h3>Grow Your Reputation</h3>
                <p>Each successful sale increases your trust score. Good sellers get more visibility.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>📊</span>
                <h3>Track Your Performance</h3>
                <p>Your dashboard shows listing views, contact unlocks, and sales history. Know what works.</p>
              </div>
              <div className={styles.card}>
                <span className={styles.cardIcon}>🏆</span>
                <h3>Stand Out</h3>
                <p>Verified sellers with good reputations appear higher in search results. Trust is rewarded.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Your Seller Health Score</h2>
            <p>
              Your Seller Health Score reflects how well you're building trust on the platform.
            </p>
            <div className={styles.scoreFactors}>
              <div className={styles.factor}>
                <span>✓</span>
                <div>
                  <h4>Verification Status</h4>
                  <p>Verified sellers earn more trust</p>
                </div>
              </div>
              <div className={styles.factor}>
                <span>✓</span>
                <div>
                  <h4>Response Rate</h4>
                  <p>Quick responses build confidence</p>
                </div>
              </div>
              <div className={styles.factor}>
                <span>✓</span>
                <div>
                  <h4>Successful Sales</h4>
                  <p>Each deal builds your reputation</p>
                </div>
              </div>
              <div className={styles.factor}>
                <span>✓</span>
                <div>
                  <h4>Listing Quality</h4>
                  <p>Great photos and descriptions help buyers</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Pro Tips for Success</h2>
            <ul className={styles.list}>
              <li>✅ Complete your verification to earn the Seven Shield badge</li>
              <li>✅ Use all 5 image slots to show your item from every angle</li>
              <li>✅ Set a realistic price by researching similar listings</li>
              <li>✅ Respond to inquiries within 24 hours</li>
              <li>✅ Mark your listing as sold when the deal is complete</li>
              <li>✅ Use the dashboard to track your listing performance</li>
            </ul>
          </section>

          <div className={styles.cta}>
            <p className={styles.ctaText}>
              "Great sellers build trust. Trust builds great businesses."
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}