import { useMemo, useState } from 'react';

import { SortArrowIcon } from '@/assets/svg';
import { RewardRow, type RewardRowProps } from '@/components/common/stake/RewardRow';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils/cn';

type SortKey = keyof RewardRowProps;

export type Column<Row> = {
  accessorKey: keyof Row;
  header: string;
  sort?: (a: RewardRowProps, b: RewardRowProps, direction: 'asc' | 'desc') => number;
};

const columns: Column<RewardRowProps>[] = [
  {
    accessorKey: 'vestingAmount',
    header: 'Vesting Amount',
    sort: (a, b, direction) =>
      direction === 'asc' ? a.vestingAmount - b.vestingAmount : b.vestingAmount - a.vestingAmount
  },
  {
    accessorKey: 'toClaim',
    header: 'To claim',
    sort: (a, b, direction) => (direction === 'asc' ? a.toClaim - b.toClaim : b.toClaim - a.toClaim)
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    sort: (a, b, direction) => (direction === 'asc' ? a.startDate - b.startDate : b.startDate - a.startDate)
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    sort: (a, b, direction) => (direction === 'asc' ? a.endDate - b.endDate : b.endDate - a.endDate)
  },
  {
    accessorKey: 'claimedAmount',
    header: 'Claimed Amount',
    sort: (a, b, direction) =>
      direction === 'asc' ? a.claimedAmount - b.claimedAmount : b.claimedAmount - a.claimedAmount
  }
];

const data = [
  {
    vestingAmount: 5000,
    claimedAmount: 3500,
    toClaim: 1500,
    startDate: Date.parse('2025-01-01T00:00:00Z'),
    endDate: Date.parse('2025-02-01T00:00:00Z'),
    vestingStartDate: Date.parse('2024-12-01T00:00:00Z'),
    vestingEndDate: Date.parse('2025-06-01T00:00:00Z'),
    percents: 30
  },
  {
    vestingAmount: 10000,
    claimedAmount: 2500,
    toClaim: 7500,
    startDate: Date.parse('2024-11-15T12:00:00Z'),
    endDate: Date.parse('2025-05-15T12:00:00Z'),
    vestingStartDate: Date.parse('2024-11-01T00:00:00Z'),
    vestingEndDate: Date.parse('2026-11-01T00:00:00Z'),
    percents: 25
  }
];

export function RewardsTable() {
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    const col = columns.find((c) => c.accessorKey === sortBy);
    if (!col || !col.sort) return data;

    const sort = col.sort;

    return [...data].sort((a, b) => sort(a, b, sortDir));
  }, [sortBy, sortDir]);

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
      <div className='border-color-8 grid grid-cols-5 items-center border border-r-0 border-l-0 border-solid px-10 py-6'>
        {columns.map(({ accessorKey, header }) => {
          const active = sortBy === accessorKey;

          return (
            <div
              key={accessorKey}
              role='button'
              tabIndex={0}
              className='flex cursor-pointer items-center'
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
              <div className='flex flex-col justify-center p-1'>
                <SortArrowIcon
                  className={cn('text-color-24 size-[5px]', {
                    'opacity-50': active && sortDir === 'asc'
                  })}
                />
                <SortArrowIcon
                  className={cn('text-color-24 size-[5px] rotate-180', {
                    'opacity-50': active && sortDir === 'desc'
                  })}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className='m-2'>
        {sortedData.map((row, index) => (
          <RewardRow
            key={index}
            {...row}
          />
        ))}
      </div>
    </div>
  );
}
