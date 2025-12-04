import { units } from '@/consts/consts';
import type { CurrencyType } from '@/shared/types/common';

export function calculateRoundedUnit(tokenDecimals: number, value: bigint, formatPrecision: number) {
  const baseUnit = BigInt(10 ** tokenDecimals);
  const scale = 10 ** (formatPrecision + 1);

  const units = Number((value * BigInt(scale)) / baseUnit) / scale;
  const roundingScale = 10 ** formatPrecision;

  return Math.round(units * roundingScale) / roundingScale;
}

export function formatUnits(num: number, currency?: CurrencyType) {
  const prefix = currency === 'USD' ? '$' : '';
  const digits = currency !== 'USD' ? 4 : 2;
  const threshold = 1 / 10 ** (digits + 1);

  if (num === 0 || isNaN(num)) return prefix + threshold.toFixed(digits);

  const sign = num < 0 ? '-' : '';
  const absNum = Math.abs(num);

  if (absNum < 1_000) {
    return (
      sign +
      prefix +
      absNum.toLocaleString('en-US', {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
        roundingMode: 'trunc'
      })
    );
  }

  for (const unit of units) {
    if (absNum >= unit.value) {
      return (
        sign +
        prefix +
        (absNum / unit.value).toLocaleString('en-US', {
          maximumFractionDigits: digits === 4 ? 2 : digits,
          minimumFractionDigits: digits === 4 ? 2 : digits,
          roundingMode: 'trunc'
        }) +
        unit.symbol
      );
    }
  }

  return sign + prefix + absNum.toLocaleString('en-US', { maximumFractionDigits: digits, roundingMode: 'trunc' });
}

export function formatValueInDollars(tokenDecimals: number, value: bigint): string {
  const formatPrecision = 2;

  const roundedUnits = calculateRoundedUnit(tokenDecimals, value, formatPrecision);

  return formatUnits(roundedUnits, 'USD');
}

export function formatUnitsCompact(units: number, currency?: CurrencyType): string {
  const raw = formatUnits(units, currency);

  const match = raw.match(/^([^A-Za-z]+)([A-Za-z].*)?$/);
  if (!match) return raw;

  const [, numericPart, suffix = ''] = match;
  const numeric = Number(numericPart?.replace(/,/g, ''));

  if (Number.isInteger(numeric)) {
    return `${numeric.toString()}${suffix}`;
  }

  return raw;
}

export function splitNumberUnit(value?: string): [string, string] {
  if (!value) {
    return ['', ''];
  }

  const match = value.match(/^([-+]?[$€£¥]?[\d,.]+(?:\.\d+)?)([a-zA-Z%]+)?$/);

  if (!match) return [value, ''];

  const numberPart: string = match[1] ?? '';
  const unit: string = match[2] ?? '';

  return [numberPart, unit];
}

export function formatRate(value: number, maximumFractionDigits = 2, minimumFractionDigits = 2): string {
  const rate = value * 100;

  return `${rate.toLocaleString('en-US', {
    maximumFractionDigits,
    minimumFractionDigits
  })}%`;
}
