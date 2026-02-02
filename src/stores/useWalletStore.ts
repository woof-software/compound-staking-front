import { create } from 'zustand';

type State = {
  needRefresh: boolean;
  triggerRefresh: () => void;
  resetRefresh: () => void;
  isPending: boolean;
  setIsPendingToggle: (isPending: boolean) => void;
};

export const useWalletStore = create<State>((set) => ({
  needRefresh: false,
  isPending: false,
  setIsPendingToggle: (isPending) => set(() => ({ isPending })),
  triggerRefresh: () => set(() => ({ needRefresh: true })),
  resetRefresh: () => set(() => ({ needRefresh: false }))
}));
