import type { ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "small" | "medium" | "large" | "full";
}

export default function Container({
  children,
  className = "",
  size = "large",
}: ContainerProps) {
  const classes = [
    styles.container,
    styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}