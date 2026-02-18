import { type PropsWithChildren, type ReactNode } from 'react';

import { Drawer } from '@/components/ui/Drawer';
import { Text } from '@/components/ui/Text';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';

export interface TooltipProps extends PropsWithChildren {
  content: ReactNode;
  className?: string;
}

export function Tooltip(props: TooltipProps) {
  const { content, className, children } = props;

  const { isEnabled: isOpen, toggle: onOpen, disable: onClose } = useSwitch();

  return (
    <>
      <div className={cn('relative inline-flex', className)}>
        <button
          type='button'
          className='group inline-flex items-center focus:outline-none'
        >
          {children}
          <div
            className={cn(
              'pointer-events-none absolute z-50 w-full max-w-54 min-w-54 rounded-lg p-4',
              'bg-color-4 text-color-24 shadow-md',
              'transition-opacity duration-200',
              'opacity-0 group-hover:opacity-100',
              'bottom-5 left-1/2 -translate-x-1/2 -translate-y-1'
            )}
          >
            <div className='relative text-[11px] leading-4 font-medium'>{content}</div>
          </div>
        </button>
      </div>
      <div className={cn('group relative inline-flex lg:hidden', className)}>
        <button
          onClick={onOpen}
          type='button'
          className='inline-flex items-center focus:outline-none'
        >
          {children}
        </button>
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
        >
          <Text
            size='11'
            lineHeight='16'
            weight='500'
          >
            {content}
          </Text>
        </Drawer>
      </div>
    </>
  );
}
