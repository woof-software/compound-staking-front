import { useState } from 'react';

import { ArrowIcon, CheckMarkIcon, ChevronIcon, ExternalLinkIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import type { DelegateSelectorProps } from '@/components/common/stake/DelegateSelector/type';
import { Divider } from '@/components/ui/Divider';
import { Drawer } from '@/components/ui/Drawer';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { useDelegateSelector } from '@/hooks/useDelegateSelector';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { noop, sliceAddress } from '@/lib/utils/common';
import { getExplorerAddressUrl } from '@/lib/utils/helpers';

export function MobileDelegateSelector(props: DelegateSelectorProps) {
  const { disabled, selectedAddressDelegate, onSelect = noop } = props;

  const [searchValue, setSearchValue] = useState('');

  const { isEnabled: isOpen, toggle: open, disable: close } = useSwitch();

  const filteredDelegates = useDelegateSelector(searchValue);

  const hasValue = !!selectedAddressDelegate;

  const onSelectorOpen = () => {
    if (disabled) return;

    open();
  };

  const onClose = () => {
    close();
    setSearchValue('');
  };

  return (
    <>
      <div
        className={cn('relative block w-full lg:hidden', {
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
      </div>
      <Drawer
        contentClassName='bg-color-4'
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className='relative flex w-full items-center justify-center'>
          <ArrowIcon
            className='text-color-8 absolute left-0 size-6 rotate-180'
            onClick={onClose}
          />
          <Text
            size='17'
            weight='400'
            align='center'
            lineHeight='20'
            className='mx-auto'
          >
            Select a delegate
          </Text>
        </div>
        <Divider
          orientation='horizontal'
          className='my-8'
        />
        <div className='mb-4 flex flex-col gap-2.5'>
          <Input
            autoFocus
            className={cn('min-h-13', {
              'border-color-31': !filteredDelegates.length && searchValue.length
            })}
            placeholder='Search delegates by name or address'
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
              No delegates found
            </Text>
          </Condition>
        </div>
        <Condition if={filteredDelegates.length}>
          <div className='hide-scrollbar max-h-90 overflow-y-auto'>
            {filteredDelegates.map((el) => (
              <div
                key={el.address}
                className={cn(
                  'hover:bg-color-5 flex h-14 cursor-pointer items-center justify-between rounded-lg px-3 py-4',
                  {
                    'bg-color-5': selectedAddressDelegate?.address.toLowerCase() === el.address.toLowerCase()
                  }
                )}
                onClick={() => onSelect(el)}
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
      </Drawer>
    </>
  );
}
