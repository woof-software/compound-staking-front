import { create } from 'zustand';

type State = {
  needDelegateRefresh: boolean;
  triggerDelegateRefresh: () => void;
  resetDelegateRefresh: () => void;
};

export const useDelegateStore = create<State>((set) => ({
  needDelegateRefresh: false,
  triggerDelegateRefresh: () => set({ needDelegateRefresh: true }),
  resetDelegateRefresh: () => set({ needDelegateRefresh: false })
}));
