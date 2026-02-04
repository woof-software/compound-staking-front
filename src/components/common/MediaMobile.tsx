import { type PropsWithChildren } from 'react';

import { Text } from '@/components/ui/Text';

export function MediaMobile(props: PropsWithChildren) {
  const { children } = props;

  return (
    <>
      <div className='hidden min-[1100px]:block'>{children}</div>
      <div className='bg-color-4 flex w-full flex-col items-center justify-center gap-5 rounded-lg px-5 py-40 min-[1100px]:hidden'>
        <div className='no-available-mobile h-20 w-44' />
        <Text
          size='15'
          weight='500'
          lineHeight='140'
          className='text-color-2'
        >
          Not available on mobile yet
        </Text>
        <Text
          size='15'
          align='center'
          weight='500'
          lineHeight='140'
          className='text-color-24 max-w-43'
        >
          Please use the desktop version for now
        </Text>
      </div>
    </>
  );
}
