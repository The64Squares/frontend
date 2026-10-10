import React, { useState } from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import CartItem from "./CartItem";
import { useAlert } from "../../context/AlertContext";
import { useCurrency } from "../../context/CurrencyContext";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { formatPrice, currency } = useCurrency();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.userData);

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      alert.error("Maximum available stock reached");
      return;
    }
    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) return;
    dispatch(addItemToCart(id, newQty));
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a promo code");
      return;
    }

    const code = couponCode.trim().toUpperCase();
    if (code === "CHESS10" || code === "THE64SQUARES" || code === "GRANDMASTER") {
      setCouponApplied(true);
      setCouponError("");
      alert.success(`Privilege Code '${code}' successfully activated!`);
    } else {
      setCouponApplied(false);
      setCouponError("Invalid promo code");
      alert.error("Invalid privilege code. Try 'CHESS10' or 'THE64SQUARES'");
    }
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
    alert.info("Piece removed from shopping bag");
  };

  const checkoutHandler = () => {
    if (isAuthenticated) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  let couponDiscount = 0;
  if (couponApplied) {
    couponDiscount = Math.round(totalPrice * 0.1);
  }

  const final = Math.max(0, totalPrice - couponDiscount);
  const finalDisplay = formatPrice(final);
  const totalPriceDisplay = formatPrice(totalPrice);

  return (
    <>
      <MetaData title="Shopping Bag | The64Squares" />
      <div className="the64squares-cart-page">
        <div className="cart-header-banner">
          <span className="cart-sub-tag">CURATED ACQUISITIONS</span>
          <h1 className="cart-title">Your Shopping Bag</h1>
          <p className="cart-count">
            {cartItems.length} {cartItems.length === 1 ? "Piece" : "Pieces"} reserved • Total: {finalDisplay}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-state">
            <RemoveShoppingCartIcon sx={{ fontSize: 60, color: "#c5a880" }} />
            <h2>Your Bag is Empty</h2>
            <p>You haven't selected any chess boards or artisanal pieces yet.</p>
            <Link to="/products" className="empty-cart-btn">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="cart-main-layout">
            {/* Left Column: Items List */}
            <div className="cart-items-column">
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  deleteCartItems={deleteCartItems}
                  decreaseQuantity={decreaseQuantity}
                  increaseQuantity={increaseQuantity}
                  id={item.productId}
                />
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary-column">
              <div className="summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{totalPriceDisplay}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="summary-row">
                    <span>Coupon Discount (10%)</span>
                    <span className="discount-val">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Delivery Charges</span>
                  <span className="shipping-free">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Estimated Total</span>
                  <span className="total-val">{finalDisplay}</span>
                </div>
                <span className="tax-inclusive-txt">
                  {currency === "INR"
                    ? "(Inclusive of all packaging & taxes)"
                    : `(All duties included • Converted in ${currency})`}
                </span>

                <div className="coupon-box" style={{ flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                    <input
                      type="text"
                      className="shipping-input"
                      style={{ padding: "0.65rem 0.85rem", fontSize: "0.85rem" }}
                      placeholder="Promo Code (e.g. CHESS10)"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                    />
                    <button
                      type="button"
                      className="coupon-apply-btn"
                      style={{
                        padding: "0 1.25rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>
                      {couponError}
                    </span>
                  )}
                  {couponApplied && (
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#059669",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <VerifiedIcon sx={{ fontSize: 14 }} /> 10% Extra Privilege Discount Applied
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="proceed-checkout-btn"
                  onClick={checkoutHandler}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
