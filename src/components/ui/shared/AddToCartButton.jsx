import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "../Button";
import { getCartStore } from "../../../store/cartStore";
import useAuthStore from "../../../store/authStore";

const AddToCartButton = ({
  onOpenLogin,
  product,
  className = "",
  alwaysVisible = false,
}) => {
  const { isAuthenticated } = useAuthStore();
  const useCartStore = getCartStore();
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  const isInCart = cart.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    const { selectedColor, selectedSize, sizes, colors } = product;

    e.preventDefault();
    e.stopPropagation();

    // Size must be selected unless the only option is "One Size"
    const isOneSizeOnly = sizes?.length === 1 && sizes[0] === "One Size";

    addToCart({
      ...product,
      selectedColor,
      selectedSize: isOneSizeOnly ? "One Size" : selectedSize,
      colors,
      sizes: product.sizes,
      quantity: 1,
    });
    // console.log("Added to cart:", product);
  };

  return (
    <div
      className={`transition-opacity ${
        alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {isInCart ? (
        <Link
          to="/cart"
          className={`w-full bg-gray-700 text-white py-4 px-4 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 ${className}`}
          aria-label="Go to cart"
        >
          <span className="text-sm font-medium">Go to Cart</span>
          <MdOutlineShoppingCartCheckout size={16} />
        </Link>
      ) : (
        <Button
          onClick={isAuthenticated ? handleAddToCart : onOpenLogin}
          className="flex py-4 w-full items-center justify-center space-x-2"
          aria-label={`Add ${product.title} to cart`}
        >
          <ShoppingCart size={16} />
          <span className="text-sm font-medium">Add to Cart</span>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
