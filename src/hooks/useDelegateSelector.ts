import { useCallback, useMemo, useRef, useState } from 'react';

import { useSwitch } from '@/hooks/useSwitch';

export type Delegate = { name: string; address: string };

type UseDelegateSelectorArgs = {
  delegates: Delegate[];
  onSelect: (delegate: Delegate | null) => void;
};

export function useDelegateSelector({ delegates, onSelect }: UseDelegateSelectorArgs) {
  const ref = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');

  const { isEnabled: isOpen, enable: open, disable: close } = useSwitch();

  const filteredDelegates = useMemo(() => {
    const searchTarget = searchValue.trim().toLowerCase();
    if (!searchTarget) return delegates;

    return delegates.filter(
      (el) => el.name.toLowerCase().includes(searchTarget) || el.address.toLowerCase().includes(searchTarget)
    );
  }, [delegates, searchValue]);

  const onClose = useCallback(() => {
    close();
    setSearchValue('');
  }, [close]);

  const onDelegateSelect = useCallback(
    (delegate: Delegate) => {
      onSelect(delegate);
      onClose();
    },
    [onSelect, onClose]
  );

  return {
    ref,
    isOpen,
    searchValue,
    filteredDelegates,
    open,
    onClose,
    setSearchValue,
    onDelegateSelect
  };
}
