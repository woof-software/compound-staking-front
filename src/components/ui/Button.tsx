import type { ButtonHTMLAttributes, FC } from 'react';

import { cn } from '@/lib/utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, className, disabled, ...props }) => {
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
};

export { Button };
