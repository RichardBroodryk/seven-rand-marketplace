import { Badge } from "../ui";
import styles from "./ListingBadges.module.css";

interface ListingBadgesProps {
  featured?: boolean;
  premium?: boolean;
  verified?: boolean;
}

export default function ListingBadges({
  featured = false,
  premium = false,
  verified = false,
}: ListingBadgesProps) {
  return (
    <div className={styles.badges}>
      {featured && (
        <Badge variant="warning">
          ⭐ Featured
        </Badge>
      )}

      {premium && (
        <Badge variant="primary">
          💎 Premium
        </Badge>
      )}

      {verified && (
        <Badge variant="success">
          ✓ Verified
        </Badge>
      )}
    </div>
  );
}