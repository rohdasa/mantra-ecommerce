import React, { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
import ProductCard from "../components/ui/ProductCard";
import Loading from "../components/ui/Loading";
import HeroCarousel from "../components/ui/HeroCarousel";
import { Grid2X2, Grid3X3, Loader2 } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    hasMore: true,
    totalProducts: 0,
  });
  const [isFetching, setIsFetching] = useState(false);
  const MAX_PRODUCTS = 100; // Maximum product limit

  // Grid Style Options
  const [gridCols, setGridCols] = useState("wide");
  const [isWideLayout, setIsWideLayout] = useState(true);

  const layouts = {
    compact: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    wide: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  // Fetch products
  const fetchProducts = async (page = 1) => {
    // Prevent any fetch if max products reached
    if (products.length >= MAX_PRODUCTS || isFetching) {
      setPagination((prev) => ({ ...prev, hasMore: false })); // Stop further fetches
      return;
    }

    setIsFetching(true);
    console.log(`Initiating fetch for page ${page}`); // Debug log

    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await productService.getAllProducts(page, 20);

      // Calculate how many products can be added without exceeding MAX_PRODUCTS
      const remainingSpace = MAX_PRODUCTS - products.length;
      const newProducts = response.products.slice(0, remainingSpace);

      if (page === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      // Update pagination, ensuring hasMore is false if limit reached
      setPagination({
        ...response.pagination,
        hasMore:
          response.pagination.hasMore &&
          products.length + newProducts.length < MAX_PRODUCTS,
      });
      setError(null);
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError(
          "The request timed out. Your internet connection might be slow."
        );
      } else {
        setError("Failed to load products. Please try again.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsFetching(false);
    }
  };

  // Load more products
  const loadMore = useCallback(() => {
    if (!loadingMore && pagination.hasMore && products.length < MAX_PRODUCTS) {
      fetchProducts(pagination.currentPage + 1);
    }
  }, [
    loadingMore,
    pagination.hasMore,
    pagination.currentPage,
    products.length,
  ]);

  // Infinite scroll logic
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      // Early exit if max products reached or already fetching
      if (
        products.length >= MAX_PRODUCTS ||
        isFetching ||
        loadingMore ||
        !pagination.hasMore
      ) {
        return;
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1500
        ) {
          loadMore();
        }
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [loadMore, loadingMore, pagination.hasMore, products.length, isFetching]);

  // Initial load
  useEffect(() => {
    fetchProducts(1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const decreaseGridSize = () => {
    setGridCols("compact");
    setIsWideLayout(false);
  };
  const increaseGridSize = () => {
    setGridCols("wide");
    setIsWideLayout(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroCarousel />
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <button className="px-2 py-1 rounded-md border border-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                  Filter
                </button>
                <button className="px-2 py-1 rounded-md border border-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                  Sort
                </button>
              </div>
              <div className="flex items-center space-x-1 text-gray-700">
                <button
                  onClick={decreaseGridSize}
                  className={`p-1 rounded-md transition-colors ${
                    isWideLayout
                      ? "text-gray-700 cursor-pointer"
                      : "text-primary-500 hover:text-primary-600 hover:bg-primary-50 cursor-not-allowed"
                  }`}
                  aria-label="Compact Grid"
                  disabled={!isWideLayout}
                >
                  <Grid2X2 size={20} />
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={increaseGridSize}
                  className={`p-1 rounded-md transition-colors ${
                    isWideLayout
                      ? "text-primary-500 hover:text-primary-600 hover:bg-primary-50 cursor-not-allowed"
                      : "text-gray-700 cursor-pointer"
                  }`}
                  aria-label="Expanded Grid"
                >
                  <Grid3X3 size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className={`grid gap-6 ${layouts[gridCols]}`}>
            {products.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
          {!loading && products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">
                No products found. Try adjusting your filters or come back
                later.
              </p>
            </div>
          )}
          {loadingMore && (
            <div className="flex flex-col items-center py-8">
              <div className="flex items-center mb-2">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600 mr-3" />
                <span className="text-gray-600">Loading more products...</span>
              </div>
              <p className="text-sm text-gray-500">
                Loaded {products.length} of {pagination.totalProducts} products
              </p>
            </div>
          )}
          {!pagination.hasMore && products.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                You've seen all {products.length} products! 🎉
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
