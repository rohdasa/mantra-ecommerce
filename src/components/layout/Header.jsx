import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import Button from "../ui/Button";
import { useAuthStore } from "../../store";
import getInitials from "../../utils/getInitials";
import { LocationContext } from "../../context/LocationContext";

const PRODUCT_CATEGORIES = [
  {
    id: 1,
    name: "Men's Fashion",
    slug: "mens-fashion",
  },
  {
    id: 2,
    name: "Women's Fashion",
    slug: "womens-fashion",
  },
  {
    id: 3,
    name: "Electronics",
    slug: "electronics",
  },
  {
    id: 4,
    name: "Home & Kitchen",
    slug: "home-kitchen",
  },
  {
    id: 5,
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
  },
  {
    id: 6,
    name: "Sports & Fitness",
    slug: "sports-fitness",
  },
  {
    id: 7,
    name: "Books & Stationery",
    slug: "books-stationery",
  },
  {
    id: 8,
    name: "Mobiles & Accessories",
    slug: "mobiles-accessories",
  },
];

// Mock search suggestions (later we'll fetch from API)
const MOCK_SUGGESTIONS = [
  "iPhone 15",
  "Nike Air Max",
  "Samsung Galaxy",
  "Adidas Shoes",
  "MacBook Pro",
];

const Header = () => {
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { address } = useContext(LocationContext);

  // Refs for click outside handling
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  // Get user data from store (we'll implement this later)
  const { user, isAuthenticated, logout } = useAuthStore();

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

  // Escape key to dismiss menus
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        setShowCategories(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        const filtered = MOCK_SUGGESTIONS.filter((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchSuggestions(filtered);
      } else {
        setSearchSuggestions([]);
      }
    }, 300); // Debounce time in ms

    return () => clearTimeout(timeout); // Cleanup
  }, [searchQuery]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results (we'll implement this with React Router later)
      console.log("Searching for:", searchQuery);
      setSearchSuggestions([]);
      setIsSearchFocused(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
        setSearchSuggestions([]);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar - Location & Offers */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>
                {address
                  ? `Deliver to: ${address.city} ${address.pin}`
                  : "Fetching location..."}
              </span>
            </div>
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
              {PRODUCT_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  onClick={() => setShowCategories(false)}
                  role="menuitem"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-xl md:mr-8 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} role="search">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white"
                aria-label="Search products"
                aria-expanded={isSearchFocused && searchSuggestions.length > 0}
                aria-controls="search-suggestions"
                aria-autocomplete="list"
              />
            </div>
          </form>

          {/* Search Suggestions */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div
              id="search-suggestions"
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10"
              role="listbox"
              aria-label="Search suggestions"
            >
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setSearchSuggestions([]);
                    setIsSearchFocused(false);
                  }}
                  role="option"
                  aria-selected="false"
                >
                  <Search
                    className="w-4 h-4 inline mr-2 text-gray-400"
                    aria-hidden="true"
                  />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

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
              <div className="space-y-1">
                {PRODUCT_CATEGORIES.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
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
