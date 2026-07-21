import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Heading, Loader, PrimaryButton } from "../components/ui";
import { ListingCard } from "../components/listings";
import { favouriteService } from "../services/favouriteService";
import styles from "./FavouritesPage.module.css";

interface Favourite {
    id: string;
    title: string;
    description: string;
    price: number;
    province: string;
    city: string;
    status: string;
    category_name: string;
    images: { url: string }[];
    favourited_at: string;
}

export default function FavouritesPage() {
    const navigate = useNavigate();
    const [favourites, setFavourites] = useState<Favourite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const data = await favouriteService.getFavourites();
                setFavourites(data);
            } catch (error) {
                console.error("Failed to fetch favourites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavourites();
    }, []);

    if (loading) {
        return (
            <Container size="large">
                <div className={styles.loadingContainer}>
                    <Loader size="large" />
                    <p>Loading your favourites...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container size="large">
            <div className={styles.page}>
                <div className={styles.header}>
                    <Heading as="h1" size="xl">❤️ My Favourites</Heading>
                    <p className={styles.subtitle}>
                        Listings you've saved for later.
                    </p>
                </div>

                {favourites.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No favourites yet.</p>
                        <p className={styles.emptySubtext}>
                            Start exploring and save listings you love!
                        </p>
                        <PrimaryButton onClick={() => navigate("/")}>
                            Browse Marketplace
                        </PrimaryButton>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {favourites.map((listing) => (
                            <ListingCard key={listing.id} listing={listing as any} />
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
}