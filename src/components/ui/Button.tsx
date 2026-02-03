import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  const { children, className, disabled, ...rest } = props;

  return (
    <button
      disabled={disabled}
      className={cn(
        'bg-color-7 rounded-72 flex h-11 w-full cursor-pointer items-center justify-center p-3.5 text-base hover:brightness-90 focus-visible:outline-none',
        { 'bg-color-28 text-color-6 cursor-not-allowed': disabled },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
