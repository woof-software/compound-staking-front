import { useRef, useState } from 'react';

import { useClickOutside } from './useClickOutside';

interface HookProps<T> {
  initialSelected?: T | null;

  onSelected?: (selected: T) => void;
}

function useSelect<T>({ initialSelected, onSelected }: HookProps<T>) {
  const [selected, setSelected] = useState<T | null>(initialSelected || null);

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const onOpen = () => setIsOpen(true);

  const onClose = () => setIsOpen(false);

  const onSelect = (option: T) => {
    setSelected(option);

    onSelected?.(option);

    onClose();
  };

  useClickOutside(() => containerRef.current, onClose);

  return {
    containerRef,
    selected,
    isOpen,
    onOpen,
    onClose,
    onSelect
  };
}

export { useSelect };
