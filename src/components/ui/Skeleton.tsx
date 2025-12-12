import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends ComponentProps<'div'> {
  loading?: boolean;
}

export function Skeleton(props: SkeletonProps) {
  const { className, children, ...rest } = props;

  const loading = true;

  return (
    <div
      className={cn(className, {
        'bg-color-24 opacity-10 text-transparent bg-clip-padding shrink-0 pointer-events-none select-none pulse-animation rounded-lg':
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
