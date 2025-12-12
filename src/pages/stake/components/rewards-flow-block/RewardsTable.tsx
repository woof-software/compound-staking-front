import { useMemo, useState } from 'react';

import { SortArrowIcon } from '@/assets/svg';
import { RewardRow, type RewardRowProps } from '@/components/common/stake/RewardRow';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils/cn';

type SortKey = keyof RewardRowProps;

export type Column<Row> = {
  accessorKey: keyof Row;
  header: string;
  sort?: (a: RewardRowProps, b: RewardRowProps) => number;
};

export interface RewardsTableProps {
  data: RewardRowProps[];
  columns: Column<RewardRowProps>[];
}

export function RewardsTable(props: RewardsTableProps) {
  const { data, columns } = props;

  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    const col = columns.find((c) => c.accessorKey === sortBy);

    if (!col || !col.sort) return data;

    const sorted = [...data].sort(col.sort);

    return sortDir === 'asc' ? sorted : sorted.reverse();
  }, [data, columns, sortBy, sortDir]);

  const onHeaderClick = (accessorKey: SortKey) => {
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
              key={String(accessorKey)}
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
      <div className='m-2'>
        {sortedData.map((row) => (
          <RewardRow
            key={row.id}
            {...row}
          />
        ))}
      </div>
    </div>
  );
}
