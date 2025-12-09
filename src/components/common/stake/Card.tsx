import type { PropsWithChildren } from 'react';

import { InfoIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Text } from '@/components/ui/Text';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils/cn';
import type { ClassNames } from '@/shared/types/common';

export interface CardProps extends PropsWithChildren {
  title: string;
  tooltip?: string;
  classNames?: ClassNames;
}

export function Card(props: CardProps) {
  const { title, tooltip, classNames, children } = props;

  return (
    <section className='rounded-lg bg-color-4 w-full'>
      <div className='flex items-center bg-color-11 rounded-lg rounded-b-none gap-3 py-3.5 px-10'>
        <Text
          size='13'
          weight='500'
          lineHeight='27'
          className='text-color-2'
        >
          {title}
        </Text>
        <Condition if={tooltip}>
          <Tooltip content={tooltip}>
            <InfoIcon className='text-color-18 size-4 cursor-pointer' />
          </Tooltip>
        </Condition>
      </div>
      <div className={cn('p-10', classNames?.content)}>{children}</div>
    </section>
  );
}
