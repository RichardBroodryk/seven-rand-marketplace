import { useState, useEffect } from "react";
import { qualityService } from "../../services/qualityService";
import styles from "./ListingQuality.module.css";

interface ListingQualityProps {
    listingId: string;
    onClose?: () => void;
}

export default function ListingQuality({ listingId, onClose }: ListingQualityProps) {
    const [quality, setQuality] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuality = async () => {
            try {
                const data = await qualityService.getListingQuality(listingId);
                setQuality(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load quality.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuality();
    }, [listingId]);

    if (loading) {
        return <div className={styles.loading}>Loading quality score...</div>;
    }

    if (error || !quality) {
        return <div className={styles.error}>Could not load quality score.</div>;
    }

    const getLevelEmoji = (level: string) => {
        switch (level) {
            case "Excellent":
                return "🌟";
            case "Good":
                return "👍";
            default:
                return "📝";
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Excellent":
                return styles.excellent;
            case "Good":
                return styles.good;
            default:
                return styles.needsImprovement;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>📊 Listing Quality Score</h3>
                {onClose && (
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                )}
            </div>

            <div className={styles.scoreSection}>
                <div className={`${styles.scoreCircle} ${getLevelColor(quality.level)}`}>
                    <span className={styles.scoreNumber}>{quality.score}</span>
                    <span className={styles.scoreLabel}>/ 100</span>
                </div>
                <div className={styles.levelSection}>
                    <span className={styles.levelEmoji}>{getLevelEmoji(quality.level)}</span>
                    <span className={`${styles.levelText} ${getLevelColor(quality.level)}`}>
                        {quality.level}
                    </span>
                </div>
            </div>

            <div className={styles.feedbackSection}>
                <h4>How to improve:</h4>
                <ul className={styles.feedbackList}>
                    {quality.feedback.map((item: string, index: number) => (
                        <li key={index} className={styles.feedbackItem}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.tip}>
                💡 Better quality listings get more views and sell faster.
            </div>
        </div>
    );
}