import { useParams } from "react-router-dom";
import { productService } from "../services/productService";
import ProductList from "../components/ui/ProductList";
import { useCallback, useEffect } from "react";

const CategoryPage = () => {
  const { slug } = useParams();

  const category = slug.replace(/-/g, " ").toLowerCase();

  const title = category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const fetchProductsByCategory = useCallback(
    (page, limit) => {
      return productService.getProductsByCategory(category, page, limit);
    },
    [category]
  );

  return (
    <ProductList
      fetchProductsFn={fetchProductsByCategory}
      title={`Category: ${title}`}
    />
  );
};

export default CategoryPage;
