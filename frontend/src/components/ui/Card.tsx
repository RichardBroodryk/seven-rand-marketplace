import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "small" | "medium" | "large";
  shadow?: "none" | "small" | "medium" | "large";
}

export default function Card({
  children,
  className = "",
  padding = "medium",
  shadow = "medium",
}: CardProps) {
  const classes = [
    styles.card,
    styles[`padding${padding.charAt(0).toUpperCase()}${padding.slice(1)}`],
    styles[`shadow${shadow.charAt(0).toUpperCase()}${shadow.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}