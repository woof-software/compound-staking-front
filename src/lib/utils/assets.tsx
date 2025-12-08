import type { ComponentType } from 'react';

import {
  ARBITRUM,
  AVALANCHE,
  BASE,
  ETHEREUM,
  LINEA,
  MANTLE,
  OPTIMISM,
  POLYGON,
  RONINCHAIN,
  SCROLL,
  UNICHAIN
} from '@/assets/chain';

const CHAIN_LIST = [
  { ids: [1, 42, 11155111], name: 'ETHEREUM', Comp: ETHEREUM },
  { ids: [43113, 43114], name: 'AVALANCHE', Comp: AVALANCHE },
  { ids: [137, 80001], name: 'POLYGON', Comp: POLYGON },
  { ids: [10, 420], name: 'OPTIMISM', Comp: OPTIMISM },
  { ids: [42161, 421613], name: 'ARBITRUM', Comp: ARBITRUM },
  { ids: [8453, 84531], name: 'BASE', Comp: BASE },
  { ids: [59140, 59144], name: 'LINEA', Comp: LINEA },
  { ids: [534352], name: 'SCROLL', Comp: SCROLL },
  { ids: [5000], name: 'MANTLE', Comp: MANTLE },
  { ids: [130], name: 'UNICHAIN', Comp: UNICHAIN },
  { ids: [2020], name: 'RONIN', Comp: RONINCHAIN }
];

type ChainEntry = { name: string; Comp: ComponentType<any> };

const CHAIN_MAP = new Map<number, ChainEntry>();

for (const cfg of CHAIN_LIST) {
  for (const id of cfg.ids) {
    CHAIN_MAP.set(id, { name: cfg.name, Comp: cfg.Comp });
  }
}

export function getChainIcon(chainId: number | undefined, classNames?: string) {
  if (!chainId) return { name: '', icon: null };

  const entry = CHAIN_MAP.get(chainId);

  if (!entry) return { name: '', icon: null };

  const { name, Comp } = entry;

  return { name, icon: <Comp className={classNames} /> };
}
