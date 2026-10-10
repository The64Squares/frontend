import React, { useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layouts/MataData/MataData";
import CheckoutSteps from "./CheckoutSteps ";
import { useNavigate } from "react-router-dom";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useCurrency } from "../../context/CurrencyContext";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [firstName, setFirstName] = useState(shippingInfo.firstName || "");
  const [lastName, setLastName] = useState(shippingInfo.lastName || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "India");
  const [phoneNo, setPhone] = useState(shippingInfo.phoneNo || "");
  const [email, setEmail] = useState(shippingInfo.email || "");
  const [saveAddress, setSaveAddress] = useState(true);
  const [sameBillingDelivery, setSameBillingDelivery] = useState(true);

  // Field-level inline errors state
  const [errors, setErrors] = useState({});

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Real Subtotal calculation based purely on actual product price * qty
  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharge = 0; // Standard Free delivery
  const finalTotal = subTotal + deliveryCharge;

  const validate = () => {
    const errs = {};

    if (!firstName.trim()) {
      errs.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      errs.lastName = "Last name is required";
    }

    if (!address.trim()) {
      errs.address = "Street address is required";
    }

    if (!city.trim()) {
      errs.city = "City is required";
    }

    if (!pinCode.trim()) {
      errs.pinCode = "Postal code is required";
    } else if (!/^[0-9]{5,6}$/.test(pinCode.trim())) {
      errs.pinCode = "Please enter a valid 5 or 6-digit postal code";
    }

    if (!state.trim()) {
      errs.state = "State / Province is required";
    }

    const cleanPhone = phoneNo.replace(/\D/g, "");
    if (!phoneNo.trim()) {
      errs.phoneNo = "Mobile number is required";
    } else if (cleanPhone.length !== 10) {
      errs.phoneNo = "Please enter a valid 10-digit mobile number";
    }

    if (!email.trim()) {
      errs.email = "Email address is required for dispatch notification";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email format (e.g. name@example.com)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      // Find first field with error and scroll to it smoothly
      const firstErrorField = document.querySelector(".shipping-input.has-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
      return;
    }

    const cleanPhone = phoneNo.replace(/\D/g, "");

    dispatch(
      saveShippingInfo({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        country,
        pinCode: pinCode.trim(),
        phoneNo: cleanPhone,
        email: email.trim(),
      })
    );

    // Save accurate pricing breakdown for payment reference
    const orderData = {
      subTotal,
      shippingCharges: deliveryCharge,
      totalFinalPrice: finalTotal,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(orderData));

    navigate("/process/payment");
  };

  return (
    <div className="shipping-page-root">
      <MetaData title="Delivery Address | The64Squares" />
      <div className="shipping-container">
        <CheckoutSteps activeStep={1} />

        <div className="shipping-layout-grid">
          {/* Left Column: Shipping Form */}
          <div className="shipping-form-card">
            <div className="shipping-header-wrap">
              <h2 className="shipping-title">Shipping & Delivery</h2>
              <p className="shipping-subtitle">
                Please enter the destination for your handcrafted chess pieces.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="shipping-fields-grid">
                {/* First Name */}
                <div className="shipping-field-group">
                  <label className="shipping-label">First Name *</label>
                  <input
                    type="text"
                    className={`shipping-input ${errors.firstName ? "has-error" : ""}`}
                    placeholder="e.g. Garry"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      clearFieldError("firstName");
                    }}
                    required
                  />
                  {errors.firstName && (
                    <span className="shipping-error-text">
                      <ErrorOutlineIcon sx={{ fontSize: 13 }} />
                      {errors.firstName}
                    </span>
                  )}
                </div>

                {/* Last Name */}
                <div className="shipping-field-group">
                  <label className="shipping-label">Last Name *</label>
                  <input
                    type="text"
                    className={`shipping-input ${errors.lastName ? "has-error" : ""}`}
                    placeholder="e.g. Kasparov"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      clearFieldError("lastName");
                    }}
                    required
                  />
                  {errors.lastName && (
                    <span className="shipping-error-text">
                      <ErrorOutlineIcon sx={{ fontSize: 13 }} />
                      {errors.lastName}
                    </span>
                  )}
                </div>

                {/* Street Address */}
                <div className="shipping-field-group full-width">
                  <label className="shipping-label">Street Address *</label>
                  <input
                    type="text"
                    className={`shipping-input ${errors.address ? "has-error" : ""}`}
                    placeholder="Apartment, suite, unit, building, street address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      clearFieldError("address");
                    }}
                    required
                  />
                  {errors.address && (
                    <span className="shipping-error-text">
                      <ErrorOutlineIcon sx={{ fontSize: 13 }} />
                      {errors.address}
                    </span>
                  )}
                </div>

                {/* City */}
                <div className="shipping-field-group">
                  <label className="shipping-label">City *</label>
                  <input
                    type="text"
                    className={`shipping-input ${errors.city ? "has-error" : ""}`}
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      clearFieldError("city");
                    }}
                    required
                  />
                  {errors.city && (
                    <span className="shipping-error-text">
                      <ErrorOutlineIcon sx={{ fontSize: 13 }} />
                      {errors.city}
                    </span>
                  )}
                </div>

                {/* Postal Code */}
                <div className="shipping-field-group">
                  <label className="shipping-label">Postal / PIN Code *</label>
                  <input
                    type="text"
                    className={`shipping-input ${errors.pinCode ? "has-error" : ""}`}
                    placeholder="e.g. 400001"
                    value={pinCode}
                    onChange={(e) => {
                      setPinCode(e.target.value);
                      clearFieldError("pinCode");
                    }}
                    maxLength={10}
                    required
                  />
                  {errors.pinCode && (
                    <span className="shipping-error-text">
                      <ErrorOutlineIcon sx={{ fontSize: 13 }} />
                      {errors.pinCode}
                    </span>
                  )}
                </div>

                {/* State */}
                <div className="shipping-field-group">
                  <label className="shipping-label">State / Province *</label>
                  <input
                    type="text"
                    className={`shipping-input ${errors.state ? "has-error" : ""}`}
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      clearFieldError("state");
                    }}
                    required
                  />
                  {errors.state && (
                    <span className="shipping-error-text">
                      <ErrorOutlineIcon sx={{ fontSize: 13 }} />
                      {errors.state}
                    </span>
                  )}
                </div>

                {/* Country */}
                <div className="shipping-field-group">
                  <label className="shipping-label">Country *</label>
                  <select
                    className="shipping-select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>

                {/* Mobile Number */}
                <div className="shipping-field-group">
                  <label className="shipping-label">Mobile Number *</label>
                  <input
                    type="tel"
                    className={`shipping-input ${errors.phoneNo ? "has-error" : ""}`}
                    placeholder="10-digit contact number"
                    value={phoneNo}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearFieldError("phoneNo");
                    }}
                    maxLength={15}
                    required
                  />
                  {errors.phoneNo && (
                    <span className="shipping-error-text">
                      <ErrorOutlineIcon sx={{ fontSize: 13 }} />
                      {errors.phoneNo}
                    </span>
                  )}
                </div>

                {/* Email Notification */}
                <div className="shipping-field-group">
                  <label className="shipping-label">Email Notification *</label>
                  <input
                    type="email"
                    className={`shipping-input ${errors.email ? "has-error" : ""}`}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    required
                  />
                  {errors.email && (
                    <span className="shipping-error-text">
                      <ErrorOutlineIcon sx={{ fontSize: 13 }} />
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="shipping-options-stack">
                <label className="shipping-checkbox-label">
                  <input
                    type="checkbox"
                    className="shipping-checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                  />
                  <span>Save this address to address book for future checkout</span>
                </label>

                <label className="shipping-checkbox-label">
                  <input
                    type="checkbox"
                    className="shipping-checkbox"
                    checked={sameBillingDelivery}
                    onChange={(e) => setSameBillingDelivery(e.target.checked)}
                  />
                  <span>Billing address matches shipping destination</span>
                </label>
              </div>

              <button type="submit" className="shipping-submit-btn">
                <span>Proceed to Payment</span>
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="shipping-summary-card">
            <h3 className="shipping-summary-title">Order Summary</h3>

            {cartItems && cartItems.length > 0 && (
              <div className="shipping-items-preview">
                {cartItems.map((item) => (
                  <div key={item.productId} className="shipping-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="shipping-item-img"
                    />
                    <div className="shipping-item-info">
                      <span className="shipping-item-name">{item.name}</span>
                      <span className="shipping-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="shipping-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="shipping-summary-breakdown">
              <div className="shipping-breakdown-row">
                <span>Items Subtotal</span>
                <span>{formatPrice(subTotal)}</span>
              </div>

              <div className="shipping-breakdown-row">
                <span>Delivery Charges</span>
                <span className="shipping-free-tag">FREE</span>
              </div>

              <div className="shipping-breakdown-row total">
                <span>Estimated Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="shipping-assurances">
              <div className="shipping-assurance-item">
                <ShieldOutlinedIcon sx={{ fontSize: 16, color: "#c5a880" }} />
                <span>Museum-grade protective crating</span>
              </div>
              <div className="shipping-assurance-item">
                <LocalShippingOutlinedIcon sx={{ fontSize: 16, color: "#c5a880" }} />
                <span>Dispatches in 24 hours with tracking</span>
              </div>
              <div className="shipping-assurance-item">
                <LockOutlinedIcon sx={{ fontSize: 16, color: "#c5a880" }} />
                <span>256-bit encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
