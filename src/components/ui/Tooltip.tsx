import { type PropsWithChildren, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

export interface TooltipProps extends PropsWithChildren {
  content: ReactNode;
  className?: string;
}

export function Tooltip(props: TooltipProps) {
  const { content, className, children } = props;

  return (
    <div className={cn('group relative inline-flex', className)}>
      <button
        type='button'
        className='inline-flex items-center focus:outline-none'
      >
        {children}
      </button>
      <div
        className={cn(
          'absolute z-50 max-w-54 min-w-54 rounded-lg p-4',
          'bg-color-4 text-color-24 shadow-md',
          'transition-opacity duration-200',
          'pointer-events-none opacity-0',
          'group-hover:pointer-events-auto group-hover:opacity-100',
          'hover:pointer-events-auto hover:opacity-100',
          'bottom-5 left-1/2 -translate-x-1/2 -translate-y-1'
        )}
      >
        <div className='relative text-[11px] leading-4 font-medium'>{content}</div>
      </div>
    </div>
  );
}
