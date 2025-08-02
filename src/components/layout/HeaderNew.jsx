// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Bell,
} from "lucide-react";
import { productService } from "../../services/productService";

const Header = () => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [categories, setCategories] = useState([]);

  // Mock user state (in real app, this would come from auth context)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Categories for navigation
  const navigationCategories = [
    {
      name: "Men",
      slug: "men",
      subcategories: ["Shirts", "Pants", "Shoes", "Accessories"],
    },
    {
      name: "Women",
      slug: "women",
      subcategories: ["Dresses", "Tops", "Shoes", "Accessories"],
    },
    {
      name: "Electronics",
      slug: "electronics",
      subcategories: ["Phones", "Laptops", "Headphones", "Cameras"],
    },
    {
      name: "Jewelry",
      slug: "jewelery",
      subcategories: ["Necklaces", "Rings", "Earrings", "Bracelets"],
    },
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await productService.getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Search functionality with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const results = await productService.searchProducts(
            searchQuery,
            1,
            5
          );
          setSearchResults(results.products);
          setShowSearchResults(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (product) => {
    setShowSearchResults(false);
    setSearchQuery("");
    navigate(`/product/${product.id}`);
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    setIsMobileMenuOpen(false);
  };

  // Mock login/logout
  const handleAuthAction = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUser(null);
    } else {
      // In real app, this would open login modal or navigate to login page
      setIsLoggedIn(true);
      setUser({ name: "John Doe", email: "john@example.com" });
    }
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Banner (Optional) */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <p>Free Shipping on orders above ₹999 | Use code: FREESHIP</p>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Mantra</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationCategories.map((category) => (
              <div key={category.name} className="relative group">
                <button
                  onClick={() => handleCategoryClick(category.slug)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 py-2 font-medium transition-colors"
                >
                  <span>{category.name}</span>
                  <ChevronDown
                    size={16}
                    className="transition-transform group-hover:rotate-180"
                  />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <button
                      onClick={() => handleCategoryClick(category.slug)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      All {category.name}
                    </button>
                    <hr className="my-1" />
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() =>
                          handleCategoryClick(
                            `${category.slug}/${subcategory.toLowerCase()}`
                          )
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-gray-600"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <Search className="animate-spin mx-auto mb-2" size={20} />
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSearchResultClick(product)}
                        className="w-full flex items-center p-3 hover:bg-gray-50 text-left"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{product.price}
                          </p>
                        </div>
                      </button>
                    ))}
                    <div className="border-t p-3">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-blue-600 text-sm font-medium hover:text-blue-800"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-600 hover:text-gray-900 relative transition-colors"
            >
              <Heart size={24} />
              {/* Badge - you can make this dynamic */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 text-gray-600 hover:text-gray-900 relative transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User size={24} />
                {isLoggedIn && (
                  <span className="hidden sm:block text-sm font-medium">
                    Hi, {user?.name?.split(" ")[0]}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-2">
                    {isLoggedIn ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Wishlist
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleAuthAction}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleAuthAction}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                        >
                          Login / Sign Up
                        </button>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Track Orders
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigationCategories.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    {category.name}
                  </button>
                  <div className="pl-4 space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() =>
                          handleCategoryClick(
                            `${category.slug}/${subcategory.toLowerCase()}`
                          )
                        }
                        className="block w-full text-left px-4 py-1 text-sm text-gray-600 hover:bg-gray-100"
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
