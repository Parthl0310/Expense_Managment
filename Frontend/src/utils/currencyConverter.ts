// Currency conversion utilities

export interface CurrencyRate {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface Country {
  name: { common: string };
  currencies: Record<string, { name: string; symbol: string }>;
}

// Mock currency rates for development
export const mockCurrencyRates: CurrencyRate = {
  base: 'INR',
  date: '2024-01-15',
  rates: {
    'USD': 0.012,
    'EUR': 0.011,
    'GBP': 0.0095,
    'JPY': 1.78,
    'CAD': 0.016,
    'AUD': 0.018,
    'SGD': 0.016,
    'CHF': 0.010,
    'CNY': 0.085,
    'INR': 1.0
  }
};

// Mock countries data for development
export const mockCountries: Country[] = [
  { name: { common: 'India' }, currencies: { INR: { name: 'Indian Rupee', symbol: '₹' } } },
  { name: { common: 'United States' }, currencies: { USD: { name: 'US Dollar', symbol: '$' } } },
  { name: { common: 'United Kingdom' }, currencies: { GBP: { name: 'British Pound', symbol: '£' } } },
  { name: { common: 'Canada' }, currencies: { CAD: { name: 'Canadian Dollar', symbol: 'C$' } } },
  { name: { common: 'Australia' }, currencies: { AUD: { name: 'Australian Dollar', symbol: 'A$' } } },
  { name: { common: 'Germany' }, currencies: { EUR: { name: 'Euro', symbol: '€' } } },
  { name: { common: 'Japan' }, currencies: { JPY: { name: 'Japanese Yen', symbol: '¥' } } },
  { name: { common: 'Singapore' }, currencies: { SGD: { name: 'Singapore Dollar', symbol: 'S$' } } },
  { name: { common: 'Switzerland' }, currencies: { CHF: { name: 'Swiss Franc', symbol: 'CHF' } } },
  { name: { common: 'China' }, currencies: { CNY: { name: 'Chinese Yuan', symbol: '¥' } } }
];

export class CurrencyConverter {
  private rates: CurrencyRate;

  constructor(rates: CurrencyRate = mockCurrencyRates) {
    this.rates = rates;
  }

  /**
   * Convert amount from one currency to another
   * @param amount - Amount to convert
   * @param fromCurrency - Source currency code
   * @param toCurrency - Target currency code
   * @returns Converted amount
   */
  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Convert to base currency first
    const baseAmount = this.toBaseCurrency(amount, fromCurrency);
    
    // Convert from base currency to target currency
    return this.fromBaseCurrency(baseAmount, toCurrency);
  }

  /**
   * Convert amount to base currency
   * @param amount - Amount to convert
   * @param currency - Source currency code
   * @returns Amount in base currency
   */
  private toBaseCurrency(amount: number, currency: string): number {
    if (currency === this.rates.base) {
      return amount;
    }

    const rate = this.rates.rates[currency];
    if (!rate) {
      throw new Error(`Currency ${currency} not supported`);
    }

    return amount / rate;
  }

  /**
   * Convert amount from base currency
   * @param amount - Amount in base currency
   * @param currency - Target currency code
   * @returns Amount in target currency
   */
  private fromBaseCurrency(amount: number, currency: string): number {
    if (currency === this.rates.base) {
      return amount;
    }

    const rate = this.rates.rates[currency];
    if (!rate) {
      throw new Error(`Currency ${currency} not supported`);
    }

    return amount * rate;
  }

  /**
   * Get exchange rate between two currencies
   * @param fromCurrency - Source currency code
   * @param toCurrency - Target currency code
   * @returns Exchange rate
   */
  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const fromRate = this.rates.rates[fromCurrency];
    const toRate = this.rates.rates[toCurrency];

    if (!fromRate || !toRate) {
      throw new Error(`One or both currencies not supported: ${fromCurrency}, ${toCurrency}`);
    }

    return toRate / fromRate;
  }

  /**
   * Format amount with currency symbol
   * @param amount - Amount to format
   * @param currency - Currency code
   * @param locale - Locale for formatting
   * @returns Formatted currency string
   */
  formatCurrency(amount: number, currency: string, locale: string = 'en-IN'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Get supported currencies
   * @returns Array of supported currency codes
   */
  getSupportedCurrencies(): string[] {
    return Object.keys(this.rates.rates);
  }

  /**
   * Get currency symbol
   * @param currency - Currency code
   * @returns Currency symbol
   */
  getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'SGD': 'S$',
      'CHF': 'CHF',
      'CNY': '¥',
      'INR': '₹'
    };

    return symbols[currency] || currency;
  }

  /**
   * Parse amount with currency from string
   * @param amountString - String like "100.00 USD" or "$100.00"
   * @returns Object with amount and currency
   */
  parseAmount(amountString: string): { amount: number; currency: string } {
    // Remove extra spaces and normalize
    const normalized = amountString.trim().toUpperCase();
    
    // Match patterns like "100.00 USD", "$100.00", "100$", "₹100"
    const patterns = [
      /^(\d+(?:\.\d{1,2})?)\s+([A-Z]{3})$/, // "100.00 USD"
      /^([A-Z]{3})\s+(\d+(?:\.\d{1,2})?)$/, // "USD 100.00"
      /^([$€£¥₹])(\d+(?:\.\d{1,2})?)$/, // "$100.00", "€100.00"
      /^(\d+(?:\.\d{1,2})?)([$€£¥₹])$/, // "100.00$", "100.00€"
    ];

    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (match) {
        let amount: number;
        let currency: string;

        if (pattern.source.includes('\\s+')) {
          // Pattern with space
          amount = parseFloat(match[1]);
          currency = match[2];
        } else {
          // Pattern with symbol
          amount = parseFloat(match[1]);
          const symbol = match[2];
          
          // Map symbol to currency code
          const symbolMap: Record<string, string> = {
            '$': 'USD',
            '€': 'EUR',
            '£': 'GBP',
            '¥': 'JPY',
            '₹': 'INR'
          };
          
          currency = symbolMap[symbol] || symbol;
        }

        return { amount, currency };
      }
    }

    // Fallback: try to extract just the number
    const numberMatch = normalized.match(/(\d+(?:\.\d{1,2})?)/);
    if (numberMatch) {
      return {
        amount: parseFloat(numberMatch[1]),
        currency: 'USD' // Default to USD
      };
    }

    throw new Error(`Unable to parse amount: ${amountString}`);
  }

  /**
   * Update exchange rates
   * @param newRates - New exchange rates
   */
  updateRates(newRates: CurrencyRate): void {
    this.rates = newRates;
  }
}

// Create a default instance
export const currencyConverter = new CurrencyConverter();

// Utility functions
export const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
  return currencyConverter.convert(amount, fromCurrency, toCurrency);
};

export const formatAmount = (amount: number, currency: string, locale?: string): string => {
  return currencyConverter.formatCurrency(amount, currency, locale);
};

export const parseAmountString = (amountString: string): { amount: number; currency: string } => {
  return currencyConverter.parseAmount(amountString);
};

export const getCurrencySymbol = (currency: string): string => {
  return currencyConverter.getCurrencySymbol(currency);
};
