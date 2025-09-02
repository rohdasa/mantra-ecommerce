import ProductList from "../components/ui/ProductList";
import { productService } from "../services/productService";

const ProductsPage = () => {
  return (
    <ProductList
      fetchProductsFn={productService.getAllProducts}
      title="All Products"
    />
  );
};

export default ProductsPage;
