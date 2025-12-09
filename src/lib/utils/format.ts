export namespace Format {
  export type FormatView = 'standard' | 'compact';
  /**
   * Formats a number as a USD price.
   * @example
   * e.g., price(12345.67, view: 'compact' ) -> '$12.35K'
   * e.g., price(12345.67, view: 'full' ) -> '$12,345.67'
   */
  export function price(value: number | string, view?: FormatView) {
    let numberValue = Number(value);
    const options: Intl.NumberFormatOptions = {};
    const locale = 'en-US';

    if (isNaN(numberValue) || !isFinite(numberValue)) {
      console.warn('Value is not');
      numberValue = 0;
    }

    options.maximumFractionDigits = 2;
    options.notation = view;
    options.style = 'currency';
    options.currency = 'USD';

    return new Intl.NumberFormat(locale, options).format(numberValue);
  }

  /**
   * Formats a number as a token amount with a symbol.
   * @example
   * e.g., token(12345, tokenSymbol: 'ETH', view: 'compact' ) -> '12.35K ETH'
   * e.g., token(123.45678, tokenSymbol: 'ETH', view: 'full') -> '123.4568 ETH'
   */
  export function token(value: number | string, view?: FormatView, tokenSymbol?: string) {
    let numberValue = Number(value);
    const options: Intl.NumberFormatOptions = {};
    const locale = 'en-US';

    if (isNaN(numberValue) || !isFinite(numberValue)) {
      console.warn('Value is not');
      numberValue = 0;
    }

    options.notation = view;
    options.maximumFractionDigits = 4;
    options.style = 'decimal';

    const formattedNumber = new Intl.NumberFormat(locale, options).format(numberValue);
    return tokenSymbol ? `${formattedNumber} ${tokenSymbol}` : formattedNumber;
  }

  /**
   * Formats a fractional numeric value as a percentage string.
   *
   * @param value - Fractional numeric value (e.g., `12.34` for `12.34%`).
   * @returns Localized percentage string, e.g. `12.35%`.
   *
   * @example
   * // default formatting
   * rate(12.35) // -> "12.35%"
   *
   * @example
   * // custom fraction digits
   * rate(10) // -> "10.00%"
   */
  export function rate(value: number): string {
    return `${value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;
  }
}

export namespace FormatUnits {
  export type Group = 3 | 6 | 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30 | 33;
  export type Unit = 'K' | 'M' | 'B' | 'T' | 'Q' | 'Qi' | 'Sx' | 'Sp' | 'Oc' | 'N' | 'D';

  export const min: Group = 3;
  export const max: Group = 33;

  export type UnitsMap = {
    [key in Group]: Unit;
  };

  const UNITS: UnitsMap = {
    3: 'K',
    6: 'M',
    9: 'B',
    12: 'T',
    15: 'Q',
    18: 'Qi',
    21: 'Sx',
    24: 'Sp',
    27: 'Oc',
    30: 'N',
    33: 'D'
  };

  export type Parsed = [number, Group, Unit];

  export function parse(str: bigint): Parsed {
    const asStr = str.toString();

    const exp = asStr.length - 1 || 0;

    const min = FormatUnits.min;
    const max = FormatUnits.max;

    const expGroup = Math.max(Math.min(Math.floor(exp / min) * min, max), min) as Group;

    const unit = UNITS[expGroup];

    return [exp, expGroup, unit];
  }
}
