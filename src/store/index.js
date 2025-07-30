import { create } from "zustand";

// Temporary mock auth store (we'll improve this later)
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  // Actions
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
