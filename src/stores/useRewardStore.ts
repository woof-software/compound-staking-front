import { create } from 'zustand';

type State = {
  needRewardRefresh: boolean;
  triggerRewardRefresh: () => void;
  resetRewardRefresh: () => void;
};

export const useRewardStore = create<State>((set) => ({
  needRewardRefresh: false,
  triggerRewardRefresh: () => set({ needRewardRefresh: true }),
  resetRewardRefresh: () => set({ needRewardRefresh: false })
}));
