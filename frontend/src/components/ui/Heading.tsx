import type { ReactNode } from "react";
import styles from "./Heading.module.css";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
  children: ReactNode;
  as?: HeadingLevel;
  size?: "display" | "xl" | "lg" | "md" | "sm";
  align?: "left" | "center" | "right";
  className?: string;
}

export default function Heading({
  children,
  as = "h2",
  size = "lg",
  align = "left",
  className = "",
}: HeadingProps) {
  const Tag = as;

  const classes = [
    styles.heading,
    styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
    styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}