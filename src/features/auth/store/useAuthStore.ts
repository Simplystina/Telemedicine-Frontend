import { create } from "zustand";

type UserRole = "patient" | "doctor" | "admin";

interface AuthState {
  user: null | {
    id: string;
    role: UserRole;
    token: string;
  };
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => set({ user: null }),
}));
