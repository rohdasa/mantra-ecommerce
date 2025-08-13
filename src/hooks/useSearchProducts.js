// src/hooks/useSearch.js
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

const useSearchProducts = (query, options = {}) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const { debounceMs = 300, minQueryLength = 2 } = options;

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading recent searches:", error);
        setRecentSearches([]);
      }
    }
  }, []);

  // Debounced query - only search after user stops typing
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Determine if we should make an API call
  const shouldSearch = debouncedQuery.length >= minQueryLength;

  // React Query for search results
  const {
    data: searchResults = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchService.searchProducts(debouncedQuery),
    enabled: shouldSearch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Trending searches (you can replace this with actual trending data from your API)
  const trendingSearches = useMemo(
    () => [
      "Men Shirts",
      "Women Dresses",
      "Sneakers",
      "Watches",
      "Sunglasses",
      "Jeans",
      "T-Shirts",
      "Bags",
    ],
    []
  );

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Add to recent searches
  const addToRecentSearches = (searchTerm) => {
    const updatedRecent = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5); // Keep only top 5

    setRecentSearches(updatedRecent);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
  };

  return {
    searchResults,
    isLoading: isLoading || isFetching,
    error,
    trendingSearches,
    recentSearches,
    clearRecentSearches,
    addToRecentSearches,
    shouldSearch,
  };
};

export { useSearchProducts };
