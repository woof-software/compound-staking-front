import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  const { children, className, disabled, ...rest } = props;

  return (
    <button
      disabled={disabled}
      className={cn(
        'bg-color-7 flex h-11 w-full cursor-pointer items-center justify-center rounded-3xl p-3.5 text-base transition-all hover:brightness-90 focus-visible:outline-none',
        { 'bg-color-5 text-color-6 cursor-not-allowed': disabled },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
