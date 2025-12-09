export function calculateRoundedUnit(tokenDecimals: number, value: bigint, formatPrecision: number) {
  const baseUnit = BigInt(10 ** tokenDecimals);
  const scale = 10 ** (formatPrecision + 1);

  const units = Number((value * BigInt(scale)) / baseUnit) / scale;
  const roundingScale = 10 ** formatPrecision;

  return Math.round(units * roundingScale) / roundingScale;
}

export function splitNumberUnit(value?: string): [string, string] {
  if (!value) return ['', ''];

  const v = value.trim();
  if (!v) return ['', ''];

  const last = v.slice(-1);
  if (/\d/.test(last)) {
    return [v, ''];
  }

  let i = v.length - 1;
  while (i >= 0 && /[a-zA-Z%]/.test(v.charAt(i))) i--;

  const numberPart = v.slice(0, i + 1).trim();
  const unit = v.slice(i + 1).trim();

  if (!numberPart) return [v, ''];

  return [numberPart, unit];
}

export function formatRate(value: number, maximumFractionDigits = 2, minimumFractionDigits = 2): string {
  const rate = value * 100;

  return `${rate.toLocaleString('en-US', {
    maximumFractionDigits,
    minimumFractionDigits
  })}%`;
}
