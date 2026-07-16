import styles from "./SevenShield.module.css";

interface SevenShieldProps {
  status?: "verified" | "pending" | "unverified";
  score?: number;
}

export default function SevenShield({
  status = "verified",
  score,
}: SevenShieldProps) {
  const statusText = {
    verified: "Verified",
    pending: "Pending Verification",
    unverified: "Not Verified",
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon}>🛡️</div>

      <div className={styles.content}>
        <div className={styles.title}>Seven Shield</div>

        <div
          className={`${styles.status} ${styles[status]}`}
        >
          {statusText[status]}
        </div>

        {score !== undefined && (
          <div className={styles.score}>
            Trust Score: {score}
          </div>
        )}
      </div>
    </div>
  );
}