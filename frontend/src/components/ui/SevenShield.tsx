import SevenShieldIcon from "./SevenShieldIcon";
import styles from "./SevenShield.module.css";

interface SevenShieldProps {
  className?: string;
  status?: "verified" | "pending" | "unverified";
  score?: number;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}

export default function SevenShield({
  className = "",
  status = "verified",
  score,
  size = "medium",
  showLabel = true,
}: SevenShieldProps) {
  const statusText = {
    verified: "Verified Seller",
    pending: "Pending Verification",
    unverified: "Not Verified",
  };

  const statusColor = {
    verified: styles.verified,
    pending: styles.pending,
    unverified: styles.unverified,
  };

  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  const getTrustMessage = () => {
    switch (status) {
      case "verified":
        return "This seller has been verified. Trust is confirmed.";
      case "pending":
        return "Verification in progress. Trust is being built.";
      case "unverified":
        return "This seller has not been verified yet. Verify before transacting.";
      default:
        return "";
    }
  };

  return (
    <div className={`${styles.container} ${sizeClass[size]} ${className}`}>
      <SevenShieldIcon status={status} size={size} />

      <div className={styles.content}>
        <div className={styles.title}>Seven Shield</div>
        {showLabel && (
          <div className={`${styles.status} ${statusColor[status]}`}>
            {statusText[status]}
          </div>
        )}
        {score !== undefined && score > 0 && (
          <div className={styles.score}>
            <span className={styles.scoreLabel}>Trust Score</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
        )}
        <div className={styles.trustMessage}>{getTrustMessage()}</div>
      </div>
    </div>
  );
}