import { useRef, useState } from 'react';

import { CheckMarkIcon, ChevronIcon, ExternalLinkIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import type { DelegateSelectorProps } from '@/components/common/stake/DelegateSelector/type';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import type { Delegate } from '@/consts/common';
import { useDelegateSelector } from '@/hooks/useDelegateSelector';
import { useOutsideClick } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { noop, sliceAddress } from '@/lib/utils/common';
import { getExplorerAddressUrl } from '@/lib/utils/helpers';

export function DesktopDelegateSelector(props: DelegateSelectorProps) {
  const { disabled, selectedAddressDelegate, onSelect = noop } = props;

  const ref = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState('');

  const { isEnabled: isOpen, toggle: open, disable: close } = useSwitch();

  const filteredDelegates = useDelegateSelector(searchValue);

  const hasValue = !!selectedAddressDelegate;

  const onClose = () => {
    close();
    setSearchValue('');
  };

  const onDelegateSelect = (delegate: Delegate) => {
    onSelect(delegate);

    onClose();
  };

  const onSelectorOpen = () => {
    if (disabled) return;

    open();
  };

  useOutsideClick(() => ref.current, onClose);

  return (
    <div
      ref={ref}
      className={cn('relative hidden w-full lg:block', {
        'shadow-30 shadow-30-pulse rounded-lg': !hasValue
      })}
    >
      <div
        className={cn(
          'flex h-13 w-full cursor-pointer items-center justify-between gap-5 rounded-lg border border-solid p-3',
          {
            'border-color-white': !hasValue,
            'border-color-8': hasValue
          }
        )}
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
                className='text-color-2 max-w-25 truncate md:max-w-full'
              >
                {selectedAddressDelegate?.name || sliceAddress(selectedAddressDelegate?.address ?? '')}
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
                'border-color-31': !filteredDelegates.length && searchValue.length
              })}
              placeholder='Delegatee name or address'
              value={searchValue}
              onChange={setSearchValue}
            />
            <Condition if={!filteredDelegates.length}>
              <Text
                size='11'
                lineHeight='16'
                weight='500'
                className='text-color-31'
              >
                No delegate found
              </Text>
            </Condition>
          </div>
          <Condition if={filteredDelegates.length}>
            <div className='hide-scrollbar max-h-392 overflow-y-auto'>
              {filteredDelegates.map((el) => (
                <div
                  key={el.address}
                  className={cn(
                    'hover:bg-color-5 flex h-13 cursor-pointer items-center justify-between rounded-lg px-3 py-4',
                    {
                      'bg-color-5': selectedAddressDelegate?.address.toLowerCase() === el.address.toLowerCase()
                    }
                  )}
                  onClick={() => onDelegateSelect(el)}
                >
                  <div className='flex items-center gap-1.5'>
                    {selectedAddressDelegate?.address === el.address && (
                      <CheckMarkIcon className='text-color-27 size-5 shrink-0' />
                    )}
                    <Text
                      size='13'
                      weight='500'
                      lineHeight='16'
                      className='text-color-2 max-w-30 shrink-0 truncate'
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
