import { useParams } from "react-router-dom";
import { productService } from "../services/productService";
import ProductList from "../components/ui/ProductList";
import { useCallback, useEffect } from "react";
import { TbCategory } from "react-icons/tb";

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
    <>
      <div className="pb-0 grid bg-gray-50">
        <div className="max-w-7xl px-0 md:px-2 lg:px-20">
          <p className="flex gap-1 p-5 md:pl-8 pb-0 text-md font-bold md:text-2xl">
            <TbCategory className="mt-1" />
            {title}
          </p>
        </div>
        <ProductList
          className="pt-0 mt-1"
          fetchProductsFn={fetchProductsByCategory}
          title=""
          topPaddingClass={true}
        />
      </div>
    </>
  );
};

export default CategoryPage;
