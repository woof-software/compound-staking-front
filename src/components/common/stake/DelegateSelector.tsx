import { useRef, useState } from 'react';
import type { Address } from 'viem';

import { CheckMarkIcon, ChevronIcon, ExternalLinkIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { DELEGATES, ETHERSCAN_TX_URL } from '@/consts/common';
import { useOutsideClick } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { sliceAddress } from '@/lib/utils/common';

export type DelegateSelectorProps = {
  disabled: boolean;
  selectedAddressDelegate: { name: string; address: Address } | null;
  onSelect: (addressDelegate: { name: string; address: Address } | null) => void;
};

export function DelegateSelector(props: DelegateSelectorProps) {
  const { disabled, selectedAddressDelegate, onSelect } = props;

  const ref = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState<string>('');

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const filteredDelegates = DELEGATES.filter(
    (el) =>
      el.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      el.address.toLowerCase().includes(searchValue.toLowerCase())
  );

  useOutsideClick(
    () => ref.current,
    () => {
      if (disabled) return;

      onClose();
    }
  );

  return (
    <div
      ref={ref}
      className='relative w-full'
    >
      <div
        className='rounded-2xl flex h-12 gap-5 cursor-pointer items-center justify-between w-full max-w-88 border border-solid border-color-6 p-3'
        onClick={onOpen}
      >
        <Condition if={!selectedAddressDelegate}>
          <Text
            size='13'
            weight='500'
            lineHeight='16'
            className='text-color-6'
          >
            Choose delegatee
          </Text>
        </Condition>
        <Condition if={selectedAddressDelegate && selectedAddressDelegate.name}>
          <div className='flex items-center w-full justify-between'>
            <div className='flex items-center gap-1.5'>
              <Text
                size='13'
                weight='500'
                lineHeight='16'
                className='text-color-2'
              >
                {selectedAddressDelegate?.name}
              </Text>
            </div>
            <a
              className='flex items-center gap-1.5'
              target='_blank'
              href={`${ETHERSCAN_TX_URL}${selectedAddressDelegate?.address}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Text
                size='13'
                weight='500'
                lineHeight='120'
                className='text-color-24'
              >
                {sliceAddress(selectedAddressDelegate?.address ?? '')}
              </Text>
              <ExternalLinkIcon className='text-color-24' />
            </a>
          </div>
        </Condition>
        <Condition if={selectedAddressDelegate && !selectedAddressDelegate.name}>
          <div className='flex items-center w-full justify-between'>
            <a
              className='flex items-center gap-1.5'
              target='_blank'
              href={`${ETHERSCAN_TX_URL}${selectedAddressDelegate?.address}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Text
                size='13'
                weight='500'
                lineHeight='120'
              >
                {sliceAddress(selectedAddressDelegate?.address ?? '', 18)}
              </Text>
            </a>
          </div>
        </Condition>
        <ChevronIcon
          className={cn('text-color-6 rotate-180 size-4 transition-transform', {
            'rotate-0': isOpen
          })}
        />
      </div>
      <Condition if={isOpen}>
        <div className='absolute rounded-2xl max-h-95 flex flex-col gap-7 top-13 w-full p-6 border border-solid border-color-8 bg-color-4'>
          <Input
            autoFocus
            className='min-h-13'
            placeholder='Delegatee name or address'
            value={searchValue}
            onChange={onSearchChange}
          />
          <div className='overflow-y-auto max-h-392 hide-scrollbar'>
            {filteredDelegates.map((el, index) => (
              <div
                key={`${el.address}-${index}`}
                className={cn('flex cursor-pointer items-center justify-between rounded-lg py-4 px-3', {
                  'bg-color-5': selectedAddressDelegate?.address === el.address
                })}
                onClick={() => onSelect(el)}
              >
                <div className='flex items-center gap-1.5'>
                  {selectedAddressDelegate?.address === el.address && (
                    <CheckMarkIcon className='size-5 text-color-27' />
                  )}
                  <Text
                    size='13'
                    weight='500'
                    lineHeight='16'
                    className='text-color-2'
                  >
                    {el.name}
                  </Text>
                </div>
                <a
                  className='flex items-center gap-1.5'
                  target='_blank'
                  href={`${ETHERSCAN_TX_URL}${selectedAddressDelegate?.address}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Text
                    size='13'
                    weight='500'
                    lineHeight='120'
                    className='text-color-24'
                  >
                    {sliceAddress(el.address)}
                  </Text>
                  <ExternalLinkIcon className='text-color-24' />
                </a>
              </div>
            ))}
          </div>
        </div>
      </Condition>
    </div>
  );
}
