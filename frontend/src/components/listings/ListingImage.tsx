import styles from "./ListingImage.module.css";

interface ListingImageProps {
  image: string;
  title: string;
}

export default function ListingImage({
  image,
  title,
}: ListingImageProps) {
  if (!image) {
    return (
      <div className={styles.placeholder}>
        No Image Available
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={title}
      className={styles.image}
      loading="lazy"
    />
  );
}