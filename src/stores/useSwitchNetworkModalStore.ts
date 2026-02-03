import { create } from 'zustand';
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
