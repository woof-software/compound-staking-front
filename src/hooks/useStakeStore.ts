import { create } from 'zustand';

type State = {
  isStakeFlowDisabled: boolean;
  onIsStakeFlowDisabledToggle: (isStakeFlowDisabled: boolean) => void;
};

export const useStakeStore = create<State>((set) => ({
  isStakeFlowDisabled: false,
  onIsStakeFlowDisabledToggle: (isStakeFlowDisabled) => set(() => ({ isStakeFlowDisabled }))
}));
