import { Routes, Route } from "react-router-dom";

import MarketplaceLayout from "../layouts/MarketplaceLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PostListingPage from "../pages/PostListingPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import ListingDetailPage from "../pages/ListingDetailPage";
import SearchPage from "../pages/SearchPage";
import CategoryPage from "../pages/CategoryPage";
import DashboardPage from "../pages/DashboardPage";
import FavouritesPage from "../pages/FavouritesPage";
import SavedSearchesPage from "../pages/SavedSearchesPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

// Trust & Documents Pages
import {
  WhySevenPage,
  SevenShieldPage,
  BuyerPromisePage,
  SafetyCentrePage,
  FraudPreventionPage,
  SellerSuccessPage,
  PrivacyPage,
  ResolutionCentrePage,
} from "../pages/documents";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes - No Layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Marketplace Routes - With Layout */}
      <Route element={<MarketplaceLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/post-ad" element={<PostListingPage />} />
        <Route path="/checkout/:listingId" element={<CheckoutPage />} />
        <Route path="/payment/success/:listingId" element={<PaymentSuccessPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/saved-searches" element={<SavedSearchesPage />} />

        {/* Trust & Documents Routes */}
        <Route path="/why-seven" element={<WhySevenPage />} />
        <Route path="/seven-shield" element={<SevenShieldPage />} />
        <Route path="/buyer-promise" element={<BuyerPromisePage />} />
        <Route path="/safety-centre" element={<SafetyCentrePage />} />
        <Route path="/fraud-prevention" element={<FraudPreventionPage />} />
        <Route path="/seller-success" element={<SellerSuccessPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/resolution-centre" element={<ResolutionCentrePage />} />
      </Route>
    </Routes>
  );
}