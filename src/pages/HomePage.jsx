// pages/Home.jsx
import React, { useEffect } from "react";
import HeroCarousel from "../components/ui/HeroCarousel";
import ProductList from "../components/ui/ProductList";
import { productService } from "../services/productService";

const Home = () => {
  return (
    <div>
      <HeroCarousel />
      <ProductList
        fetchProductsFn={productService.getAllProducts}
        title="Products"
      />
    </div>
  );
};

export default Home;
