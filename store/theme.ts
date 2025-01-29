import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeStore>(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);
