import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends ComponentProps<'div'> {
  loading?: boolean;
}

export function Skeleton(props: SkeletonProps) {
  const { className, loading, children, ...rest } = props;

  return (
    <div
      className={cn(className, {
        'bg-color-24 pulse-animation pointer-events-none shrink-0 rounded-lg bg-clip-padding text-transparent opacity-10 select-none':
          loading
      })}
      {...rest}
    >
      <div
        className={cn({
          invisible: loading
        })}
      >
        {children}
      </div>
    </div>
  );
}
