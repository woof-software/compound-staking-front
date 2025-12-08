import type { ValueOf } from 'viem';

import type { Currency } from '@/consts/common';

export type ClassNames = {
  wrapper?: string;
  content?: string;
};

export type CurrencyType = ValueOf<typeof Currency>;

export type DelegateType = 'Delegatee' | 'Myself' | 'NoOne';
