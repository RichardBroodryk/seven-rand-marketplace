import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Heading, PrimaryButton, Loader, Badge, Price } from "../components/ui";
import { dashboardService } from "../services/dashboardService";
import { qualityService } from "../services/qualityService";
import type { Listing } from "../types/Listing";
import styles from "./DashboardPage.module.css";

interface DashboardStats {
    total: number;
    published: number;
    pending: number;
    total_views: number;
    total_contact_unlocks: number;
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [editing, setEditing] = useState<Listing | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const limit = 10;

    const fetchDashboardData = async (newOffset = 0) => {
        setLoading(true);
        try {
            const [statsData, listingsData] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getMyListings({
                    limit,
                    offset: newOffset,
                    status: statusFilter,
                    sort_by: "newest",
                }),
            ]);

            setStats(statsData);

            if (newOffset === 0) {
                setListings(listingsData.data);
            } else {
                setListings((prev) => [...prev, ...listingsData.data]);
            }

            setHasMore(listingsData.pagination.hasMore);
            setOffset(newOffset);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData(0);
    }, [statusFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        setDeleting(id);
        try {
            await dashboardService.deleteListing(id);
            fetchDashboardData(0);
        } catch (error) {
            console.error("Failed to delete listing:", error);
            alert("Failed to delete listing. Please try again.");
        } finally {
            setDeleting(null);
        }
    };

    const handleEdit = (listing: Listing) => {
        setEditing(listing);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        setEditLoading(true);
        try {
            await dashboardService.updateListing(editing.id, {
                title: editing.title,
                description: editing.description,
                price: editing.price,
                province: editing.province,
                city: editing.city,
                category_id: editing.category_id,
            });
            setEditing(null);
            fetchDashboardData(0);
        } catch (error) {
            console.error("Failed to update listing:", error);
            alert("Failed to update listing. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleMarkAsSold = async (id: string) => {
        if (!confirm("Mark this listing as sold? 🎉")) return;
        setActionLoading(id);
        try {
            await qualityService.markAsSold(id);
            fetchDashboardData(0);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to mark as sold.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRenew = async (id: string) => {
        if (!confirm("Renew this listing? It will move back to the top.")) return;
        setActionLoading(id);
        try {
            await qualityService.renewListing(id);
            fetchDashboardData(0);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to renew listing.");
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge variant="success">Published</Badge>;
            case "pending_payment":
                return <Badge variant="warning">Pending Payment</Badge>;
            case "sold":
                return <Badge variant="neutral">Sold</Badge>;
            default:
                return <Badge variant="neutral">{status}</Badge>;
        }
    };

    if (loading && offset === 0) {
        return (
            <Container size="large">
                <div className={styles.loadingContainer}>
                    <Loader size="large" />
                    <p>Loading dashboard...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container size="large">
            <div className={styles.page}>
                <div className={styles.header}>
                    <Heading as="h1" size="xl">Seller Dashboard</Heading>
                    <PrimaryButton onClick={() => navigate("/post-ad")}>
                        + Post New Ad
                    </PrimaryButton>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.total}</span>
                            <span className={styles.statLabel}>Total Listings</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.published}</span>
                            <span className={styles.statLabel}>Published</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.pending}</span>
                            <span className={styles.statLabel}>Pending Payment</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.total_views}</span>
                            <span className={styles.statLabel}>Total Views</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.total_contact_unlocks}</span>
                            <span className={styles.statLabel}>Contact Unlocks</span>
                        </div>
                    </div>
                )}

                {/* Filter */}
                <div className={styles.filterBar}>
                    <label>Filter by status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="all">All Listings</option>
                        <option value="published">Published</option>
                        <option value="pending_payment">Pending Payment</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>

                {/* Listings Table */}
                <div className={styles.tableContainer}>
                    {listings.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No listings found.</p>
                            <p className={styles.emptySubtext}>
                                Create your first listing by posting an ad!
                            </p>
                            <PrimaryButton onClick={() => navigate("/post-ad")}>
                                Post an Ad
                            </PrimaryButton>
                        </div>
                    ) : (
                        <>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Views</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listings.map((listing) => (
                                            <tr key={listing.id}>
                                                <td className={styles.titleCell}>
                                                    <span>{listing.title}</span>
                                                </td>
                                                <td>{listing.category_id}</td>
                                                <td>
                                                    <Price amount={listing.price} />
                                                </td>
                                                <td>{getStatusBadge(listing.status)}</td>
                                                <td>{listing.views || 0}</td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <button
                                                            className={styles.editButton}
                                                            onClick={() => handleEdit(listing)}
                                                        >
                                                            Edit
                                                        </button>
                                                        {listing.status === "published" && (
                                                            <button
                                                                className={styles.soldButton}
                                                                onClick={() => handleMarkAsSold(listing.id)}
                                                                disabled={actionLoading === listing.id}
                                                            >
                                                                {actionLoading === listing.id ? "..." : "Sold"}
                                                            </button>
                                                        )}
                                                        <button
                                                            className={styles.renewButton}
                                                            onClick={() => handleRenew(listing.id)}
                                                            disabled={actionLoading === listing.id}
                                                        >
                                                            {actionLoading === listing.id ? "..." : "Renew"}
                                                        </button>
                                                        <button
                                                            className={styles.deleteButton}
                                                            onClick={() => handleDelete(listing.id)}
                                                            disabled={deleting === listing.id}
                                                        >
                                                            {deleting === listing.id ? "..." : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {hasMore && (
                                <div className={styles.loadMore}>
                                    <PrimaryButton
                                        onClick={() => fetchDashboardData(offset + limit)}
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Load More"}
                                    </PrimaryButton>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Edit Modal */}
                {editing && (
                    <div className={styles.modalOverlay} onClick={() => setEditing(null)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <h2>Edit Listing</h2>
                            <form onSubmit={handleEditSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={editing.title}
                                        onChange={(e) =>
                                            setEditing({ ...editing, title: e.target.value })
                                        }
                                        className={styles.formInput}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        value={editing.description}
                                        onChange={(e) =>
                                            setEditing({ ...editing, description: e.target.value })
                                        }
                                        className={styles.formTextarea}
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Price (R)</label>
                                        <input
                                            type="number"
                                            value={editing.price}
                                            onChange={(e) =>
                                                setEditing({ ...editing, price: Number(e.target.value) })
                                            }
                                            className={styles.formInput}
                                            required
                                            min="0.01"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Category</label>
                                        <select
                                            value={editing.category_id}
                                            onChange={(e) =>
                                                setEditing({ ...editing, category_id: Number(e.target.value) })
                                            }
                                            className={styles.formInput}
                                            required
                                        >
                                            <option value="1">Vehicles</option>
                                            <option value="2">Property</option>
                                            <option value="3">Commercial Equipment</option>
                                            <option value="4">Electronics</option>
                                            <option value="5">Furniture</option>
                                            <option value="6">Home & Garden</option>
                                            <option value="7">Fashion</option>
                                            <option value="8">Sports</option>
                                            <option value="9">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Province</label>
                                        <input
                                            type="text"
                                            value={editing.province || ""}
                                            onChange={(e) =>
                                                setEditing({ ...editing, province: e.target.value })
                                            }
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>City</label>
                                        <input
                                            type="text"
                                            value={editing.city || ""}
                                            onChange={(e) =>
                                                setEditing({ ...editing, city: e.target.value })
                                            }
                                            className={styles.formInput}
                                        />
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={() => setEditing(null)}
                                    >
                                        Cancel
                                    </button>
                                    <PrimaryButton type="submit" disabled={editLoading}>
                                        {editLoading ? "Saving..." : "Save Changes"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}