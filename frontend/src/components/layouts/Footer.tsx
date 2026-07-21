import { Link } from "react-router-dom";
import { Container } from "../ui";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container size="large">
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.title}>The Seven Rand Marketplace</h3>
            <p className={styles.tagline}>Smaller Fee. Bigger Deals.</p>
            <p className={styles.promise}>Every Deal Starts With Trust.</p>
          </div>

          <div className={styles.column}>
            <h4>About</h4>
            <Link to="/why-seven" className={styles.link}>Why Seven?</Link>
            <Link to="/seven-shield" className={styles.link}>Seven Shield</Link>
            <Link to="/buyer-promise" className={styles.link}>Buyer Promise</Link>
          </div>

          <div className={styles.column}>
            <h4>Safety</h4>
            <Link to="/safety-centre" className={styles.link}>Safety Centre</Link>
            <Link to="/fraud-prevention" className={styles.link}>Fraud Prevention</Link>
            <Link to="/resolution-centre" className={styles.link}>Resolution Centre</Link>
          </div>

          <div className={styles.column}>
            <h4>Support</h4>
            <Link to="/seller-success" className={styles.link}>Seller Success</Link>
            <Link to="/privacy" className={styles.link}>Privacy & Data</Link>
            <Link to="/safety-centre" className={styles.link}>Contact Support</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} The Seven Rand Marketplace. All rights reserved.</p>
          <p className={styles.trust}>Built on trust. Powered by Seven Shield.</p>
        </div>
      </Container>
    </footer>
  );
}