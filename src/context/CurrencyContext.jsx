import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const CurrencyContext = createContext();

// Fallback rates if network/API is unavailable (Base: INR)
export const DEFAULT_RATES = {
  INR: 1,
  USD: 0.01032, // ~1 USD = ₹96.9 INR
  EUR: 0.00923, // ~1 EUR = ₹108.3 INR
};

export const CURRENCY_CONFIG = {
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
    locale: "en-IN",
    decimals: 0,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    locale: "en-US",
    decimals: 2,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
    locale: "de-DE",
    decimals: 2,
  },
};

const EU_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "CH"
];

// Fast, client-side timezone-based location routing
function detectFromTimezone() {
  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
    if (tz.includes("calcutta") || tz.includes("kolkata") || tz.includes("colombo")) {
      return { currency: "INR", country: "IN", countryName: "India" };
    }
    if (tz.startsWith("europe/")) {
      return { currency: "EUR", country: "EU", countryName: "Europe" };
    }
    if (tz.startsWith("america/") || tz.startsWith("us/")) {
      return { currency: "USD", country: "US", countryName: "United States" };
    }
    return { currency: "USD", country: "GLOBAL", countryName: "International" };
  } catch (e) {
    return { currency: "USD", country: "GLOBAL", countryName: "International" };
  }
}

export const CurrencyProvider = ({ children }) => {
  // 1. Initial State from localStorage or timezone detection
  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem("the64squares_selected_currency");
    if (saved && CURRENCY_CONFIG[saved]) {
      return saved;
    }
    // Auto-detect based on local timezone
    const initial = detectFromTimezone();
    return initial.currency;
  });

  const [rates, setRates] = useState(() => {
    try {
      const cached = localStorage.getItem("the64squares_currency_rates");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.rates && parsed.rates.USD) return parsed.rates;
      }
    } catch (e) {}
    return DEFAULT_RATES;
  });

  const [detectedLocation, setDetectedLocation] = useState(() => {
    const cachedCountry = localStorage.getItem("the64squares_detected_country");
    if (cachedCountry) return { countryName: cachedCountry, isAuto: false };
    const tzInit = detectFromTimezone();
    return { countryName: tzInit.countryName, isAuto: true };
  });

  // Save current active currency for synchronous non-hook calls (e.g. DisplayMoney.js)
  useEffect(() => {
    localStorage.setItem("the64squares_current_currency", currency);
    localStorage.setItem("the64squares_currency_rates", JSON.stringify({ rates, timestamp: Date.now() }));
  }, [currency, rates]);

  // 2. Fetch live exchange rates
  useEffect(() => {
    let isMounted = true;

    async function loadRates() {
      try {
        // Try backend endpoint first
        const { data } = await axios.get("/api/v1/currency/rates", { timeout: 3500 });
        if (isMounted && data && data.rates) {
          setRates({
            INR: 1,
            USD: Number(data.rates.USD) || DEFAULT_RATES.USD,
            EUR: Number(data.rates.EUR) || DEFAULT_RATES.EUR,
          });
          return;
        }
      } catch (e) {
        // Fallback to public open exchange rate API
        try {
          const res = await fetch("https://open.er-api.com/v6/latest/INR");
          const json = await res.json();
          if (isMounted && json && json.rates) {
            setRates({
              INR: 1,
              USD: Number(json.rates.USD) || DEFAULT_RATES.USD,
              EUR: Number(json.rates.EUR) || DEFAULT_RATES.EUR,
            });
          }
        } catch (err2) {
          console.warn("Using fallback exchange rates:", err2.message);
        }
      }
    }

    loadRates();
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Auto-detect user's physical country via IP in the background (if user hasn't manually set currency)
  useEffect(() => {
    const hasManualChoice = localStorage.getItem("the64squares_selected_currency");
    if (hasManualChoice) return; // User already made an explicit manual choice

    let isMounted = true;

    async function detectGeo() {
      try {
        // Try backend detection (checks Vercel/Cloudflare country headers)
        const { data } = await axios.get("/api/v1/currency/detect", { timeout: 3000 });
        if (isMounted && data && data.country && data.country !== "UNKNOWN") {
          let detected = "USD";
          let cName = data.regionName || "International";

          if (data.country === "IN") {
            detected = "INR";
            cName = "India";
          } else if (EU_COUNTRIES.includes(data.country)) {
            detected = "EUR";
            cName = "Europe";
          }

          setCurrencyState(detected);
          setDetectedLocation({ countryName: cName, isAuto: true });
          localStorage.setItem("the64squares_detected_country", cName);
          return;
        }
      } catch (err) {
        // Fallback to lightweight country.is API
        try {
          const res = await fetch("https://api.country.is/");
          const geo = await res.json();
          if (isMounted && geo && geo.country) {
            let detected = "USD";
            let cName = geo.country;

            if (geo.country === "IN") {
              detected = "INR";
              cName = "India";
            } else if (EU_COUNTRIES.includes(geo.country)) {
              detected = "EUR";
              cName = "Europe";
            } else if (geo.country === "US") {
              cName = "United States";
            }

            setCurrencyState(detected);
            setDetectedLocation({ countryName: cName, isAuto: true });
            localStorage.setItem("the64squares_detected_country", cName);
          }
        } catch (err2) {}
      }
    }

    detectGeo();

    return () => {
      isMounted = false;
    };
  }, []);

  // 4. User manual currency switcher
  const changeCurrency = useCallback((newCurrency) => {
    if (CURRENCY_CONFIG[newCurrency]) {
      setCurrencyState(newCurrency);
      localStorage.setItem("the64squares_selected_currency", newCurrency);
      localStorage.setItem("the64squares_current_currency", newCurrency);
      // Dispatch custom event for vanilla JS / non-React listeners
      window.dispatchEvent(
        new CustomEvent("the64squares_currency_changed", {
          detail: { currency: newCurrency },
        })
      );
    }
  }, []);

  // 5. Convert INR price to active currency
  const convertPrice = useCallback(
    (inrPrice, targetCurrency = null) => {
      const target = targetCurrency || currency;
      const num = Number(inrPrice) || 0;
      const rate = rates[target] || (DEFAULT_RATES[target] || 1);
      return num * rate;
    },
    [currency, rates]
  );

  // 6. Format price with currency symbol and appropriate decimals
  const formatPrice = useCallback(
    (inrPrice, targetCurrency = null) => {
      if (inrPrice === undefined || inrPrice === null) return "";
      const target = targetCurrency || currency;
      const config = CURRENCY_CONFIG[target] || CURRENCY_CONFIG.USD;
      const converted = convertPrice(inrPrice, target);

      if (target === "INR") {
        return new Intl.NumberFormat(config.locale, {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(Math.round(converted));
      }

      return new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: target,
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
      }).format(converted);
    },
    [currency, convertPrice]
  );

  const value = {
    currency,
    config: CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD,
    rates,
    detectedLocation,
    changeCurrency,
    convertPrice,
    formatPrice,
    availableCurrencies: Object.values(CURRENCY_CONFIG),
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      currency: "INR",
      config: CURRENCY_CONFIG.INR,
      rates: DEFAULT_RATES,
      detectedLocation: { countryName: "India", isAuto: false },
      changeCurrency: () => {},
      convertPrice: (p) => p,
      formatPrice: (p) => `₹${Number(p || 0).toLocaleString("en-IN")}`,
      availableCurrencies: Object.values(CURRENCY_CONFIG),
    };
  }
  return context;
};

export default CurrencyContext;
