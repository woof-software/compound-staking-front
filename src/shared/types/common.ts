import type { ValueOf } from 'viem';

import type { Currency } from '@/consts/common';

export type CurrencyType = ValueOf<typeof Currency>;

export type DelegateType = 'Delegatee' | 'Myself' | 'NoOne';
