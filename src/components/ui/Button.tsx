import type { ButtonHTMLAttributes, FC } from 'react';

import { cn } from '@/lib/utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ children, className, disabled, ...props }) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center justify-center transition text-base p-3.5 h-11 hover:brightness-90 w-full bg-color-7 text-white rounded-3xl',
        { 'cursor-not-allowed': disabled },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
