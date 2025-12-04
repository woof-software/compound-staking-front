import { useCallback, useEffect, useState } from 'react';
import { type ChangeEvent, type InputHTMLAttributes, type MutableRefObject } from 'react';

import { COMPOUND_DECIMALS, DEFAULT_INTEGER_PART_LENGTH } from '@/consts/consts';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useFontSizeFitting } from '@/hooks/useFontSizeFitting';
import { spawnFloatRegex } from '@/lib/utils/regex';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  ref?: MutableRefObject<HTMLInputElement | null>;
  integerPartLength?: number;
  decimals?: number;
  value: string;
  onChange: (value: string) => void;
};

export function Input(props: InputProps) {
  const {
    ref,
    integerPartLength = DEFAULT_INTEGER_PART_LENGTH,
    decimals = COMPOUND_DECIMALS,
    value,
    className,
    onChange: _onChange,
    autoFocus,
    ...rest
  } = props;

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
      className={className}
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
