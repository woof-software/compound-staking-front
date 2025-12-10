import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends ComponentProps<'div'> {
  loading?: boolean;
}

export function Skeleton(props: SkeletonProps) {
  const { className, loading, children, ...rest } = props;

  const skeletonClasses =
    'bg-color-24 opacity-10 text-transparent bg-clip-padding shrink-0 pointer-events-none select-none pulse-animation rounded-lg';

  if (loading) {
    return (
      <div
        data-slot='skeleton'
        className={cn(skeletonClasses, className)}
        {...rest}
      >
        <div className='invisible'>{children}</div>
      </div>
    );
  }

  return (
    <div
      data-slot='skeleton'
      className={cn(className)}
      {...rest}
    >
      {children}
    </div>
  );
}
