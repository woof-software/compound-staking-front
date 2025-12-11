import { useCallback, useEffect, useRef, useState } from 'react';
import { type ChangeEvent, type InputHTMLAttributes } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useFontSizeFitting } from '@/hooks/useFontSizeFitting';
import { cn } from '@/lib/utils/cn';
import { spawnFloatRegex } from '@/lib/utils/regex';

export type AmountInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  integerPartLength?: number;
  decimals?: number;
  value: string;
  onChange: (value: string) => void;
};

export function AmountInput(props: AmountInputProps) {
  const { integerPartLength = 16, decimals = 18, value, className, onChange: _onChange, autoFocus, ...rest } = props;

  const ref = useRef<HTMLInputElement>(null);

  const [adjustedFontSize, setAdjustedFontSize] = useState<number>();

  const getInputFontSize = useFontSizeFitting({
    border: 0.85
  });

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

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
    [_onChange, decimals, integerPartLength]
  );

  useEffect(() => {
    const input = ref?.current;

    if (!input) return;

    const fontSize = getInputFontSize(input);

    setAdjustedFontSize(fontSize);
  }, [value, getInputFontSize, ref]);

  useAutoFocus(ref, autoFocus);

  return (
    <input
      style={{ fontSize: `${adjustedFontSize}px` }}
      className={cn(
        'focus-visible:outline-none focus:outline-none focus-visible:border-none focus:border-none',
        className
      )}
      placeholder='0'
      value={value}
      onChange={onChange}
      autoComplete='off'
      autoFocus={autoFocus}
      ref={ref}
      {...rest}
    />
  );
}
