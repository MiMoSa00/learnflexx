export const formatNumber = (num: number, locales: string = 'en-US', options?: Intl.NumberFormatOptions): string => {
  return num.toLocaleString(locales, options);
};

export const formatCurrency = (amount: number, currency: string = 'USD', locales: string = 'en-US'): string => {
  return new Intl.NumberFormat(locales, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};