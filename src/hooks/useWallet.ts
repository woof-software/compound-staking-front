import { create } from 'zustand';

type State = {
  isPending: boolean;
  onIsPendingToggle: (isPending: boolean) => void;
};

export const useWalletStore = create<State>((set) => ({
  isPending: false,
  onIsPendingToggle: (isPending) => set(() => ({ isPending }))
}));
