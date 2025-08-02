import axios from "axios";
import {
  getBrandFromCategory,
  getRandomColors,
  getSizesForCategory,
} from "./productHelpers";

// We'll use FakeStore API for now - it has good product data
const BASE_URL = "https://fakestoreapi.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Transform the API data to match our needs
const transformProduct = (product) => ({
  id: product.id,
  title: product.title,
  price: product.price,
  originalPrice: product.price * 1.2,
  image: product.image,
  category: product.category,
  rating: product.rating,
  description: product.description,
  brand: getBrandFromCategory(product.category),
  discount: Math.floor(Math.random() * 50) + 10,
  isNew: Math.random() > 0.7,
  isBestseller: Math.random() > 0.8,
  colors: getRandomColors(),
  sizes: getSizesForCategory(product.category),
  inStock: Math.random() > 0.1,
});

export const productService = {
  getAllProducts: async (page = 1, limit = 20, cancelToken) => {
    try {
      const response = await api.get("/products", { cancelToken });
      const allProducts = response.data.map(transformProduct);

      // Simulate pagination by duplicating and modifying products
      const totalProducts = allProducts.length * 5;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const expandedProducts = [];
      for (let i = 0; i < totalProducts; i++) {
        const originalProduct = allProducts[i % allProducts.length];
        expandedProducts.push({
          ...originalProduct,
          id: i + 1,
          title: `${originalProduct.title} - Variant ${
            Math.floor(i / allProducts.length) + 1
          }`,
        });
      }

      const paginatedProducts = expandedProducts.slice(startIndex, endIndex);

      return {
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
          hasMore: endIndex < totalProducts,
          limit,
        },
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching products:", error);
        throw error;
      }
    }
  },

  getProductsByCategory: async (category, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      const products = response.data.map(transformProduct);

      return {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(products.length / limit),
          totalProducts: products.length,
          hasMore: page * limit < products.length,
          limit,
        },
      };
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return transformProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get("/products/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  searchProducts: async (query, page = 1, limit = 20) => {
    try {
      const allProductsResponse = await api.get("/products");
      const allProducts = allProductsResponse.data.map(transformProduct);

      const filteredProducts = allProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
      );

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return {
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredProducts.length / limit),
          totalProducts: filteredProducts.length,
          hasMore: endIndex < filteredProducts.length,
          limit,
        },
        query,
      };
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },
};
