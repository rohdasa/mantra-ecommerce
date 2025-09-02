import { useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";
import ProductList from "../components/ui/ProductList";
import { useCallback, useMemo } from "react";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const fetchSearchResults = useCallback(
    (page, limit) => {
      return productService.searchProducts(query, page, limit);
    },
    [query]
  );

  return (
    <ProductList fetchProductsFn={fetchSearchResults} title="Search Results:" />
  );
};

export default SearchResultsPage;
