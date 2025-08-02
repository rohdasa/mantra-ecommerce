// src/services/helpers/productHelpers.js

export const getBrandFromCategory = (category) => {
  const brands = {
    "men's clothing": ["Nike", "Adidas", "Zara", "H&M", "Uniqlo"],
    "women's clothing": ["Zara", "H&M", "Forever 21", "Mango", "Vero Moda"],
    jewelery: ["Tanishq", "Kalyan", "Malabar Gold", "Joyalukkas"],
    electronics: ["Apple", "Samsung", "Sony", "Xiaomi", "OnePlus"],
  };
  const categoryBrands = brands[category] || ["Generic"];
  return categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
};

export const getRandomColors = () => {
  const colors = [
    "Black",
    "White",
    "Blue",
    "Red",
    "Green",
    "Yellow",
    "Pink",
    "Purple",
  ];
  const numColors = Math.floor(Math.random() * 3) + 1; // 1-3 colors
  return [...colors].sort(() => 0.5 - Math.random()).slice(0, numColors);
};

export const getSizesForCategory = (category) => {
  if (category.includes("clothing")) {
    return ["XS", "S", "M", "L", "XL", "XXL"];
  }
  if (category === "jewelery") {
    return ["One Size"];
  }
  return [];
};
