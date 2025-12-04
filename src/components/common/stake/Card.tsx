import type { PropsWithChildren } from 'react';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Text } from '@/components/ui/Text';
import { Tooltip } from '@/components/ui/Tooltip';

export interface CardProps extends PropsWithChildren {
  title: string;

  tooltip?: string;
}

export function Card({ title, tooltip, children }: CardProps) {
  return (
    <section className='rounded-lg bg-color-4'>
      <div className='flex items-center bg-color-11 rounded-lg rounded-b-none gap-3 py-3.5 px-10'>
        <Text
          size='13'
          weight='500'
          lineHeight='27'
          className='text-color-2'
        >
          {title}
        </Text>
        <Condition if={Boolean(tooltip)}>
          <Tooltip
            hideArrow={true}
            content={tooltip}
            width={216}
          >
            <InfoIcon className='text-color-18 size-4' />
          </Tooltip>
        </Condition>
      </div>
      <div className='p-10'>{children}</div>
    </section>
  );
}
