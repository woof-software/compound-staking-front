import type { PropsWithChildren, ReactNode } from 'react';
import { useId } from 'react';

import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';

export interface TooltipProps extends PropsWithChildren {
  content: ReactNode;
  className?: string;
}

export function Tooltip(props: TooltipProps) {
  const { content, className, children } = props;

  const tooltipId = useId();

  const { isEnabled: visible, enable: show, disable: hide } = useSwitch();

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span
        aria-describedby={visible ? tooltipId : undefined}
        className='inline-flex items-center focus:outline-none'
        tabIndex={0}
      >
        {children}
      </span>
      <div
        id={tooltipId}
        role='tooltip'
        className={cn(
          'absolute z-50 p-4 rounded-lg w-full max-w-54 min-w-54',
          'bg-color-4 text-color-24 shadow-md',
          'transition-opacity duration-200',
          'opacity-0 pointer-events-auto',
          'bottom-5 left-1/2 -translate-x-1/2 -translate-y-1',
          {
            'opacity-100 pointer-events-none': visible
          }
        )}
      >
        <div className='relative text-[11px] font-medium leading-4'>{content}</div>
      </div>
    </div>
  );
}
