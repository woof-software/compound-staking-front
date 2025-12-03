import { create } from 'zustand';

import { DEFAULT_STORAGE_KEY } from '@/consts/consts';
import type { Theme } from '@/shared/types/common';

type State = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getDomTheme = (): 'light' | 'dark' | null => {
  const root = document.documentElement;

  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';

  return null;
};

const setDomTheme = (theme: Theme) => {
  const root = document.documentElement;
  const resolved = theme === 'system' ? getSystemTheme() : theme;

  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
};

export const useThemeStore = create<State>((set) => {
  const stored = localStorage.getItem(DEFAULT_STORAGE_KEY) as Theme | null;

  const domTheme = getDomTheme();

  let actual: Theme;

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    actual = stored;
  } else if (domTheme) {
    actual = domTheme;
  } else {
    actual = getSystemTheme();
  }

  setDomTheme(actual);
  localStorage.setItem(DEFAULT_STORAGE_KEY, actual);

  return {
    theme: actual,
    setTheme: (theme) =>
      set(() => {
        setDomTheme(theme);
        localStorage.setItem(DEFAULT_STORAGE_KEY, theme);
        return { theme };
      })
  };
});
