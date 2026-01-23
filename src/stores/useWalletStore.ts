import { create } from 'zustand';

type State = {
  isPending: boolean;
  needRefresh: boolean;
  triggerRefresh: () => void;
  resetRefresh: () => void;
  setIsPendingToggle: (isPending: boolean) => void;
};

export const useWalletStore = create<State>((set) => ({
  isPending: false,
  needRefresh: false,
  triggerRefresh: () => set({ needRefresh: true }),
  resetRefresh: () => set({ needRefresh: false }),
  setIsPendingToggle: (isPending) => set(() => ({ isPending }))
}));
