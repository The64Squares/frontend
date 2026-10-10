import React, { useState } from "react";
import "./Myorder.css";
import ReplayIcon from "@mui/icons-material/Replay";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useDispatch } from "react-redux";
import { useAlert } from "../../context/AlertContext";
import { addItemToCart } from "../../actions/cartAction";
import { useNavigate, Link } from "react-router-dom";
import DialogBox from "../Product/DialogBox";
import { useCurrency } from "../../context/CurrencyContext";

const formatOrderDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
};

const OrderCard = ({ item, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { formatPrice } = useCurrency();
  const [openReviewId, setOpenReviewId] = useState(null);

  const { shippingInfo, orderItems, orderStatus, totalPrice, createdAt, _id } = item;

  const addToCartHandler = (id, qty = 1) => {
    dispatch(addItemToCart(id, qty));
    alert.success("Piece added to shopping bag");
    navigate("/cart");
  };

  const isDelivered = orderStatus?.toLowerCase() === "delivered";

  return (
    <div className="order-card-root">
      {/* Top Bar with Meta */}
      <div className="order-card-topbar">
        <div className="order-meta-group">
          <span className="order-meta-label">Order Reference</span>
          <span className="order-id-badge">#{_id}</span>
        </div>

        <div className="order-meta-group">
          <span className="order-meta-label">Date Placed</span>
          <span className="order-meta-value">{formatOrderDate(createdAt)}</span>
        </div>

        <div className="order-meta-group">
          <span className="order-meta-label">Total Amount</span>
          <span className="order-meta-value" style={{ fontWeight: 700 }}>
            {formatPrice(totalPrice)}
          </span>
        </div>

        <div className="order-meta-group">
          <span className="order-meta-label">Status</span>
          <span
            className={`order-status-badge ${
              isDelivered ? "delivered" : "processing"
            }`}
          >
            {isDelivered ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
            ) : (
              <AccessTimeIcon sx={{ fontSize: 14 }} />
            )}
            {orderStatus || "Processing"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="order-card-content">
        {/* Left Column: Items */}
        <div className="order-items-sublist">
          {orderItems &&
            orderItems.map((product) => (
              <div key={product.productId} className="order-item-unit">
                <img src={product.image} alt={product.name} />

                <div className="order-item-details">
                  <Link
                    to={`/product/${product.productId}`}
                    className="order-item-name"
                  >
                    {product.name}
                  </Link>

                  <span className="order-item-meta">
                    Quantity: {product.quantity}
                  </span>

                  <span className="order-item-price">
                    {formatPrice(product.price * product.quantity)}
                  </span>

                  <div className="order-actions-bar">
                    <button
                      type="button"
                      className="order-action-btn primary"
                      onClick={() => addToCartHandler(product.productId, 1)}
                    >
                      <ReplayIcon sx={{ fontSize: 15 }} />
                      <span>Order Again</span>
                    </button>

                    <Link
                      to={`/product/${product.productId}`}
                      className="order-action-btn"
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
                      <span>View Details</span>
                    </Link>

                    <button
                      type="button"
                      className="order-action-btn"
                      onClick={() => setOpenReviewId(product.productId)}
                    >
                      <RateReviewOutlinedIcon sx={{ fontSize: 15 }} />
                      <span>Write Review</span>
                    </button>

                    {openReviewId === product.productId && (
                      <DialogBox
                        open={Boolean(openReviewId)}
                        handleClose={() => setOpenReviewId(null)}
                        id={product.productId}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Right Column: Destination Summary */}
        {shippingInfo && (
          <div className="order-shipping-dest">
            <h4>Destination Address</h4>
            <span className="order-dest-name">
              {shippingInfo.firstName
                ? `${shippingInfo.firstName} ${shippingInfo.lastName || ""}`
                : user?.name}
            </span>
            <span className="order-dest-addr">
              {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}{" "}
              - {shippingInfo.pinCode}
            </span>
            <span className="order-dest-addr">{shippingInfo.country}</span>
            {shippingInfo.phoneNo && (
              <span className="order-dest-phone">
                Contact: +91 {shippingInfo.phoneNo}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
