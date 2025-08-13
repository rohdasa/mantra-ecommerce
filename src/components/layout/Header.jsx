import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import { useAuthStore } from "../../store";
import getInitials from "../../utils/getInitials";
import { LocationContext } from "../../context/LocationContext";
import SearchBar from "../common/SearchBar";
import useEscapeKey from "../../hooks/useEscapeKey";
import useClickOutside from "../../hooks/useClickOutside";
import useCategories from "../../hooks/useCategories";

const Header = () => {
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();

  // Refs for click outside handling
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  // Get user's location
  const { address, locationError, getLocation } = useContext(LocationContext);

  // Get user data from store (we'll implement this later)
  const { user, isAuthenticated, logout } = useAuthStore();

  // Get Categories
  const { categories, loading: loadingCategories } = useCategories();

  //Setting a Dummy User for testing
  const handleLogin = () => {
    // Set a dummy user for testing
    useAuthStore.getState().setAuth(
      {
        name: "Arun Soman",
        email: "arunsmn@example.com",
      },
      "dummy-token"
    );
  };

  /**
   * Header Component with Navigation, Search, and User Actions
   *
   * Features:
   * - Responsive navigation
   * - Search functionality with suggestions
   * - User authentication state
   * - Shopping cart indicator
   * - Mobile menu
   * - Categories dropdown
   */
  // constants.js or directly in your component file (for now)

  // Close mobile menu when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  useEscapeKey(() => {
    setShowCategories(false);
    setShowUserMenu(false);
  });

  // Close categories dropdown on outside click
  useClickOutside(categoriesRef, () => setShowCategories(false));

  // Close user menu on outside click
  useClickOutside(userMenuRef, () => setShowUserMenu(false));

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar - Location & Offers */}
      <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            {!address ? (
              <div
                onClick={getLocation}
                style={{
                  cursor: "pointer",
                  color: "#007bff",
                  textDecoration: "underline",
                }}
                className="flex items-center space-x-2 text-gray-600"
              >
                <MapPin className="w-4 h-4" />
                <span>
                  {locationError ? locationError : "Tap to set location"}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{`Deliver to: ${address.city} ${address.pin}`}</span>
              </div>
            )}

            <div className="text-gray-600">
              Free shipping on orders above ₹999
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center md:mr-4">
          <button
            className="md:hidden p-2 -ml-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
          <div className="ml-2 md:ml-0">
            <Link to="/">
              <h1 className="text-2xl font-bold text-gradient-primary">
                MANTRA
              </h1>
            </Link>
            <p className="text-xs text-gray-500 hidden sm:block">
              Fashion & Lifestyle
            </p>
          </div>
        </div>

        {/* Categories Dropdown - Desktop*/}
        <div className="hidden lg:block relative" ref={categoriesRef}>
          <button
            className="flex items-center space-x-1 mr-4 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
            onClick={() => setShowCategories(!showCategories)}
            aria-expanded={showCategories}
            aria-haspopup="true"
            aria-controls="categories-menu"
            aria-label="Browse product categories"
          >
            <span>Categories</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showCategories && (
            <div
              id="categories-menu"
              className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
              role="menu"
              aria-label="Product categories"
            >
              {loadingCategories ? (
                <p className="px-4 py-2 text-sm text-gray-500">
                  Loading categories...
                </p>
              ) : (
                categories?.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                    onClick={() => setShowCategories(false)}
                    role="menuitem"
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Search bar */}
        <SearchBar />
        {/* Navigation Icons */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* Notifications - Hidden on mobile */}
          <button
            className="hidden md:flex items-center space-x-1 p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span
              className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              aria-hidden="true"
            >
              3
            </span>
          </button>

          {/* Wishlist */}
          <button
            className="flex items-center space-x-1 p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Wishlist</span>
            <span
              className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              aria-hidden="true"
            >
              2
            </span>
          </button>

          {/* Shopping Cart */}
          <button
            className="flex items-center space-x-1 p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all relative"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span
              className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              aria-hidden="true"
            >
              5
            </span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2" ref={userMenuRef}>
            {isAuthenticated ? (
              <button
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
                aria-controls="user-menu"
                aria-label={`User menu for ${user?.name || "User"}`}
              >
                <div
                  className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-sm font-medium text-white">
                    {getInitials(user?.name) || "User"}
                  </span>
                </div>
                <span className="hidden lg:inline">{user?.name || "User"}</span>
                <ChevronDown
                  className="w-4 h-4 hidden lg:inline"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button onClick={handleLogin} variant="outline" size="sm">
                  Login
                </Button>
                <Button size="sm" className="hidden sm:inline-flex">
                  Sign Up
                </Button>
              </div>
            )}
            {/* User Dropdown Menu */}
            {isAuthenticated && showUserMenu && (
              <div
                id="user-menu"
                className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2"
                role="menu"
                aria-label="User account menu"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  role="menuitem"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  role="menuitem"
                >
                  My Orders
                </Link>
                <Link
                  to="/addresses"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  role="menuitem"
                >
                  Addresses
                </Link>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-200"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <div className="px-4 py-3 space-y-3">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Categories
              </h3>
              <div className="space-y-1 ">
                {loadingCategories ? (
                  <p className="text-sm text-gray-500">Loading categories...</p>
                ) : (
                  categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 pt-3">
              <div className="space-y-1">
                <Link
                  to="/offers"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  Offers & Deals
                </Link>
                <Link
                  to="/new-arrivals"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  New Arrivals
                </Link>
                <Link
                  to="/trending"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  Trending
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
