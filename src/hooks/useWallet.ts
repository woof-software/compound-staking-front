import { create } from 'zustand';

type State = {
  isPending: boolean;
  setIsPendingToggle: (isPending: boolean) => void;
};

export const useWalletStore = create<State>((set) => ({
  isPending: false,
  setIsPendingToggle: (isPending) => set(() => ({ isPending }))
}));
