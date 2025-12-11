import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { type ChangeEvent, type InputHTMLAttributes } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useFontSizeFitting } from '@/hooks/useFontSizeFitting';
import { cn } from '@/lib/utils/cn';
import { spawnFloatRegex } from '@/lib/utils/regex';
import type { ClassNames } from '@/shared/types/common';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  integerPartLength?: number;
  decimals?: number;
  allowText?: boolean;
  addonRight?: ReactNode;
  classNames?: ClassNames;
  value: string;
  onChange: (value: string) => void;
};

export function Input(props: InputProps) {
  const {
    integerPartLength = 16,
    decimals = 18,
    value,
    classNames,
    allowText,
    addonRight,
    onChange: _onChange,
    autoFocus,
    ...rest
  } = props;

  const ref = useRef<HTMLInputElement>(null);

  const [adjustedFontSize, setAdjustedFontSize] = useState<number>();

  const getInputFontSize = useFontSizeFitting({
    border: 0.85
  });

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      if (allowText) {
        _onChange(value);
        return;
      }

      const regex = spawnFloatRegex(integerPartLength, decimals);
      const m = regex.exec(value);

      if (m === null || m[0] !== value) {
        const secondChar = value[1] || '';

        if (value.startsWith('0') && !Number.isNaN(+secondChar)) {
          value = secondChar;
        } else {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }

      _onChange(value);
    },
    [_onChange, allowText, decimals, integerPartLength]
  );

  useEffect(() => {
    const input = ref?.current;

    if (!input) return;

    const fontSize = getInputFontSize(input);

    setAdjustedFontSize(fontSize);
  }, [value, getInputFontSize, ref]);

  useAutoFocus(ref, autoFocus);

  return (
    <div className={cn('relative w-full', classNames?.wrapper)}>
      <input
        style={{ fontSize: `${adjustedFontSize}px` }}
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
