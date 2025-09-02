import { create } from "zustand";
import { persist } from "zustand/middleware";

// Module-scoped store reference
let useCartStore;

const createCartStore = (userId) =>
  persist(
    (set, get) => ({
      cart: [],
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addToCart: (product) => {
        set((state) => {
          const exists = state.cart.find(
            (item) =>
              item.id === product.id &&
              item.selectedColor === product.selectedColor &&
              item.selectedSize === product.selectedSize
          );
          if (exists) return state;

          return {
            cart: [
              ...state.cart,
              { ...product, quantity: product.quantity || 1 },
            ],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (itemId, newQty) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity: newQty } : item
          ),
        }));
      },

      updateColor: (itemId, newColor) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, selectedColor: newColor } : item
          ),
        }));
      },

      updateSize: (itemId, newSize) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, selectedSize: newSize } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: `cart_${userId || "guest"}`, // dynamic key
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      },
    }
  );

export const initializeCartStore = (userId) => {
  useCartStore = create(createCartStore(userId));
  return useCartStore;
};

export const getCartStore = () => {
  if (!useCartStore) {
    // Default to guest storage if not initialized yet
    useCartStore = create(createCartStore("storage"));
  }
  return useCartStore;
};
