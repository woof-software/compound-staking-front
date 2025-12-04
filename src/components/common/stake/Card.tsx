import type { PropsWithChildren } from 'react';

import { InfoIcon } from '@/assets/svg';
import { Text } from '@/components/ui/Text';
import { Tooltip } from '@/components/ui/Tooltip';

import { View } from '../View';

export type CardProps = PropsWithChildren & {
  title: string;

  tooltip?: string;
};

export function Card({ title, tooltip, children }: CardProps) {
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
        <View.Condition if={Boolean(tooltip)}>
          <Tooltip content={tooltip}>
            <InfoIcon className='text-color-18 size-4 cursor-pointer' />
          </Tooltip>
        </View.Condition>
      </div>
      <div className='p-10'>{children}</div>
    </section>
  );
}
