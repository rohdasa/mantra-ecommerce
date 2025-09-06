import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Loading from "./Loading";
import { Grid2X2, Grid3X3, Loader2, ShoppingCart } from "lucide-react";
import { useProductList } from "../../hooks/useProductList";
import Select from "./shared/Select";
import { sortProducts } from "../../utils/sortProducts";

// const MAX_PRODUCTS = 20;

const layouts = {
  compact: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  wide: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
};

const ProductList = ({
  fetchProductsFn,
  title = "Products",
  topPaddingClass,
}) => {
  const [gridCols, setGridCols] = useState("wide");
  const [isWideLayout, setIsWideLayout] = useState(true);
  const [sortBy, setSortBy] = useState("");

  const { products, loading, loadingMore, error, pagination, reload } =
    useProductList(fetchProductsFn, sortBy);

  const decreaseGridSize = () => {
    setGridCols("compact");
    setIsWideLayout(false);
  };

  const increaseGridSize = () => {
    setGridCols("wide");
    setIsWideLayout(true);
  };

  const sortOptions = [
    "A-Z",
    "Price: Low to High",
    "Price: High to Low",
    "Better Discount",
  ];

  if (loading) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading fullScreen variant="dots" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={reload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className={`py-12 ${topPaddingClass ? "pt-3" : "pt-12"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="flex text-xs md:text-xl font-bold text-gray-900">
              {title}
            </h2>

            <div className="flex items-center gap-4">
              <div className="flex space-x-1 text-sm text-gray-700">
                <button className="px-2 py-1 rounded-md border border-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                  Filter
                </button>
                <Select
                  label="Sort by"
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className=""
                />
              </div>
              <div className="flex items-center space-x-0 text-gray-700">
                <button
                  onClick={decreaseGridSize}
                  className={`p-2 transition-colors border border-gray-400 rounded-l ${
                    isWideLayout
                      ? "text-gray-700 cursor-pointer hover:scale-110 hover:border-r-0"
                      : "bg-black text-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Compact Grid"
                  disabled={!isWideLayout}
                >
                  <Grid2X2 size={20} />
                </button>

                <button
                  onClick={increaseGridSize}
                  className={`p-2 transition-colors border border-gray-400 border-l-0 rounded-r ${
                    isWideLayout
                      ? "bg-black text-gray-300 cursor-not-allowed"
                      : "text-gray-700 cursor-pointer hover:scale-110"
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

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <div className="ml-2 md:ml-0">
                <ShoppingCart size={80} />
              </div>
              <p className="text-lg">No products found.</p>
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

          {!pagination.hasMore && products.length > 10 && (
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

export default ProductList;
