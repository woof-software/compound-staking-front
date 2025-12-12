import { type ReactNode, useCallback, useRef } from 'react';
import { type ChangeEvent, type InputHTMLAttributes } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { cn } from '@/lib/utils/cn';
import { addressRegex } from '@/lib/utils/regex';

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

      const m = addressRegex.exec(value);

      if (m === null || m[0] !== value) return;

      onChange(value);
    },
    [onChange]
  );

  useAutoFocus(ref, autoFocus);

  return (
    <div
      className={cn(
        'w-full flex items-center gap-5 justify-between rounded-lg py-[9.5px] pr-2.5 pl-5 bg-color-10 !border !border-solid h-13 !border-color-8 !text-13 font-medium leading-4.5',
        className
      )}
    >
      <input
        className='focus-visible:outline-none w-full focus:outline-none focus-visible:border-none focus:border-none'
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
