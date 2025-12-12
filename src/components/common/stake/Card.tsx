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
    <section className='rounded-lg bg-color-4 w-full'>
      <div className='flex items-center bg-color-11 py-3.5 p-10 rounded-lg rounded-b-none gap-3'>
        <Text
          size='13'
          weight='500'
          lineHeight='27'
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
