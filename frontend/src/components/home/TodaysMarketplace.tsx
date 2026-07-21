import { useEffect, useState } from "react";
import { Card, Container, Heading } from "../ui";
import { statsService } from "../../services/statsService";
import styles from "./TodaysMarketplace.module.css";

// Import your custom shield icon
import sevenShieldIcon from "../../assets/images/sevenshield.png";

interface MarketplaceStats {
    active_listings: number;
    new_today: number;
    verified_sellers: number;
    seven_shield_verified: number;
}

export default function TodaysMarketplace() {
    const [stats, setStats] = useState<MarketplaceStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getMarketplaceStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Dynamic stats from database
    const dynamicStats = stats ? [
        { value: stats.active_listings.toLocaleString(), label: "Active Listings" },
        { value: stats.new_today.toLocaleString(), label: "New Today" },
        { value: stats.verified_sellers.toLocaleString(), label: "Verified Sellers" },
        { value: `${Math.round((stats.seven_shield_verified / (stats.verified_sellers || 1)) * 100)}%`, label: "Seven Shield Verified" },
    ] : [];

    // Fixed fee stats (always shown)
    const feeStats = [
        { value: "R7", label: "Listing Fee" },
        { value: "R7", label: "Safe Verified Contact" },
    ];

    // Combine all stats
    const allStats = [...dynamicStats, ...feeStats];

    return (
        <section className={styles.section}>
            <Container>
                <div className={styles.header}>
                    <Heading as="h2" size="xl" align="center" className={styles.headingWithIcon}>
                        Today's Marketplace
                        <img 
                            src={sevenShieldIcon} 
                            alt="Seven Shield" 
                            className={styles.shieldIcon}
                        />
                    </Heading>
                    <p className={styles.subtitle}>
                        Live marketplace activity across South Africa.
                    </p>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading stats...</div>
                ) : (
                    <div className={styles.grid}>
                        {allStats.map((item) => (
                            <Card key={item.label} padding="large" shadow="medium">
                                <div className={styles.card}>
                                    <span className={styles.value}>{item.value}</span>
                                    <span className={styles.label}>{item.label}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
}