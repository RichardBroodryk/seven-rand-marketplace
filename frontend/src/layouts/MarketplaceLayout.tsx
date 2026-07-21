import { Outlet } from "react-router-dom";
import { MarketplaceHeader } from "../components/layouts";
import Footer from "../components/layouts/Footer";
import styles from "./MarketplaceLayout.module.css";

export default function MarketplaceLayout() {
  return (
    <div className={styles.layout}>
      <MarketplaceHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}