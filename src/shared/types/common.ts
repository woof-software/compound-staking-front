import type { Currency } from '@/consts/consts';

export type ClassNames = {
  wrapper?: string;
  container?: string;
  label?: string;
  error?: string;
  errorIcon?: string;
  prefix?: string;
  content?: string;
  icon?: string;
  text?: string;
  header?: string;
  footer?: string;
  image?: string;
  placeholder?: string;
  skeleton?: string;
  title?: string;
  description?: string;
};

export type Theme = 'light' | 'dark' | 'system';

export type CurrencyType = ValueOf<typeof Currency>;
