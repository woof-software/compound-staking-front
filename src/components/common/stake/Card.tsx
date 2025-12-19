import type { PropsWithChildren } from 'react';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Text } from '@/components/ui/Text';
import { Tooltip } from '@/components/ui/Tooltip';

export interface CardProps extends PropsWithChildren {
  title: string;
  tooltip?: string;
}

export function Card(props: CardProps) {
  const { title, tooltip, children } = props;

  return (
    <section className='bg-color-4 w-full rounded-lg'>
      <div className='bg-color-11 flex items-center gap-3 rounded-lg rounded-b-none p-10 py-3.5'>
        <Text
          size='13'
          weight='500'
          lineHeight='28'
        >
          {title}
        </Text>
        <Condition if={tooltip}>
          <Tooltip content={tooltip}>
            <InfoIcon className='text-color-18 size-4 cursor-pointer' />
          </Tooltip>
        </Condition>
      </div>
      {children}
    </section>
  );
}
