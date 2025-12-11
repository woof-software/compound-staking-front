import { type ReactNode, useCallback, useRef } from 'react';
import { type ChangeEvent, type InputHTMLAttributes } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { cn } from '@/lib/utils/cn';
import type { ClassNames } from '@/shared/types/common';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  addonRight?: ReactNode;
  classNames?: ClassNames;
  value: string;
  onChange: (value: string) => void;
};

export function Input(props: InputProps) {
  const { value, classNames, addonRight, onChange: _onChange, autoFocus, ...rest } = props;

  const ref = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      _onChange(event.target.value);
    },
    [_onChange]
  );

  useAutoFocus(ref, autoFocus);

  return (
    <div className={cn('relative w-full', classNames?.wrapper)}>
      <input
        className={cn(
          'focus-visible:outline-none focus:outline-none focus-visible:border-none focus:border-none',
          classNames?.input
        )}
        placeholder='0'
        value={value}
        onChange={onChange}
        autoComplete='off'
        autoFocus={autoFocus}
        ref={ref}
        {...rest}
      />
      {addonRight}
    </div>
  );
}
