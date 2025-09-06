export const sortProducts = (products, sortType) => {
  switch (sortType) {
    case "A-Z":
      return [...products].sort((a, b) => a.title.localeCompare(b.title));
    case "Price: Low to High":
      return [...products].sort((a, b) => a.price - b.price);
    case "Price: High to Low":
      return [...products].sort((a, b) => b.price - a.price);
    case "Better Discount":
      return [...products].sort((a, b) => b.discount - a.discount);
    default:
      return products;
  }
};
