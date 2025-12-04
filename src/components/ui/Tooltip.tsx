import type { FC, HTMLAttributes, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

type DivProps = Omit<HTMLAttributes<HTMLDivElement>, 'content'>;

type TooltipProps = DivProps & {
  content: ReactNode;
  className?: string;
  children: ReactNode;
};

const Tooltip: FC<TooltipProps> = ({ content, children, className, ...rest }) => {
  const tooltipId = useId();

  const [visible, setVisible] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const show = () => setVisible(true);

  const hide = () => setVisible(false);

  return (
    <div
      ref={wrapperRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      {...rest}
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
          'absolute z-50 p-4 rounded-lg w-full max-w-[216px] min-w-[216px]',
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
};

export { Tooltip };
