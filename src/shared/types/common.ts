import type { ValueOf } from 'viem';

import type { Currency } from '@/consts/consts';

export type CurrencyType = ValueOf<typeof Currency>;
