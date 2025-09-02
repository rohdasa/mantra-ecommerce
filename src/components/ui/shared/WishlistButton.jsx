import { Heart } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import { getWishlistStore } from "../../../store/wishlistStore";

const WishlistButton = ({ product, size, isCard }) => {
  const { isAuthenticated } = useAuthStore();
  const useWishlistStore = getWishlistStore();

  const hasHydrated = useWishlistStore((state) => state._hasHydrated);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  if (!hasHydrated) return null;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      console.log("Added to Wishlist:", getWishlistStore().getState().wishlist);
    }
  };
  return (
    <div>
      <button
        type="button"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleWishlistToggle}
        className={`p-2 hover:bg-gray-50 ${
          isCard
            ? "absolute top-2 right-2 rounded-full bg-white shadow-md"
            : "rounded-md"
        } focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
`}
      >
        <Heart
          size={size}
          className={`transition-colors ${
            isInWishlist && isAuthenticated
              ? "fill-red-500 text-red-500"
              : "fill-none text-gray-600"
          }`}
        />
      </button>
    </div>
  );
};

export default WishlistButton;
