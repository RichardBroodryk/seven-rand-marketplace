import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, PrimaryButton } from "../ui";
import styles from "./MarketplaceHeader.module.css";

// Import your custom shield icon
import sevenShieldIcon from "../../assets/images/sevenshield.png";

export default function MarketplaceHeader() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className={styles.header}>
      <Container size="large">
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <img 
              src={sevenShieldIcon} 
              alt="Seven Shield" 
              className={styles.logoIcon}
            />
            <div>
              <div className={styles.brand}>
                Seven Rand Marketplace
              </div>
              <div className={styles.tagline}>
                Smaller Fee. Bigger Deals.
              </div>
            </div>
          </Link>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </form>

          <nav className={styles.actions}>
            {isLoggedIn ? (
              <>
                <Link to="/favourites" className={styles.navLink}>
                  <span className={styles.heartIcon}>♥</span>
                  <span>Favourites</span>
                </Link>
                <Link to="/saved-searches" className={styles.navLink}>
                  <span>🔍</span>
                  <span>Saved</span>
                </Link>
                <Link to="/dashboard" className={styles.navLink}>
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>
                <Link to="/post-ad" className={styles.postLink}>
                  <PrimaryButton size="small">Post an Ad</PrimaryButton>
                </Link>
                <button onClick={handleLogout} className={styles.logout}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.login}>
                  Sign In
                </Link>
                <Link to="/post-ad">
                  <PrimaryButton size="small">Post an Ad</PrimaryButton>
                </Link>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}