import { useCallback, useEffect, useRef, useState } from 'react';
import { type ChangeEvent, type InputHTMLAttributes } from 'react';

import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useFontSizeFitting } from '@/hooks/useFontSizeFitting';
import { cn } from '@/lib/utils/cn';
import { cleanCommas } from '@/lib/utils/helpers';
import { spawnFloatRegex } from '@/lib/utils/regex';

export type AmountInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  integerPartLength?: number;
  decimals?: number;
  value: string;
  onChange: (value: string) => void;
};

export function AmountInput(props: AmountInputProps) {
  const { integerPartLength = 16, decimals = 18, value, className, onChange, autoFocus, ...rest } = props;

  const ref = useRef<HTMLInputElement>(null);
  const [adjustedFontSize, setAdjustedFontSize] = useState<number>();

  const getInputFontSize = useFontSizeFitting({ border: 0.85 });

  const _onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      let rawValue = cleanCommas(event.target.value);

      const regex = spawnFloatRegex(integerPartLength, decimals);
      const m = regex.exec(rawValue);

      if (m === null || m[0] !== rawValue) {
        const secondChar = rawValue[1] || '';
        if (rawValue.startsWith('0') && !Number.isNaN(+secondChar) && secondChar !== '.') {
          rawValue = secondChar;
        } else {
          return;
        }
      }

      onChange(rawValue);
    },
    [onChange, decimals, integerPartLength]
  );

  useEffect(() => {
    const input = ref?.current;
    if (!input) return;
    const fontSize = getInputFontSize(input);
    setAdjustedFontSize(fontSize);
  }, [value, getInputFontSize]);

  useAutoFocus(ref, autoFocus);

  return (
    <input
      {...rest}
      ref={ref}
      style={{ fontSize: `${adjustedFontSize}px` }}
      className={cn(
        'font-grot-disp focus:border-none focus:outline-none focus-visible:border-none focus-visible:outline-none',
        className
      )}
      placeholder='0'
      value={value}
      onChange={_onChange}
      autoComplete='off'
    />
  );
}
