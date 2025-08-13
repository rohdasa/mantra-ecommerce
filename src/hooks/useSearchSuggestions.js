// src/hooks/useSearchSuggestions.js
import { useEffect, useState } from "react";
import useCategories from "./useCategories";
import searchService from "../services/searchService";

const useSearchSuggestions = (query) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsEmpty(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchSuggestions = async (q) => {
    setIsLoading(true);
    try {
      const results = await searchService.getSuggestions(q);
      setSuggestions(results);
      setIsEmpty(results.length === 0);
    } catch (err) {
      console.error("Suggestion fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { suggestions, isLoading, isEmpty };
};

export default useSearchSuggestions;
