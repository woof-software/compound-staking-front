import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  const { children, className, disabled, ...rest } = props;

  return (
    <button
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center justify-center transition text-base p-3.5 h-11 focus-visible:outline-none hover:brightness-90 w-full bg-color-7 rounded-3xl',
        { 'cursor-not-allowed bg-color-5 text-color-6': disabled },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
