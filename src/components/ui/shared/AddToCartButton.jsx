import { ShoppingCart } from "lucide-react";

const AddToCartButton = () => {
  const handleAddToCart = () => {
    // TODO: Add to cart functionality
    console.log("Added to cart:", product);
  };
  return (
    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={handleAddToCart}
        className="w-full bg-secondary-500 bg-opacity-75 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
      >
        <ShoppingCart size={16} />
        <span className="text-sm font-medium">Add to Cart</span>
      </button>
    </div>
  );
};

export default AddToCartButton;
