import type { ReactNode } from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  size?: "small" | "medium";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  size = "medium",
  className = "",
}: BadgeProps) {
  const classes = [
    styles.badge,
    styles[`variant${variant.charAt(0).toUpperCase()}${variant.slice(1)}`],
    styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}