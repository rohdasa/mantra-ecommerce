// src/services/searchService.js
import { productService } from "./productService";

// Helper to deduplicate suggestions
const deduplicate = (items) => Array.from(new Set(items));

const getSuggestions = async (query) => {
  if (!query) return [];

  const allProducts = await productService.getAllProducts(1, 100); // Limit to 100 for performance
  const transformed = allProducts.products;

  const lowerQuery = query.toLowerCase();

  const suggestions = [];

  // const wordBoundaryMatch = (text, query) => {
  //   const regex = new RegExp(`(^|\\s|\\b)${query}`, "i");
  //   return regex.test(text);
  // };

  // (If you're writing a RegExp using the constructor (new RegExp()), you need to double-escape backslashes to make them survive string parsing and reach the regex engine.)
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const wordBoundaryMatch = (text, query) => {
    const escapedQuery = escapeRegex(query);
    const regex = new RegExp(`(^|\\s|\\b)${escapedQuery}`, "i");
    return regex.test(text);
  };

  // Titles
  const matchingTitles = transformed
    .filter((p) => wordBoundaryMatch(p.title, lowerQuery))
    .map((p) => ({
      label: p.title,
      type: "Product",
    }));

  // Categories
  const matchingCategories = deduplicate(
    transformed
      .filter((p) => wordBoundaryMatch(p.category, lowerQuery))
      .map((p) => p.category)
  ).map((category) => ({
    label: category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    type: "Category",
    slug: category.toLowerCase().replace(/\s+/g, "-"),
  }));

  // Brands
  const matchingBrands = deduplicate(
    transformed
      .filter((p) => p.brand.toLowerCase().includes(lowerQuery))
      .map((p) => p.brand)
  ).map((brand) => ({
    label: brand,
    type: "Brand",
  }));

  // Colors
  // const matchingColors = deduplicate(
  //   transformed
  //     .flatMap((p) => p.colors)
  //     .filter((color) => color.toLowerCase().includes(lowerQuery))
  // ).map((color) => ({
  //   label: color,
  //   type: "Color",
  // }));

  suggestions.push(...matchingTitles, ...matchingCategories, ...matchingBrands);

  // Optional: limit total suggestions
  return suggestions.slice(0, 10);
};

export default {
  getSuggestions,
};
