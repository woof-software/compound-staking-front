import { useCallback, useEffect, useRef, useState } from 'react';
import { type ChangeEvent, type FC, type InputHTMLAttributes, type MutableRefObject } from 'react';

import { COMPOUND_DECIMALS, DEFAULT_INTEGER_PART_LENGTH } from '@/consts/consts';
import { useFontSizeFitting } from '@/hooks/useFontSizeFitting';
import { spawnFloatRegex } from '@/lib/utils/regex';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
};

const Input: FC<InputProps> = ({ inputRef, value, className, onChange: _onChange, autoFocus, ...props }) => {
  const rootRef = useRef<HTMLInputElement>(null);

  const ref = inputRef ? inputRef : rootRef;

  const [adjustedFontSize, setAdjustedFontSize] = useState<number>();

  const getInputFontSize = useFontSizeFitting({
    border: 0.85
  });

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value.replace(/[^0-9.]/g, '');

      const regex = spawnFloatRegex(DEFAULT_INTEGER_PART_LENGTH, COMPOUND_DECIMALS);

      const m = regex.exec(value);

      if (m === null || m[0] !== value) {
        const secondChar = value[1];

        if (value.startsWith('0') && value.length > 1 && secondChar !== undefined && !Number.isNaN(+secondChar)) {
          value = secondChar;
        } else {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }

      _onChange(value);
    },
    [_onChange]
  );

  useEffect(() => {
    const input = ref?.current;

    if (!input) return;

    const fontSize = getInputFontSize(input);

    setAdjustedFontSize(fontSize);
  }, [value, getInputFontSize, ref]);

  useEffect(() => {
    if (!autoFocus) return;

    const input = ref?.current;

    if (!input) return;

    input.focus();
  }, [autoFocus, ref]);

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
      {...props}
    />
  );
};

export { Input };
