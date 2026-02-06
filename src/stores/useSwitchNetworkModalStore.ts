import { create } from 'zustand';

import { APPLICATION_CHAIN } from '@/consts/common';

type State = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useSwitchNetworkModalStore = create<State>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}));

export const openSwitchNetworkModal = () => useSwitchNetworkModalStore.getState().open();

export function trySwitchToApplicationChain(chainId?: number) {
  if (chainId !== APPLICATION_CHAIN) {
    openSwitchNetworkModal();
    throw new Error(`Expected chainId=${APPLICATION_CHAIN}, got ${chainId}`);
  }
}
