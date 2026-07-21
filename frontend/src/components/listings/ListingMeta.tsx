import styles from "./ListingMeta.module.css";

interface ListingMetaProps {
  location: string;
  postedDate: string;
  views: number;
}

export default function ListingMeta({
  location,
  postedDate,
  views,
}: ListingMetaProps) {
  return (
    <div className={styles.meta}>
      <div className={styles.row}>
        <span>📍 {location}</span>
        <span>{postedDate}</span>
      </div>

      <div className={styles.views}>
        👁 {views.toLocaleString()} views
      </div>
    </div>
  );
}