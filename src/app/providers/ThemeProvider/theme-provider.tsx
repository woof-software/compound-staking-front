import { type ComponentType, type ReactNode, useEffect } from 'react';
import { create } from 'zustand';

import { DEFAULT_STORAGE_KEY } from '@/consts/consts';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme })
}));

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = DEFAULT_STORAGE_KEY
}: ThemeProviderProps) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    setTheme(stored || defaultTheme);
  }, [storageKey, defaultTheme, setTheme]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      root.classList.add(systemTheme);
      localStorage.setItem(storageKey, systemTheme);

      return;
    }

    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  return <>{children}</>;
}

export const useTheme = () => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return { theme, setTheme };
};

export const withTheme = (Component: ComponentType) => {
  return () => {
    return (
      <ThemeProvider
        defaultTheme='system'
        storageKey={DEFAULT_STORAGE_KEY}
      >
        <Component />
      </ThemeProvider>
    );
  };
};
