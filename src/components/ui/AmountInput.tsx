import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  const hasDot = idx !== -1;
  const hasLeadingDot = raw.startsWith(dot);
  const dotAtEnd = raw.endsWith(dot);

  const wholeFormatted = wholeDigits === '' ? '' : wholeNum.toLocaleString('en');

  if (!hasDot) return wholeFormatted;
  if (dotAtEnd) return (wholeFormatted || '0') + dot;
  if (hasLeadingDot) return dot + fracDigits;

  return (wholeFormatted || '0') + dot + fracDigits;
}

function countCommasBeforePos(s: string, pos: number) {
  let n = 0;
  for (let i = 0; i < Math.min(pos, s.length); i++) if (s[i] === ',') n++;
  return n;
}

function caretFromNoCommaIndex(display: string, noCommaIndex: number) {
  let seen = 0;

  for (let i = 0; i <= display.length; i++) {
    if (i === display.length) return display.length;

    if (display[i] !== ',') {
      if (seen === noCommaIndex) return i;
      seen++;
    }
  }

  return display.length;
}

export function AmountInput(props: AmountInputProps) {
  const { integerPartLength = 16, decimals = 18, value, className, onChange, autoFocus, ...rest } = props;

  const ref = useRef<HTMLInputElement>(null);
  const [adjustedFontSize, setAdjustedFontSize] = useState<number>();

  const getInputFontSize = useFontSizeFitting({ border: 0.85 });

  const displayValue = formatWithCommas(value, decimals);

  const _onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Backspace') return;

      const el = e.currentTarget;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;

      if (start !== end) return;

      const before = el.value;
      if (start <= 0) return;

      const leftChar = before[start - 1];

      if (leftChar === ',') {
        e.preventDefault();

        const raw = value;

        const commasBefore = countCommasBeforePos(before, start);
        const caretNoComma = start - commasBefore;

        const removeIndex = caretNoComma - 1;
        if (removeIndex < 0) return;

        const nextRaw = raw.slice(0, removeIndex) + raw.slice(removeIndex + 1);
        onChange(nextRaw);

        requestAnimationFrame(() => {
          const input = ref.current;
          if (!input) return;

          const nextDisplay = formatWithCommas(nextRaw, decimals);

          const nextCaretNoComma = Math.max(0, removeIndex);
          const nextCaret = caretFromNoCommaIndex(nextDisplay, nextCaretNoComma);

          input.selectionStart = nextCaret;
          input.selectionEnd = nextCaret;
        });

        return;
      }

      if (leftChar === '.') {
        e.preventDefault();

        const raw = value;
        const dotIndex = raw.indexOf('.');
        if (dotIndex === -1) return;

        const commasBefore = countCommasBeforePos(before, start);
        const rawCaret = start - commasBefore;

        if (rawCaret <= 0 || raw[rawCaret - 1] !== '.') return;

        if (dotIndex === 1 && raw.startsWith('0.') && rawCaret === 2) {
          const nextRaw = raw.slice(2);
          onChange(nextRaw);

          requestAnimationFrame(() => {
            const input = ref.current;
            if (!input) return;
            input.selectionStart = 0;
            input.selectionEnd = 0;
          });

          return;
        }

        const digitIndex = dotIndex - 1;
        if (digitIndex < 0) return;

        const nextRaw = raw.slice(0, digitIndex) + raw.slice(digitIndex + 1);
        onChange(nextRaw);

        requestAnimationFrame(() => {
          const input = ref.current;
          if (!input) return;

          const nextDisplay = formatWithCommas(nextRaw, decimals);
          const nextDot = nextDisplay.indexOf('.');

          const nextCaret = nextDot >= 0 ? nextDot + 1 : Math.min(start - 1, nextDisplay.length);

          input.selectionStart = nextCaret;
          input.selectionEnd = nextCaret;
        });

        return;
      }
    },
    [value, onChange, decimals]
  );

  const _onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputEl = event.target;
      const caret = inputEl.selectionStart ?? 0;

      const nativeInputEvent = event.nativeEvent;
      const inputType = 'inputType' in nativeInputEvent ? nativeInputEvent?.inputType : undefined;

      const before = inputEl.value;
      const beforeCommas = (before.match(/,/g) || []).length;

      let rawValue = before.replace(/,/g, '');

      if (
        (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') &&
        rawValue.endsWith('.') &&
        rawValue !== '.'
      ) {
        rawValue = rawValue.slice(0, -1);
      }

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

        if ((inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') && before.endsWith('.')) {
          nextCaret -= 1;
        }

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
      className={cn('font-grot-disp focus:outline-none focus-visible:outline-none', className)}
      placeholder='0'
      value={displayValue}
      onKeyDown={_onKeyDown}
      onChange={_onChange}
      autoComplete='off'
      inputMode='decimal'
    />
  );
}
