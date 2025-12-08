import type { ValueOf } from 'viem';

import type { Currency } from '@/consts/common';

export type ClassNames = {
  wrapper?: string;
  input?: string;
  content?: string;
  icon?: string;
  button?: string;
};

export type CurrencyType = ValueOf<typeof Currency>;

export type DelegateType = 'Delegatee' | 'Myself' | 'NoOne';
