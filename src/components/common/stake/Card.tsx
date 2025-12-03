import type { FC, PropsWithChildren } from 'react';

import { InfoIcon } from '@/assets/svg';
import { Text } from '@/components/ui/Text';
import { Tooltip } from '@/components/ui/Tooltip';

import { View } from '../View';

type CardProps = PropsWithChildren & {
  title: string;

  tooltip?: string;
};

const Card: FC<CardProps> = ({ title, tooltip, children }) => {
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
        <View.Condition if={Boolean(tooltip)}>
          <Tooltip
            classNames={{
              content: 'stake-block__tooltip-content'
            }}
            hideArrow={true}
            content={<div className='stake-block__tooltip-block'>{tooltip}</div>}
            width={216}
          >
            <div className='stake-block__tooltip-icon'>
              <InfoIcon className='text-color-18' />
            </div>
          </Tooltip>
        </View.Condition>
      </div>
      <div className='p-10'>{children}</div>
    </section>
  );
};

export { Card };
