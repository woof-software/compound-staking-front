import { create } from 'zustand';

type State = {
  needRefresh: boolean;
  triggerRefresh: () => void;
  resetRefresh: () => void;
};

export const useStatisticStore = create<State>((set) => ({
  needRefresh: false,
  triggerRefresh: () => set({ needRefresh: true }),
  resetRefresh: () => set({ needRefresh: false })
}));
