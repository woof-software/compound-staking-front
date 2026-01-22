import { create } from 'zustand';

type ToClaimState = {
  byKey: Map<string, bigint>;
  total: bigint;

  setRow: (key: string, value: bigint) => void;
  removeRow: (key: string) => void;
};

export const useToClaimLiveStore = create<ToClaimState>((set, get) => ({
  byKey: new Map(),
  total: 0n,

  setRow: (key, value) => {
    const { byKey, total } = get();

    const prev = byKey.get(key) ?? 0n;
    if (prev === value) return;

    const nextMap = new Map(byKey);
    nextMap.set(key, value);

    set({
      byKey: nextMap,
      total: total - prev + value
    });
  },

  removeRow: (key) => {
    const { byKey, total } = get();

    const prev = byKey.get(key);
    if (prev === undefined) return;

    const nextMap = new Map(byKey);
    nextMap.delete(key);

    set({
      byKey: nextMap,
      total: total - prev
    });
  }
}));
