import { useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";
import ProductList from "../components/ui/ProductList";
import { useCallback, useMemo } from "react";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const title = useMemo(() => {
    if (!query) return "Search";
    return `Search Results for "${query}"`;
  }, [query]);

  const fetchSearchResults = useCallback(
    (page, limit) => {
      return productService.searchProducts(query, page, limit);
    },
    [query]
  );

  return <ProductList fetchProductsFn={fetchSearchResults} title={title} />;
};

export default SearchResultsPage;
