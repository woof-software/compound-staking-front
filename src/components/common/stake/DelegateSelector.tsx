import { useCallback, useRef, useState } from 'react';

import { CheckMarkIcon, ChevronIcon, ExternalLinkIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import type { Delegate } from '@/consts/common';
import { useDelegateSelector } from '@/hooks/useDelegateSelector';
import { useOutsideClick } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { noop, sliceAddress } from '@/lib/utils/common';
import { getExplorerTxUrl } from '@/lib/utils/helpers';

export type DelegateSelectorProps = {
  selectedAddressDelegate: Delegate | null;
  onSelect?: (addressDelegate: Delegate | null) => void;
};

export function DelegateSelector(props: DelegateSelectorProps) {
  const { selectedAddressDelegate, onSelect = noop } = props;

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

  useOutsideClick(() => ref.current, onClose);

  return (
    <div
      ref={ref}
      className='relative w-full'
    >
      <div
        className='rounded-2xl flex h-12 gap-5 cursor-pointer items-center justify-between w-full max-w-88 border border-solid border-color-6 p-3'
        onClick={open}
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
              href={getExplorerTxUrl(selectedAddressDelegate?.address || '')}
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
            onChange={setSearchValue}
          />
          <div className='overflow-y-auto max-h-392 hide-scrollbar'>
            {filteredDelegates.map((el, index) => (
              <div
                key={`${el.address}-${index}`}
                className={cn('flex cursor-pointer items-center justify-between rounded-lg py-4 px-3', {
                  'bg-color-5': selectedAddressDelegate?.address === el.address
                })}
                onClick={() => onDelegateSelect(el)}
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
                  href={getExplorerTxUrl(selectedAddressDelegate?.address)}
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
