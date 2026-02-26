import type { PropsWithChildren } from 'react';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { Tooltip } from '@/components/ui/Tooltip';

export interface CardProps extends PropsWithChildren {
  title: string;
  isLoading?: boolean;
  tooltip?: string;
}

export function Card(props: CardProps) {
  const { title, isLoading = false, tooltip, children } = props;

  return (
    <section className='bg-color-4 w-full rounded-lg'>
      <div className='bg-color-11 flex items-center gap-3 rounded-lg rounded-b-none px-5 py-3.5 lg:px-10'>
        <Skeleton loading={isLoading}>
          <Text
            size='13'
            weight='500'
            lineHeight='28'
          >
            {title}
          </Text>
        </Skeleton>
        <Condition if={tooltip}>
          <Tooltip content={tooltip}>
            <Skeleton loading={isLoading}>
              <InfoIcon className='text-color-18 size-4 cursor-pointer' />
            </Skeleton>
          </Tooltip>
        </Condition>
      </div>
      {children}
    </section>
  );
}
