import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  setSession: (tokens: { accessToken: string; refreshToken: string }) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setSession: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      clearSession: () => set({ accessToken: null, refreshToken: null }),
    }),
    { name: "stayhub-auth" }
  )
)

export const authStore = useAuthStore
