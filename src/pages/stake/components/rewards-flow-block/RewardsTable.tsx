import { useMemo, useState } from 'react';

import { SortArrowIcon, SortIcon } from '@/assets/svg';
import { SortDrawer } from '@/components/common/SortDrawer';
import { RewardRow } from '@/components/common/stake/RewardRow';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { ENV } from '@/consts/env';
import { useSwitch } from '@/hooks/useSwitch';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import { cn } from '@/lib/utils/cn';

export type RewardsTableItem = {
  vestingAmount: bigint;
  toClaim: bigint;
  claimedAmount: bigint;
  startDate: number;
  endDate: number;
};

type SortKey = keyof RewardsTableItem;

export type Column<T> = {
  accessorKey: keyof T;
  header: string;
  sort?: (a: T, b: T, direction: 'asc' | 'desc') => number;
};

const columns: Column<RewardsTableItem>[] = [
  {
    accessorKey: 'vestingAmount',
    header: 'Vesting Amount',
    sort: (a, b, direction) => {
      return Number(direction === 'asc' ? a.vestingAmount - b.vestingAmount : b.vestingAmount - a.vestingAmount);
    }
  },
  {
    accessorKey: 'toClaim',
    header: 'To claim',
    sort: (a, b, direction) => {
      return Number(direction === 'asc' ? a.toClaim - b.toClaim : b.toClaim - a.toClaim);
    }
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
    sort: (a, b, direction) => {
      return Number(direction === 'asc' ? a.claimedAmount - b.claimedAmount : b.claimedAmount - a.claimedAmount);
    }
  }
];

export function RewardsTable(props: { rows: RewardsTableItem[] }) {
  const { rows } = props;

  const [sortBy, setSortBy] = useState<SortKey>('startDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = useTokenPrice(ENV.BASE_TOKEN_PRICE_FEED_ADDRESS);

  const baseTokenPriceValue = baseTokenPrice ?? 0n;

  const sortType = {
    type: sortDir,
    key: sortBy
  };

  const sortedData = useMemo(() => {
    const col = columns.find((c) => c.accessorKey === sortBy);
    if (!col?.sort) return rows;

    return [...rows].sort((a, b) => col.sort!(a, b, sortDir));
  }, [rows, sortBy, sortDir]);

  const onHeaderClick = (accessorKey: SortKey) => {
    if (sortBy === accessorKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(accessorKey);
      setSortDir('asc');
    }
  };

  return (
    <>
      <div className='hidden lg:block'>
        <div className='border-color-8 grid grid-cols-5 items-center border-b-[0.5px] border-solid px-10 py-6'>
          {columns.map(({ accessorKey, header }) => {
            const active = sortBy === accessorKey;
            return (
              <div
                key={accessorKey}
                role='button'
                tabIndex={0}
                className='flex cursor-pointer items-center'
                onClick={() => onHeaderClick(accessorKey as SortKey)}
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
                    className={cn('text-color-24 size-[5px]', { 'opacity-50': active && sortDir === 'asc' })}
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
        <div className='hide-scrollbar m-0 max-h-300 overflow-y-auto lg:m-2'>
          {sortedData.map((row) => (
            <RewardRow
              key={`${row.startDate}-${row.endDate}`}
              baseTokenPriceValue={baseTokenPriceValue}
              isLoading={isBaseTokenPriceLoading}
              {...row}
            />
          ))}
        </div>
      </div>
      <div className='block lg:hidden'>
        <div className='flex flex-col gap-5 px-5 md:px-10'>
          <Divider orientation='horizontal' />
          <Button
            onClick={onOpen}
            className='border-color-8 bg-color-5 text-color-6 flex h-9 items-center justify-center gap-1.5 rounded-lg border-[0.5px] text-[11px] font-semibold'
          >
            <SortIcon className='text-color-6' />
            Sort
          </Button>
        </div>
        <div className='hide-scrollbar mt-5 max-h-300 overflow-y-auto'>
          {sortedData.map((row) => (
            <RewardRow
              key={`${row.startDate}-${row.endDate}`}
              baseTokenPriceValue={baseTokenPriceValue}
              isLoading={isBaseTokenPriceLoading}
              {...row}
            />
          ))}
        </div>
        <SortDrawer
          isOpen={isOpen}
          sortType={sortType}
          columns={columns}
          onClose={onClose}
          onKeySelect={setSortBy}
          onTypeSelect={setSortDir}
        />
      </div>
    </>
  );
}
