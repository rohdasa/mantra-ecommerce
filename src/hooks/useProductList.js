import { useState, useEffect, useRef, useCallback } from "react";
import { updatePagination } from "./paginationUtils";
import useInfiniteScroll from "./useInfiniteScroll";

const MAX_PRODUCTS = 20;

export const useProductList = (fetchProductsFn, sortBy) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    hasMore: true,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const loadProducts = async (page = 1) => {
    if (isFetching) return;

    setIsFetching(true);
    page === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const response = await fetchProductsFn(page, 10, sortBy);
      const newProducts = response.products;

      setProducts((prev) =>
        page === 1 ? newProducts : [...prev, ...newProducts]
      );

      setPagination(
        updatePagination(
          response.pagination,
          newProducts.length + (page === 1 ? 0 : products.length)
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsFetching(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && pagination.hasMore && products.length < MAX_PRODUCTS) {
      loadProducts(pagination.currentPage + 1);
    }
  }, [loadingMore, pagination, products]);

  // Load first page on mount or when fetch function changes
  useEffect(() => {
    loadProducts(1);
  }, [fetchProductsFn, sortBy]);

  // Hook to handle infinite scrolling
  useInfiniteScroll({
    callback: loadMore,
    enabled:
      !loading &&
      !loadingMore &&
      pagination.hasMore &&
      products.length < MAX_PRODUCTS,
  });

  return {
    products,
    pagination,
    loading,
    loadingMore,
    error,
    reload: () => loadProducts(1),
  };
};
