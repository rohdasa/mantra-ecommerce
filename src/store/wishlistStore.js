import { create } from "zustand";
import { persist } from "zustand/middleware";

let useWishlistStore;

const createWishlistStore = (userId) =>
  persist(
    (set, get) => ({
      wishlist: [],
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addToWishlist: (product) => {
        set((state) => {
          if (state.wishlist.some((item) => item.id === product.id)) {
            return state; // no duplicates
          }
          return { wishlist: [...state.wishlist, product] };
        });
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: `wishlist__${userId || "guest"}`,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.(true);
      },
    }
  );

export const initializeWishlistStore = (userId) => {
  useWishlistStore = create(createWishlistStore(userId));
  return useWishlistStore;
};

export const getWishlistStore = () => {
  if (!useWishlistStore) {
    // Default to guest cart if not initialized yet
    useWishlistStore = create(createWishlistStore("storage"));
  }
  return useWishlistStore;
};
