import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center justify-center transition',
        { 'cursor-not-allowed': disabled },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
