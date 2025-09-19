// utils/currency.ts
interface CurrencyOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}

/**
 * Format number as currency
 * @param amount - The number to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string,
  options: CurrencyOptions = {}
): string {
  const {
    currency = "USD",
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true,
  } = options;

  // Convert string to number if needed
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (isNaN(numAmount)) {
    return showSymbol ? `$0.00` : "0.00";
  }

  // Format with Intl.NumberFormat
  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol ? "currency" : "decimal",
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(numAmount);
}

/**
 * Common currency formatters for different regions
 */
export const currencyFormatters = {
  // US Dollar
  usd: (amount: number | string) =>
    formatCurrency(amount, {
      currency: "USD",
      locale: "en-US",
    }),

  // Euro
  eur: (amount: number | string) =>
    formatCurrency(amount, {
      currency: "EUR",
      locale: "de-DE",
    }),

  // British Pound
  gbp: (amount: number | string) =>
    formatCurrency(amount, {
      currency: "GBP",
      locale: "en-GB",
    }),

  // Japanese Yen (no decimal places)
  jpy: (amount: number | string) =>
    formatCurrency(amount, {
      currency: "JPY",
      locale: "ja-JP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),

  // Indian Rupee
  inr: (amount: number | string) =>
    formatCurrency(amount, {
      currency: "INR",
      locale: "en-IN",
    }),

  // Cambodian Riel
  khr: (amount: number | string) =>
    formatCurrency(amount, {
      currency: "KHR",
      locale: "km-KH",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      showSymbol: true,
    })
      .replace("KHR", "៛") // replace currency string
      .replace(/\s+/g, ""), // remove all spaces
};

/**
 * Format currency without symbol (for inputs)
 */
export function formatCurrencyInput(amount: number | string): string {
  return formatCurrency(amount, { showSymbol: false });
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(currencyString: string): number {
  // Remove all non-numeric characters except decimal point and minus sign
  const cleanString = currencyString.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format currency for display with custom styling
 */
export function formatCurrencyWithSeparator(
  amount: number | string,
  options: CurrencyOptions & {
    integerClass?: string;
    decimalClass?: string;
  } = {}
) {
  const formatted = formatCurrency(amount, options);
  const { integerClass = "", decimalClass = "" } = options;

  if (!integerClass && !decimalClass) {
    return formatted;
  }

  // Split at decimal point
  const parts = formatted.split(".");
  if (parts.length === 2) {
    return {
      integer: parts[0],
      decimal: parts[1],
      integerClass,
      decimalClass,
    };
  }

  return {
    integer: formatted,
    decimal: "",
    integerClass,
    decimalClass,
  };
}

/**
 * React hook for currency formatting
 */
export function useCurrencyFormatter(defaultOptions: CurrencyOptions = {}) {
  const format = (amount: number | string, options?: CurrencyOptions) => {
    return formatCurrency(amount, { ...defaultOptions, ...options });
  };

  const parse = (currencyString: string) => {
    return parseCurrency(currencyString);
  };

  return { format, parse };
}
