import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { ShoppingBag } from "lucide-react";
import useAuthStore from "../store/authStore";
import ProductList from "../components/ui/ProductList";
import { useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { getWishlistStore } from "../store/wishlistStore";
import { BsBagHeart } from "react-icons/bs";

function WishlistPage({ onOpenLogin }) {
  const { isAuthenticated } = useAuthStore();

  const useWishlistStore = getWishlistStore();

  const wishlist = useWishlistStore((state) => state.wishlist);
  const _hasHydrated = useWishlistStore((state) => state._hasHydrated);
  const wishlistCount = wishlist.length;

  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (!_hasHydrated) {
    return <div>Loading wishlist...</div>;
  }

  return (
    <div>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
          <div className="ml-2 md:ml-0">
            <ShoppingBag size={100} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">
            PLEASE LOG IN
          </h2>

          <p className="text-gray-500 mt-2">
            Login to view items in your wishlist.
          </p>
          <Button
            onClick={onOpenLogin}
            className="px-16 py-4 mt-4 text-xl font-medium"
            variant="outline"
            size="sm"
          >
            Login
          </Button>
        </div>
      ) : wishlistCount > 0 ? (
        <div className="pb-0 grid bg-gray-50">
          <div className="max-w-7xl px-0 md:px-2 lg:px-20">
            <p className="flex gap-1 p-5 md:pl-8 pb-0 text-md font-bold md:text-2xl">
              <BsBagHeart className="mt-1" />
              Your Wishlist
            </p>
          </div>
          <ProductList
            title=""
            fetchProductsFn={() =>
              Promise.resolve({
                products: wishlist,
                pagination: {
                  currentPage: 1,
                  hasMore: false,
                  totalProducts: wishlist.length,
                },
              })
            }
            topPaddingClass={true}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
          <ShoppingBag size={64} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 mt-2">
            Add some products to your wishlist to view them here.
          </p>

          <Link to="/products">
            <Button className="mt-6 px-6 py-3" variant="outline">
              Continue Shopping
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
