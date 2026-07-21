import { Container, Heading } from "../../components/ui";
import styles from "./WhySevenPage.module.css";

// Import your custom shield icon
import sevenShieldIcon from "../../assets/images/sevenshield.png";

export default function WhySevenPage() {
  return (
    <Container size="medium">
      <div className={styles.page}>
        <div className={styles.header}>
          <img 
            src={sevenShieldIcon} 
            alt="Seven Shield" 
            className={styles.icon}
          />
          <Heading as="h1" size="xl">Why Seven?</Heading>
          <p className={styles.subtitle}>
            Seven represents trust. Seven represents safety. Seven represents a better way to buy and sell.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Built for South Africa</h2>
            <p>
              The Seven Rand Marketplace was created with one simple belief: 
              buying and selling in South Africa should feel safe, simple, and transparent.
            </p>
            <p>
              We saw too many people worried about scams, fake listings, and 
              unreliable sellers. We knew there had to be a better way.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Trust is the Foundation</h2>
            <p>
              Most marketplaces focus on quantity. We focus on quality. 
              Every listing on The Seven Rand Marketplace comes with Seven Shield protection.
            </p>
            <p>
              When you see the Seven Shield badge, you know the seller has been verified.
              You know your transaction is protected. You know you can buy with confidence.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Smaller Fee. Bigger Deals.</h2>
            <p>
              Our tagline isn't just marketing. It's our promise. We keep fees low 
              because we believe trust should be accessible to everyone.
            </p>
            <p>
              For R7, a seller gets a protected listing. For R7, a buyer gets 
              verified contact details. Small fee. Bigger deals. Simple.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Our Mission</h2>
            <p>
              <strong>To become South Africa's safest and most trusted online marketplace.</strong>
            </p>
            <p>
              Every feature we build, every decision we make, and every interaction 
              we design is guided by this mission. We're not building another classifieds 
              website. We're building a trust marketplace.
            </p>
          </section>

          <div className={styles.cta}>
            <p className={styles.ctaText}>
              "Every deal starts with trust."
            </p>
            <p className={styles.ctaSub}>
              — The Seven Rand Marketplace Promise
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}