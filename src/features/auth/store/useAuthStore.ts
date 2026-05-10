import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types";

interface AuthState {
  user: null | AuthUser;
  refreshToken: string | null;
  setUser: (user: AuthState["user"]) => void;
  setRefreshToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      logout: () => set({ user: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
