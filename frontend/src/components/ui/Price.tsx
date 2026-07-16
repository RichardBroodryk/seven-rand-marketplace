import styles from "./Price.module.css";

interface PriceProps {
  amount: number;
  size?: "small" | "medium" | "large";
  currency?: string;
}

export default function Price({
  amount,
  size = "medium",
  currency = "R",
}: PriceProps) {
  return (
    <span
      className={`${styles.price} ${styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`]}`}
    >
      {currency}
      {amount.toLocaleString("en-ZA")}
    </span>
  );
}