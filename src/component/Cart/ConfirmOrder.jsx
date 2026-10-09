import React from "react";
import CheckoutSteps from "./CheckoutSteps ";
import { useSelector } from "react-redux";
import MetaData from "../layouts/MataData/MataData";
import "./ConfirmOrder.css";
import { Link, useNavigate } from "react-router-dom";
import The64SquaresBallLoader from "../layouts/loader/Loader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";

function ConfirmOrder() {
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.userData);

  const subTotal = cartItems.reduce((acc, currItem) => {
    return acc + currItem.quantity * currItem.price;
  }, 0);

  const shippingCharges = 0;
  const totalFinalPrice = subTotal;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  function proceedToPayment() {
    const data = {
      subTotal,
      shippingCharges,
      totalFinalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  }

  return (
    <>
      {loading ? (
        <The64SquaresBallLoader />
      ) : (
        <div className="confirm-order-page-root">
          <MetaData title="Review & Confirm Acquisition | The64Squares" />
          <div className="confirm-order-container">
            <CheckoutSteps activeStep={2} />

            <div className="confirm-order-grid">
              {/* Left Column: Details & Items */}
              <div className="confirm-details-card">
                <div>
                  <h3 className="confirm-section-title">Shipping Destination</h3>
                  <div className="confirm-shipping-info-block">
                    <div className="confirm-info-row">
                      <span className="confirm-info-label">Recipient</span>
                      <span className="confirm-info-val">
                        {shippingInfo.firstName
                          ? `${shippingInfo.firstName} ${shippingInfo.lastName || ""}`
                          : user?.name}
                      </span>
                    </div>

                    <div className="confirm-info-row">
                      <span className="confirm-info-label">Contact Number</span>
                      <span className="confirm-info-val">
                        +91 {shippingInfo.phoneNo}
                      </span>
                    </div>

                    <div className="confirm-info-row" style={{ gridColumn: "1 / -1" }}>
                      <span className="confirm-info-label">Address</span>
                      <span className="confirm-info-val">{address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="confirm-section-title">Pieces in Acquisition</h3>
                  <div className="confirm-items-list">
                    {cartItems &&
                      cartItems.map((item) => (
                        <div key={item.productId} className="confirm-item-row">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="confirm-item-thumb"
                          />
                          <Link
                            to={`/product/${item.productId}`}
                            className="confirm-item-name"
                          >
                            {item.name}
                          </Link>
                          <span className="confirm-item-meta">
                            {item.quantity} × {dispalyMoney(item.price)}
                          </span>
                          <span className="confirm-item-total">
                            {dispalyMoney(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="confirm-summary-card">
                <h3 className="confirm-summary-title">Acquisition Total</h3>

                <div className="confirm-breakdown-list">
                  <div className="confirm-breakdown-row">
                    <span>Items Subtotal</span>
                    <span>{dispalyMoney(subTotal)}</span>
                  </div>

                  <div className="confirm-breakdown-row">
                    <span>Delivery Charges</span>
                    <span style={{ color: "#059669", fontWeight: 700 }}>
                      FREE
                    </span>
                  </div>

                  <div className="confirm-breakdown-row total">
                    <span>Grand Total</span>
                    <span>{dispalyMoney(totalFinalPrice)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="confirm-pay-btn"
                  onClick={proceedToPayment}
                >
                  <span>Proceed to Payment</span>
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ConfirmOrder;
