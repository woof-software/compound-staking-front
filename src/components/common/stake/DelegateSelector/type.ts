import type { Delegate } from '@/consts/common';

export type DelegateSelectorProps = {
  disabled?: boolean;
  selectedAddressDelegate: Delegate | null;
  onSelect?: (addressDelegate: Delegate | null) => void;
};
