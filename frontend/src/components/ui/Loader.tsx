import styles from "./Loader.module.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

export default function Loader({
  size = "medium",
  text = "Loading...",
}: LoaderProps) {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.spinner} ${styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`]}`}
      />

      <p className={styles.text}>{text}</p>
    </div>
  );
}