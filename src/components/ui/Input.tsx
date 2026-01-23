import { type ReactNode, useCallback, useRef } from 'react';
import { type ChangeEvent, type InputHTMLAttributes } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { cn } from '@/lib/utils/cn';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  addonRight?: ReactNode;
  value: string;
  onChange: (value: string) => void;
};

export function Input(props: InputProps) {
  const { value, className, addonRight, onChange, autoFocus, ...rest } = props;

  const ref = useRef<HTMLInputElement>(null);

  const _onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      onChange(value);
    },
    [onChange]
  );

  useAutoFocus(ref, autoFocus);

  return (
    <div
      className={cn(
        'bg-color-10 border-color-8 flex h-13 w-full items-center justify-between gap-5 rounded-lg border border-solid py-2.5 pr-2.5 pl-5 text-[13px] leading-4.5 font-medium',
        className
      )}
    >
      <input
        className='placeholder:text-color-6 w-full placeholder:text-[13px] placeholder:font-medium focus:border-none focus:outline-none focus-visible:border-none focus-visible:outline-none'
        placeholder='0'
        value={value}
        onChange={_onChange}
        autoComplete='off'
        autoFocus={autoFocus}
        ref={ref}
        {...rest}
      />
      {addonRight}
    </div>
  );
}
