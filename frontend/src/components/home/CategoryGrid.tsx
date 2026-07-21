import { Link } from "react-router-dom";
import { Card, Container, Heading } from "../ui";
import styles from "./CategoryGrid.module.css";

// Import your custom shield icon
import sevenShieldIcon from "../../assets/images/sevenshield.png";

const categories = [
  // Premium Categories
  { icon: "🚗", title: "Vehicles", slug: "vehicles" },
  { icon: "🏡", title: "Property", slug: "property" },
  { icon: "🏗️", title: "Commercial Equipment", slug: "commercial-equipment" },
  { icon: "🚜", title: "Farming", slug: "farming" },
  { icon: "📦", title: "Business & Industrial", slug: "business-industrial" },
  { icon: "⛵", title: "Boating & Marine", slug: "boating-marine" },
  { icon: "🚛", title: "Trucks & Heavy Vehicles", slug: "trucks-heavy" },
  { icon: "🏕️", title: "Caravans & Camping", slug: "caravans-camping" },
  { icon: "🚲", title: "Trailers", slug: "trailers" },

  // Standard Categories
  { icon: "📱", title: "Electronics", slug: "electronics" },
  { icon: "🪑", title: "Furniture", slug: "furniture" },
  { icon: "🌿", title: "Home & Garden", slug: "home-garden" },
  { icon: "👗", title: "Fashion", slug: "fashion" },
  { icon: "💄", title: "Cosmetics & Beauty", slug: "cosmetics-beauty" },
  { icon: "⚽", title: "Sports", slug: "sports" },
  { icon: "📦", title: "Other", slug: "other" },
  { icon: "💼", title: "Jobs", slug: "jobs" },
  { icon: "🛠️", title: "Services", slug: "services" },
  { icon: "🐶", title: "Pets", slug: "pets" },
  { icon: "🎮", title: "Gaming", slug: "gaming" },
  { icon: "👶", title: "Baby & Kids", slug: "baby-kids" },
  { icon: "🔧", title: "Tools & Equipment", slug: "tools-equipment" },
];

export default function CategoryGrid() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <Heading as="h2" size="xl" align="center" className={styles.headingWithIcon}>
            Browse Categories
            <img 
              src={sevenShieldIcon} 
              alt="Seven Shield" 
              className={styles.shieldIcon}
            />
          </Heading>
          <p className={styles.subtitle}>
            Find what you're looking for across South Africa.
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.title}
              to={`/category/${category.slug}`}
              className={styles.link}
            >
              <Card padding="large" shadow="medium" className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.icon}>{category.icon}</div>
                  <h3>{category.title}</h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}