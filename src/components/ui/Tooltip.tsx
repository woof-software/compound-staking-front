import { type PropsWithChildren, type ReactNode, useRef } from 'react';

import { MAX_1099 } from '@/consts/media';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useOutsideClick } from '@/hooks/useOnClickOutside';
import { useSwitch } from '@/hooks/useSwitch';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';

export interface TooltipProps extends PropsWithChildren {
  content: ReactNode;
  className?: string;
}

export function Tooltip(props: TooltipProps) {
  const { content, className, children } = props;

  const ref = useRef<HTMLDivElement>(null);

  const isBelow1100 = useMediaQuery(MAX_1099);

  const { isEnabled: isOpen, enable: onOpen, disable: onClose } = useSwitch();

  useOutsideClick(() => ref.current, isBelow1100 ? onClose : noop);

  const handleClick = () => {
    if (!isBelow1100) return;

    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex', className)}
    >
      <button
        onClick={handleClick}
        type='button'
        className='group inline-flex items-center focus:outline-none'
      >
        {children}
        <div
          className={cn(
            'pointer-events-none absolute z-50 w-full max-w-54 min-w-54 rounded-lg p-4',
            'bg-color-4 text-color-24 opacity-0 shadow-md',
            'bottom-5',
            {
              'left-1/2 -translate-x-1/2 -translate-y-1 transition-opacity duration-200 group-hover:opacity-100':
                !isBelow1100,
              '-left-17.5 opacity-100': isBelow1100 && isOpen
            }
          )}
        >
          <div className='relative text-[11px] leading-4 font-medium'>{content}</div>
        </div>
      </button>
    </div>
  );
}
