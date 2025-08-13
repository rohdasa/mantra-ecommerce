import { useEffect, useState } from "react";
import { productService } from "../services/productService";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await productService.getCategories();
        setCategories(data || []);
      } catch (error) {
        setError(error.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;
