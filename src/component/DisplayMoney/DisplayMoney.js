// Live Multi-Currency formatting and conversion utilities for The64Squares
export const FALLBACK_RATES = {
  INR: 1,
  USD: 0.01032,
  EUR: 0.00923,
};

export const getStoredRates = () => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("the64squares_currency_rates");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.rates && parsed.rates.USD) return parsed.rates;
      }
    }
  } catch (e) {}
  return FALLBACK_RATES;
};

export const getStoredCurrency = () => {
  try {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("the64squares_current_currency") ||
        localStorage.getItem("the64squares_selected_currency") ||
        "INR"
      );
    }
  } catch (e) {}
  return "INR";
};

// Convert INR price to target currency
export const convertMoney = function (inrAmount, customCurrency = null) {
  const currency = customCurrency || getStoredCurrency();
  const rates = getStoredRates();
  const num = Number(inrAmount) || 0;
  const rate = rates[currency] || (FALLBACK_RATES[currency] || 1);
  return num * rate;
};

// Display Money formatted in active or specified currency (INR, USD, EUR)
export const dispalyMoney = function (num, customCurrency = null) {
  if (num === undefined || num === null || isNaN(Number(num))) return "";
  const currency = customCurrency || getStoredCurrency();
  const rates = getStoredRates();
  const rate = rates[currency] || (FALLBACK_RATES[currency] || 1);
  const converted = Number(num) * rate;

  if (currency === "INR") {
    const numFormate = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
    return numFormate.format(Math.round(converted));
  }

  if (currency === "EUR") {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  }

  // USD (Default for foreign / international clients)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
};

// Calculate Discount Percentage
export const calculateDiscount = (discountedPrice, originalPrice) => {
  if (!originalPrice) return 0;
  const disCountPercent = (discountedPrice / originalPrice) * 100;
  return disCountPercent;
};

// Calculate Total Amount
export const calculateTotal = (arr) => {
  if (!Array.isArray(arr)) return 0;
  return arr.reduce((accum, curr) => accum + curr, 0);
};

// Calculate 35% artisan discount
export function generateDiscountedPrice(price) {
  const num = Number(price) || 0;
  const discountPercentage = 35;
  const discountAmount = (discountPercentage / 100) * num;
  const discountedPrice = num - discountAmount;
  return discountedPrice.toFixed(2);
}
