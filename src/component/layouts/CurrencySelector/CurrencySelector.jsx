import React, { useState, useRef, useEffect } from "react";
import { useCurrency } from "../../../context/CurrencyContext";
import PublicIcon from "@mui/icons-material/Public";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import "./CurrencySelector.css";

const CurrencySelector = ({ variant = "header" }) => {
  const { currency, config, changeCurrency, availableCurrencies, detectedLocation } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (currCode) => {
    changeCurrency(currCode);
    setIsOpen(false);
  };

  return (
    <div className={`currency-selector-root variant-${variant}`} ref={dropdownRef}>
      <button
        type="button"
        className={`currency-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select currency and region"
        aria-expanded={isOpen}
      >
        <span className="currency-flag">{config.flag}</span>
        <span className="currency-code">{config.code}</span>
        <span className="currency-symbol">({config.symbol})</span>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 16,
            transition: "transform 0.25s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "currentColor",
          }}
        />
      </button>

      {isOpen && (
        <div className="currency-dropdown-menu">
          <div className="currency-dropdown-header">
            <div className="header-location-badge">
              <PublicIcon sx={{ fontSize: 13, color: "#c5a880" }} />
              <span>
                {detectedLocation && detectedLocation.countryName
                  ? `Region: ${detectedLocation.countryName}`
                  : "Auto Location"}
              </span>
            </div>
            <span className="header-subtitle">Live Exchange Rates</span>
          </div>

          <div className="currency-options-list">
            {availableCurrencies.map((item) => {
              const isSelected = item.code === currency;
              return (
                <button
                  key={item.code}
                  type="button"
                  className={`currency-option-item ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(item.code)}
                >
                  <span className="option-flag">{item.flag}</span>
                  <div className="option-info">
                    <div className="option-primary">
                      <span className="option-code">{item.code}</span>
                      <span className="option-symbol">{item.symbol}</span>
                    </div>
                    <span className="option-name">{item.name}</span>
                  </div>
                  {isSelected && (
                    <CheckIcon sx={{ fontSize: 16, color: "#c5a880", marginLeft: "auto" }} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="currency-dropdown-footer">
            <span>Prices auto-converted based on real-time rates</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
