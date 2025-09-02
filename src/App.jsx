// App.jsx
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/HomePage";
import { Route, Routes, useLocation } from "react-router-dom";
import ProductDetail from "./pages/ProductDetailPage";
import SearchResults from "./pages/SearchResultsPage";
import CategoryPage from "./pages/CategoryPage";
import LoginModal from "./components/auth/LoginModal";
import ProfileSetupModal from "./components/auth/ProfileSetupModal";
import VerifyOtpModal from "./components/auth/VerifyOtpModal";
import { useEffect, useState } from "react";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import ProductsPage from "./pages/ProductsPage";
import NotFound from "./pages/NotFoundPage";
import useAuthStore from "./store/authStore";
import { initializeCartStore } from "./store/cartStore";
import { initializeWishlistStore } from "./store/wishlistStore";
import Loading from "./components/ui/Loading";

function App() {
  const [activeModal, setActiveModal] = useState(null); // 'login', 'verify-otp', 'profile-setup'
  const user = useAuthStore((state) => state.user);
  const { isAuthenticated } = useAuthStore();
  const [storesReady, setStoresReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      initializeCartStore(user.id);
      initializeWishlistStore(user.id);
      setStoresReady(true);
    } else {
      // If user is not authenticated, we still want to stop the loading screen
      setStoresReady(true);
    }
  }, [isAuthenticated, user?.id]);

  if (!storesReady) {
    return <Loading />;
  }

  // Function to handle modal closure
  const closeModal = () => {
    setActiveModal(null);
  };

  // Function to handle the state transitions
  const handleLoginSuccess = () => {
    setActiveModal("verify-otp");
  };

  const handleVerifySuccess = (isNewUser) => {
    if (isNewUser) {
      setActiveModal("profile-setup");
    } else {
      closeModal();
      // Optionally, you can navigate here after a successful login
      // For example, navigate to a user profile page
      // navigate('/profile');
    }
  };

  const handleBack = () => {
    if (activeModal === "verify-otp") {
      setActiveModal("login");
    }
  };

  const handleProfileSetupClose = () => {
    closeModal();
  };

  return (
    <div className="App">
      {/* Pass the handler to the Header */}
      <Header onOpenLogin={() => setActiveModal("login")} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/products/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route
            path="/wishlist"
            element={
              <WishlistPage onOpenLogin={() => setActiveModal("login")} />
            }
          />
          <Route
            path="/cart"
            element={<CartPage onOpenLogin={() => setActiveModal("login")} />}
          />
          <Route
            path="/profile"
            element={<div>Profile Page (Coming Soon)</div>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Conditional rendering based on state */}
        {activeModal === "login" && (
          <LoginModal
            isOpen={activeModal === "login"} // <- required for the Modal component inside LoginModal
            onClose={closeModal}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {activeModal === "verify-otp" && (
          <VerifyOtpModal
            onClose={closeModal}
            onVerifySuccess={handleVerifySuccess}
            onBack={handleBack}
          />
        )}
        {activeModal === "profile-setup" && (
          <ProfileSetupModal onClose={handleProfileSetupClose} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
