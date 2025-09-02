import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";
import { getCartStore } from "./cartStore";
import { getWishlistStore } from "./wishlistStore";

const useAuthStore = create(
  persist(
    (set, get) => {
      // Shared OTP countdown timer logic
      const startOTPTimer = () => {
        set({ otpTimer: 30 });

        const timer = setInterval(() => {
          const { otpTimer } = get();
          if (otpTimer > 0) {
            set({ otpTimer: otpTimer - 1 });
          } else {
            clearInterval(timer);
          }
        }, 1000);
        set({ timerId: timer });
      };

      return {
        // Auth State
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        // OTP State
        otpSent: false,
        pendingIdentifier: null,
        identifierType: null,
        maskedIdentifier: null,
        otpTimer: 0,
        otpVerified: false,
        isNewUser: false,

        // --- Actions ---
        sendOTP: async (identifier) => {
          set({ isLoading: true });

          try {
            const result = await authService.sendOTP(identifier);
            if (result.success) {
              set({
                otpSent: true,
                pendingIdentifier: identifier,
                identifierType: result.data.type,
                maskedIdentifier: result.data.maskedIdentifier,
                isNewUser: result.data.isNewUser || false,
                otpTimer: 30,
                isLoading: false,
              });

              startOTPTimer();
            } else {
              set({ isLoading: false });
            }

            return result;
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("sendOTP failed:", error);
            }
            set({ isLoading: false });
            return {
              success: false,
              message: "Network error. Please try again.",
            };
          }
        },

        verifyOTP: async (otp) => {
          set({ isLoading: true });

          try {
            const { pendingIdentifier } = get();
            const result = await authService.verifyOTP(pendingIdentifier, otp);

            if (result.success) {
              const user = result.data.user;

              // Determine new user based on profile completeness
              const isNewUser = !user.name || user.name.trim() === "";
              set({
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                otpSent: false,
                pendingIdentifier: null,
                identifierType: null,
                maskedIdentifier: null,
                otpTimer: 0,
                otpVerified: true,
                isNewUser: isNewUser,
                user,
              });

              return {
                success: true,
                message: "OTP verified successfully!",
                data: { isNewUser },
              };
            } else {
              set({ isLoading: false });
            }

            return result;
          } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.message };
          }
        },

        resendOTP: async () => {
          const { pendingIdentifier } = get();

          if (!pendingIdentifier) {
            return { success: false, message: "No pending verification" };
          }

          const result = await authService.resendOTP(pendingIdentifier);

          if (result.success) {
            set({ otpTimer: 30 });
            startOTPTimer();
          }
          return result;
        },

        logout: () => {
          const { user } = get();
          const userId = user?.id;

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            otpSent: false,
            pendingIdentifier: null,
            identifierType: null,
            maskedIdentifier: null,
            otpTimer: 0,
            otpVerified: false,
            isNewUser: false,
          });
          // Remove auth storage from localStorage
          localStorage.removeItem("auth-storage");

          // Clear zustand cart state
          try {
            const cartStore = getCartStore();
            cartStore.getState().clearCart();
          } catch (e) {
            console.warn("Cart store not initialized, skipping clearCart.");
          }

          try {
            const wishlistStore = getWishlistStore(); // You'll need to create this getter
            wishlistStore.getState().clearWishlist();
          } catch (e) {
            console.warn(
              "Wishlist store not initialized, skipping clearWishlist."
            );
          }
        },

        resetOTPState: () => {
          const { timerId } = get();
          if (timerId) clearInterval(timerId);
          set({
            otpSent: false,
            pendingIdentifier: null,
            identifierType: null,
            maskedIdentifier: null,
            otpTimer: 0,
            otpVerified: false,
            timerId: null,
          });
        },

        completeProfile: async (profileData) => {
          set({ isLoading: true });

          try {
            const { user } = get();
            const result = await authService.completeProfile(
              user.id,
              profileData
            );

            if (result.success) {
              set({
                user: result.data.user,
                isNewUser: false,
                isLoading: false,
              });
            } else {
              set({ isLoading: false });
            }

            return result;
          } catch (error) {
            console.error("AuthStore: Error in completeProfile:", error);
            set({ isLoading: false });
            return {
              success: false,
              message: "Network error. Please try again.",
            };
          }
        },

        // Optional helpers to get mock data
        getMockUsers: () => authService.getMockUsers(),
        getMockOTP: () => authService.getMockOTP(),
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
