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

export const checkCorrectNetwork = (props: { isConnected: boolean; chainId?: number | undefined }) => {
  const { isConnected, chainId } = props;

  const isWrong = isConnected && chainId != null && chainId !== APPLICATION_CHAIN;

  if (isWrong) {
    openSwitchNetworkModal();
    return false;
  }

  return true;
};
