import { Container, Heading } from "../ui";
import styles from "./SevenShieldSection.module.css";

// Import your custom shield icon
import sevenShieldIcon from "../../assets/images/sevenshield.png";

export default function SevenShieldSection() {
  const trustItems = [
    {
      title: "Verification",
      description: "Every seller is verified through mobile and email confirmation.",
    },
    {
      title: "Trust Score",
      description: "Sellers build reputation through honest transactions.",
    },
    {
      title: "Buyer Protection",
      description: "Every transaction is protected by our Buyer Promise.",
    },
    {
      title: "Safe Verified Contact",
      description: "Get verified contact details for every purchase.",
    },
  ];

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <Heading as="h2" size="xl" align="center" className={styles.headingWithIcon}>
            Seven Shield
            <img 
              src={sevenShieldIcon} 
              alt="Seven Shield" 
              className={styles.shieldIcon}
            />
          </Heading>
          <p className={styles.subtitle}>
            Trust is the heart of every transaction.
          </p>
        </div>

        <div className={styles.grid}>
          {trustItems.map((item, index) => (
            <div key={index} className={styles.card}>
              <img 
                src={sevenShieldIcon} 
                alt="Seven Shield" 
                className={styles.cardIcon}
              />
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}