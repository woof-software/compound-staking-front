import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils/cn';

type SortDirection = 'asc' | 'desc';

type SortAdapter<T extends string> = {
  key: T;
  type: SortDirection;
};

type SortAccessor<T extends string> = {
  header: string;
  accessorKey: T;
};

interface SortDrawerProps<T extends string> {
  isOpen: boolean;
  sortType: SortAdapter<T>;
  columns: SortAccessor<T>[];
  onClose: () => void;
  onKeySelect: (value: T) => void;
  onTypeSelect: (value: SortDirection) => void;
}

type TabValue = 'Ascending' | 'Descending';

export function SortDrawer<T extends string>({
  isOpen,
  sortType,
  columns,
  onClose,
  onKeySelect,
  onTypeSelect
}: SortDrawerProps<T>) {
  const DEFAULT_KEY = 'startDate' as T;
  const DEFAULT_TYPE: SortDirection = 'desc';
  const DEFAULT_TAB: TabValue = 'Descending';

  const [tabValue, setTabValue] = useState<string>(sortType?.type === 'asc' ? 'Ascending' : 'Descending');
  const [radioValue, setRadioValue] = useState<T | null>(sortType.key ?? null);

  const initButtonValues = useMemo(() => {
    return {
      tabValue,
      radioValue
    };
  }, [isOpen]);

  const canClearAll = radioValue !== DEFAULT_KEY || tabValue !== DEFAULT_TAB;

  const isApplyButtonDisabled = Boolean(radioValue) && Boolean(tabValue);

  const isApplyButtonChanged = initButtonValues.tabValue !== tabValue || initButtonValues.radioValue !== radioValue;

  const onTabsChange = useCallback((value: TabValue) => {
    setTabValue(value);
  }, []);

  const onApply = useCallback(() => {
    if (!radioValue) return;

    onKeySelect(radioValue);
    onTypeSelect(tabValue === 'Ascending' ? 'asc' : 'desc');

    onClose();
  }, [onClose, onKeySelect, onTypeSelect, radioValue, tabValue]);

  const onClearAll = useCallback(() => {
    setRadioValue(DEFAULT_KEY);
    setTabValue(DEFAULT_TAB);

    onKeySelect(DEFAULT_KEY);
    onTypeSelect(DEFAULT_TYPE);

    onClose();
  }, [onClose, onKeySelect, onTypeSelect]);

  const onDrawerClose = useCallback(() => {
    setRadioValue(sortType?.key);

    setTabValue(sortType?.type === 'asc' ? 'Ascending' : 'Descending');

    onKeySelect(sortType?.key);

    onTypeSelect(sortType?.type);

    onClose();
  }, [onClose, onKeySelect, onTypeSelect, sortType]);

  return (
    <Drawer
      contentClassName='bg-color-4'
      isOpen={isOpen}
      onClose={onDrawerClose}
    >
      <Text
        size='17'
        weight='500'
        lineHeight='20'
        align='center'
        className='w-full'
      >
        Sort
      </Text>
      <div className='mt-8 mb-10 flex w-full justify-center'>
        <div className='border-color-8 bg-color-5 flex h-10.5 min-w-52 items-center justify-between rounded-lg border-[0.5px] p-1'>
          {(['Ascending', 'Descending'] as const).map((value) => (
            <button
              key={value}
              type='button'
              onClick={() => onTabsChange(value)}
              className={cn('flex h-8.5 w-24 items-center justify-center rounded-sm', {
                'border-color-8 bg-color-4 border-[0.5px]': tabValue === value
              })}
            >
              <Text
                tag='span'
                size='14'
                weight='500'
                lineHeight='16'
                className='text-color-2'
              >
                {value}
              </Text>
            </button>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {columns.map((column) => {
          const active = column.accessorKey === radioValue;

          return (
            <button
              key={column.accessorKey}
              type='button'
              onClick={() => setRadioValue(column.accessorKey)}
              className={cn('flex h-10.5 items-center gap-5 rounded-lg p-3 text-left', {
                'bg-color-5': active
              })}
            >
              <div
                className={cn('border-color-24 flex size-4 items-center justify-center rounded-full border', {
                  'border-color-7 border-4': active
                })}
              >
                {active && <div className='size-2 rounded-full bg-transparent' />}
              </div>
              <Text
                size='14'
                weight='500'
                className={cn('text-color-24', {
                  'text-color-2': active
                })}
              >
                {column.header}
              </Text>
            </button>
          );
        })}
      </div>
      <div className='mt-5 flex w-full gap-3'>
        <Button
          disabled={!canClearAll}
          onClick={onClearAll}
          className={cn('h-11 text-[11px] font-medium', {
            'border-color-7 text-color-2 border-2 bg-transparent': canClearAll
          })}
        >
          Clear All
        </Button>
        <Button
          disabled={!Boolean(isApplyButtonDisabled && isApplyButtonChanged)}
          onClick={onApply}
          className='h-11 text-[11px] font-medium'
        >
          <Text
            tag='p'
            size='11'
            weight='500'
            align='center'
            className={cn('text-color-6', {
              'text-white': Boolean(isApplyButtonDisabled && isApplyButtonChanged)
            })}
          >
            Apply
          </Text>
        </Button>
      </div>
    </Drawer>
  );
}
