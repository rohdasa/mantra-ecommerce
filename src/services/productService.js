// src/services/productService.js
import axios from "axios";
import { paginate } from "../utils/pagination";
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

const fixImageUrl = (url) => {
  if (!url) return "/fallback-image.png"; // If there's no URL at all

  // Fix bad .jpg links by changing them to .png
  if (url.endsWith(".jpg")) {
    return url.replace(/\.jpg$/, "t.png");
  }
  return url;
};

// Transform the API data to match our needs
const transformProduct = (product) => {
  const originalPrice = product.price;
  const discountPercentage = Math.floor(Math.random() * 30) + 10; // 10% - 40% discount
  const discountedPrice = +(
    originalPrice -
    (originalPrice * discountPercentage) / 100
  ).toFixed(2);

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: discountedPrice,
    originalPrice,
    discount: discountPercentage,
    image: fixImageUrl(product.image),
    category: product.category,
    rating: product.rating.rate,
    reviewCount: product.rating?.count || Math.floor(Math.random() * 200),
    brand: getBrandFromCategory(product.category, product.id), // You can define this yourself
    isNew: Math.random() < 0.3, // 30% chance of being new
    isBestseller: Math.random() > 0.8, // 20% chance
    colors: getRandomColors(), // from helpers
    sizes: getSizesForCategory(product.category), // from helpers
    inStock: Math.random() > 0.1, // 90% chance in stock
  };
};

// Main API functions
export const productService = {
  // Get all products with pagination simulation
  getAllProducts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get("/products");
      const productsArray = response?.data;

      if (!Array.isArray(productsArray)) {
        throw new Error("Unexpected product data format from API.");
      }

      const allProducts = productsArray.map(transformProduct);

      const { items, pagination } = paginate(allProducts, page, limit);
      return { products: items, pagination };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      const productsArray = response.data;
      //console.log(`Raw API response for category ${category}:`, productsArray);

      if (!Array.isArray(productsArray)) {
        throw new Error("Unexpected product data format from API.");
      }

      // if (productsArray.length === 0) {
      //   console.warn(`No products found for category: ${category}`);
      //   return {
      //     products: [],
      //     pagination: {
      //       currentPage: page,
      //       totalPages: 0,
      //       totalProducts: 0,
      //       hasMore: false,
      //       limit,
      //     },
      //   };
      // }
      const products = productsArray.map(transformProduct);

      const { items, pagination } = paginate(products, page, limit);
      return { products: items, pagination };
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return transformProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await api.get("/products/categories");

      const data = response.data;
      return data.map((category, index) => ({
        id: index + 1,
        name: category
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" "),
        slug: category.replace(/\s+/g, "-").toLowerCase(),
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Search products (mock implementation)
  searchProducts: async (query, page = 1, limit = 10) => {
    try {
      const allProductsResponse = await api.get("/products");
      const allProducts = allProductsResponse.data.map(transformProduct);
      const normalizedQuery = query.trim().toLowerCase();

      // Simple search implementation
      const filteredProducts = allProducts.filter(
        (product) =>
          product?.title?.toLowerCase().includes(normalizedQuery) ||
          product?.category?.toLowerCase().includes(normalizedQuery) ||
          product?.brand?.toLowerCase().includes(normalizedQuery)
      );

      const { items, pagination } = paginate(filteredProducts, page, limit);
      return { products: items, pagination };
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },
};
