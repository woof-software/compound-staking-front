import { useMemo } from 'react';

import { DELEGATES } from '@/consts/common';

export function useDelegateSelector(search?: string) {
  return useMemo(() => {
    if (!search) return DELEGATES;

    const pattern = search.toLowerCase();

    return DELEGATES.filter(({ name, address }) => {
      return name.toLowerCase().includes(pattern) || address.toLowerCase().includes(pattern);
    });
  }, [search]);
}
