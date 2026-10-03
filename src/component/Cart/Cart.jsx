import React, { useState } from "react";
import "./Cart.css";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import { Button } from "@mui/material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import CartItem from "./CartItem";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState("");
  const [isValid, setIsValid] = useState(true);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) return;
    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) return;
    dispatch(addItemToCart(id, newQty));
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "CHESS10" || couponCode.toUpperCase() === "THE64SQUARES") {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  let totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  let discountedPrice = generateDiscountedPrice(totalPrice);
  let totalDiscount = totalPrice - discountedPrice;
  let final = totalPrice - totalDiscount;
  let finalDisplay = dispalyMoney(final);
  let totalDiscountDisplay = dispalyMoney(totalDiscount);
  let totalPriceDisplay = dispalyMoney(totalPrice);

  return (
    <>
      <MetaData title="Shopping Bag | The64Squares" />
      <div className="the64squares-cart-page">
        <div className="cart-header-banner">
          <span className="cart-sub-tag">YOUR BAG</span>
          <h1 className="cart-title">Shopping Bag</h1>
          <p className="cart-count">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} in your bag • Total: {finalDisplay}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-state">
            <RemoveShoppingCartIcon sx={{ fontSize: 56, color: "#8A6A43" }} />
            <h2>Your Bag is Empty</h2>
            <p>You haven't selected any chess boards or artisanal sets yet.</p>
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
                  length={cartItems.length}
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

                <div className="summary-row">
                  <span>Privilege Discount</span>
                  <span className="discount-val">-{totalDiscountDisplay}</span>
                </div>

                <div className="summary-row">
                  <span>Worldwide Express Shipping</span>
                  <span className="shipping-free">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Estimated Total</span>
                  <span className="total-val">{finalDisplay}</span>
                </div>
                <span className="tax-inclusive-txt">(Inclusive of all taxes & duties)</span>

                <div className="coupon-box">
                  <TextField
                    label="Promo Code (e.g. CHESS10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    error={!isValid}
                    helperText={!isValid && "Invalid code"}
                    variant="outlined"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <Button className="coupon-apply-btn" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>

                <Button className="proceed-checkout-btn" onClick={checkoutHandler}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
