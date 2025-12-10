import { type ReactNode, useMemo, useState } from 'react';

import { SortArrowIcon } from '@/assets/svg';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils/cn';
import { getComparable } from '@/lib/utils/common';

export type SortType = 'string' | 'number' | 'date';

export type Column = { accessorKey: string; header: string; sortType?: SortType };

export interface TableProps<T> {
  data: T[];
  columns: Column[];
  children: (row: T) => ReactNode;
}

export function Table<T extends Record<string, any>>(props: TableProps<T>) {
  const { data, columns, children } = props;

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    const col = columns.find((c) => c.accessorKey === sortBy);
    const type = col?.sortType ?? 'string';

    const sorted = [...data].sort((a, b) => {
      const firstVal = getComparable(a, sortBy, type);
      const secondVal = getComparable(b, sortBy, type);

      if (typeof firstVal === 'number' && typeof secondVal === 'number') {
        return firstVal - secondVal;
      }

      if (typeof firstVal === 'string' && typeof secondVal === 'string') {
        return firstVal.localeCompare(secondVal);
      }

      return 0;
    });

    return sortDir === 'asc' ? sorted : sorted.reverse();
  }, [data, columns, sortBy, sortDir]);

  const onHeaderClick = (accessorKey: string) => {
    if (sortBy === accessorKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(accessorKey);
      setSortDir('asc');
    }
  };

  return (
    <div>
      <div className='py-6 px-10 border border-l-0 border-r-0 border-solid border-color-8 grid grid-cols-5 items-center'>
        {columns.map(({ accessorKey, header }) => {
          const active = sortBy === accessorKey;

          return (
            <div
              key={accessorKey}
              role='button'
              tabIndex={0}
              className='flex items-center cursor-pointer'
              onClick={() => onHeaderClick(accessorKey)}
            >
              <Text
                tag='span'
                size='11'
                weight='500'
                lineHeight='16'
                className='text-color-24'
              >
                {header}
              </Text>
              <div className='flex flex-col gap-0.5 justify-center p-1'>
                <SortArrowIcon
                  className={cn('text-color-24 w-[5px] h-[3px]', {
                    'opacity-50': active && sortDir === 'asc'
                  })}
                />
                <SortArrowIcon
                  className={cn('rotate-180 text-color-24 w-[5px] h-[3px]', {
                    'opacity-50': active && sortDir === 'desc'
                  })}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className='m-2'>{sortedData.map((el) => children(el))}</div>
    </div>
  );
}
