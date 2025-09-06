import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { ShoppingCart } from "lucide-react";
import useAuthStore from "../store/authStore";
import { TiDelete } from "react-icons/ti";
import { useEffect } from "react";
import formatPrice from "../utils/formatPrice";
import Select from "../components/ui/shared/Select";
import { getCartStore } from "../store/cartStore";
import { MdAddShoppingCart } from "react-icons/md";

function CartPage({ onOpenLogin }) {
  const { isAuthenticated } = useAuthStore();

  const useCartStore = getCartStore();

  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.length;
  const _hasHydrated = useCartStore((state) => state._hasHydrated);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateColor = useCartStore((state) => state.updateColor);
  const updateSize = useCartStore((state) => state.updateSize);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  //  Wait for hydration to complete
  if (!_hasHydrated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-sm">Loading your cart...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
        <ShoppingCart size={80} />
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          PLEASE LOG IN
        </h2>
        <p className="text-gray-500 mt-2">Login to view items in your cart.</p>
        <Button
          onClick={onOpenLogin}
          className="px-16 py-4 mt-4 text-xl font-medium"
          variant="outline"
          size="sm"
        >
          Login
        </Button>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
        <ShoppingCart size={64} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">
          Your cart is empty
        </h3>
        <p className="text-gray-500 mt-2">
          Add some products to your cart to view them here.
        </p>
        <Link to="/products">
          <Button className="mt-6 px-6 py-3" variant="outline">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="flex justify-between">
        <h1 className="text-xs md:text-xl font-semibold mb-6 text-gray-800">
          Shopping Bag ({cartCount})
        </h1>
        <Link to="/products" className="" aria-label="Add more products">
          <span className="flex text-xs md:text-lg font-medium">
            <MdAddShoppingCart className="pt-1 text-base md:text-2xl" /> Add
            more products
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Cart Items */}
        <div className="md:col-span-2 space-y-4 overflow-y-auto lg:h-screen">
          {cart.map((item) => (
            <div key={item.id}>
              <div className="bg-white mb-2 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start space-x-4">
                    <Link
                      className="p-3 md:p-5 border"
                      to={`/products/${item.id}`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-12 w-12 max-w-12 max-h-12 md:w-24 md:h-24 md:max-w-24 md:max-h-24 object-contain rounded"
                      />
                    </Link>
                    <div className="w-auto">
                      <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {item.category}
                      </p>
                      <p className="text-md font-semibold text-gray-900 mt-2">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center mt-3 flex-wrap gap-2 md:gap-4">
                        <div className="flex">
                          <div className="selectLabel">
                            <h3>Color:</h3>
                          </div>
                          <Select
                            label="Color"
                            options={item.colors}
                            value={item.selectedColor}
                            onChange={(newColor) =>
                              updateColor(item.id, newColor)
                            }
                            className="w-28 max-w-28"
                          />
                        </div>

                        {item.selectedSize &&
                          (item.sizes.length === 1 ? (
                            <div className="flex">
                              <div className="selectLabel">
                                <h3>Size:</h3>
                              </div>
                              <p className="block w-28 pr-8 pl-2 py-1 border border-gray-400 bg-slate-100 rounded-md shadow-sm text-sm text-gray-700">
                                One Size
                              </p>
                            </div>
                          ) : (
                            <div className="flex">
                              <div className="selectLabel">
                                <h3>Size:</h3>
                              </div>
                              <Select
                                label="Size"
                                options={item.sizes}
                                value={item.selectedSize}
                                onChange={(newSize) =>
                                  updateSize(item.id, newSize)
                                }
                                className="w-28 max-w-28"
                              />
                            </div>
                          ))}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center mt-3">
                        <div className="selectLabel">
                          <h3>Qty:</h3>
                        </div>
                        <Select
                          label="Qty"
                          options={[1, 2, 3, 4, 5]}
                          value={item.quantity}
                          onChange={(newQty) => updateQuantity(item.id, newQty)}
                          className="w-28 max-w-28"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => {
                      if (!_hasHydrated) return;
                      if (confirm("Remove this product from your cart?")) {
                        removeFromCart(item.id);
                      }
                    }}
                    className="p-2 rounded-md transition-colors group"
                    title="Remove from cart"
                  >
                    <TiDelete
                      size={20}
                      className="fill-gray-600 hover:fill-red-600"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
          <h2 className="text-md font-semibold text-gray-800 mb-4">
            Price Details
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">- ₹0</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-medium text-base text-gray-900">
              <span>Total Amount</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Button className="w-full mt-6 py-3 text-base font-medium">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
