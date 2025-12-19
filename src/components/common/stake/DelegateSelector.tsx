import { useCallback, useRef, useState } from 'react';

import { CheckMarkIcon, ChevronIcon, ExternalLinkIcon, InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import type { Delegate } from '@/consts/common';
import { useDelegateSelector } from '@/hooks/useDelegateSelector';
import { useOutsideClick } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { noop, sliceAddress } from '@/lib/utils/common';
import { getExplorerAddressUrl } from '@/lib/utils/helpers';

export type DelegateSelectorProps = {
  disabled?: boolean;
  selectedAddressDelegate: Delegate | null;
  onSelect?: (addressDelegate: Delegate | null) => void;
};

export function DelegateSelector(props: DelegateSelectorProps) {
  const { disabled, selectedAddressDelegate, onSelect = noop } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');

  const { isEnabled: isOpen, enable: open, disable: close } = useSwitch();

  const filteredDelegates = useDelegateSelector(searchValue);

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

  const onSelectorOpen = () => {
    if (disabled) return;

    open();
  };

  useOutsideClick(() => ref.current, onClose);

  return (
    <div
      ref={ref}
      className='relative w-full'
    >
      <div
        className='border-color-6 flex h-12 w-full max-w-88 cursor-pointer items-center justify-between gap-5 rounded-2xl border border-solid p-3'
        onClick={onSelectorOpen}
      >
        {!selectedAddressDelegate ? (
          <Text
            size='13'
            weight='500'
            lineHeight='16'
            className='text-color-6'
          >
            Choose delegatee
          </Text>
        ) : (
          <div className='flex w-full items-center justify-between'>
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
              href={getExplorerAddressUrl(selectedAddressDelegate?.address)}
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
        )}
        <ChevronIcon
          className={cn('text-color-6 size-4 rotate-180 transition-transform', {
            'rotate-0': isOpen
          })}
        />
      </div>
      <Condition if={isOpen}>
        <div className='border-color-8 bg-color-4 absolute top-13 flex max-h-95 w-full flex-col gap-7 rounded-2xl border border-solid p-6'>
          <div className='flex flex-col gap-2.5'>
            <Input
              autoFocus
              className={cn('min-h-13', {
                'border-color-22': !filteredDelegates.length && !!searchValue.length
              })}
              placeholder='Delegatee name or address'
              value={searchValue}
              onChange={setSearchValue}
            />
            <Condition if={!filteredDelegates.length}>
              <div className='bg-color-21 flex items-center gap-2.5 rounded-lg px-5 py-4.5'>
                <InfoIcon className='text-color-22' />
                <Text
                  size='11'
                  lineHeight='16'
                  className='text-color-22'
                >
                  No delegate found
                </Text>
              </div>
            </Condition>
          </div>
          <Condition if={!!filteredDelegates.length}>
            <div className='hide-scrollbar max-h-392 overflow-y-auto'>
              {filteredDelegates.map((el) => (
                <div
                  key={el.address}
                  className={cn('flex cursor-pointer items-center justify-between rounded-lg px-3 py-4', {
                    'bg-color-5': selectedAddressDelegate?.address === el.address
                  })}
                  onClick={() => onDelegateSelect(el)}
                >
                  <div className='flex items-center gap-1.5'>
                    {selectedAddressDelegate?.address === el.address && (
                      <CheckMarkIcon className='text-color-27 size-5' />
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
                    href={getExplorerAddressUrl(el.address)}
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
          </Condition>
        </div>
      </Condition>
    </div>
  );
}
