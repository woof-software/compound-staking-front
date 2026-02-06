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

function formatWithCommas(raw: string, decimals: number) {
  if (!raw) return '';

  const dot = '.';
  const idx = raw.indexOf(dot);

  let whole = raw;
  let frac = '';

  if (idx >= 0) {
    whole = raw.slice(0, idx);
    frac = raw.slice(idx + 1);
  }

  const wholeDigits = whole.replace(/\D/g, '');
  const wholeNum = parseInt(wholeDigits || '0', 10);

  const fracDigits = frac.replace(/\D/g, '').slice(0, decimals);

  const hasLeadingDot = raw.startsWith(dot);

  const wholeFormatted = wholeDigits === '' ? '' : wholeNum.toLocaleString('en');

  if (idx === -1) return wholeFormatted;
  if (raw.endsWith(dot)) return (wholeFormatted || '0') + dot;
  if (hasLeadingDot) return dot + fracDigits;

  return (wholeFormatted || '0') + dot + fracDigits;
}

export function AmountInput(props: AmountInputProps) {
  const { integerPartLength = 16, decimals = 18, value, className, onChange, autoFocus, ...rest } = props;

  const ref = useRef<HTMLInputElement>(null);
  const [adjustedFontSize, setAdjustedFontSize] = useState<number>();

  const getInputFontSize = useFontSizeFitting({ border: 0.85 });

  const displayValue = formatWithCommas(value, decimals);

  const _onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputEl = event.target;
      const caret = inputEl.selectionStart ?? 0;

      const before = inputEl.value;
      const beforeCommas = (before.match(/,/g) || []).length;

      let rawValue = before.replace(/,/g, '');

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

      const nextDisplay = formatWithCommas(rawValue, decimals);
      const nextCommas = (nextDisplay.match(/,/g) || []).length;

      onChange(rawValue);

      requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;

        let nextCaret = caret;

        if (nextCommas > beforeCommas) nextCaret += 1;

        if (nextCommas < beforeCommas) nextCaret -= 1;

        nextCaret = Math.max(0, Math.min(nextCaret, nextDisplay.length));

        el.selectionStart = nextCaret;
        el.selectionEnd = nextCaret;
      });
    },
    [onChange, decimals, integerPartLength]
  );

  useEffect(() => {
    const input = ref.current;
    if (!input) return;

    const fontSize = getInputFontSize(input);

    setAdjustedFontSize(fontSize);
  }, [displayValue, getInputFontSize]);

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
      value={displayValue} // показываем с запятыми
      onChange={_onChange}
      autoComplete='off'
      inputMode='decimal'
    />
  );
}
