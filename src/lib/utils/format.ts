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
  export function parse(value: number): string {
    if (value < 1000) return '';

    if (value < 1_000_000) return 'K';
    if (value < 1_000_000_000) return 'M';
    if (value < 1_000_000_000_000) return 'B';

    return 'T';
  }
}
