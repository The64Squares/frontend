import React, { useEffect, useState } from "react";
import "./ProductList.css";
import "./AdminOrders.css";
import { useSelector, useDispatch } from "react-redux";
import {
  updateOrder,
  clearErrors,
  getOrderDetails,
} from "../../actions/orderAction";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "../../context/AlertContext";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstant";
import { Link, useParams, useNavigate } from "react-router-dom";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

function ProcessOrder() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated, loading: updateLoading } = useSelector(
    (state) => state.deleteUpdateOrder
  );

  const [status, setStatus] = useState("");
  const [toggle, setToggle] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggle]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order status updated successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
      dispatch(getOrderDetails(id));
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, isUpdated, updateError, id]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    if (!status) {
      alert.error("Please select a target status");
      return;
    }
    dispatch(updateOrder(id, { status }));
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    alert.success("Order ID copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Determine active step index: 0 = Placed, 1 = Processing, 2 = Shipped, 3 = Delivered
  const currentStatus = ((order && order.orderStatus) || "Processing").toLowerCase();
  let stepIndex = 1;
  if (currentStatus === "shipped") stepIndex = 2;
  if (currentStatus === "delivered") stepIndex = 3;

  return (
    <>
      <MetaData title={`Manage Order #${id ? id.substring(0, 8) : ""} — Admin Console`} />

      <div className="product-list" style={{ marginTop: 0 }}>
        <div className={!toggle ? "listSidebar" : "toggleBox"}>
          <Sidebar />
        </div>

        <div className="list-table">
          <Navbar toggleHandler={toggleHandler} />

          <div className="admin-orders-inner" style={{ padding: "0.5rem 0 3rem" }}>
            {/* Top Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link to="/admin/orders" className="back-to-orders-btn">
                <ArrowBackIcon style={{ fontSize: "1rem" }} /> Back to All Orders
              </Link>
              <button
                type="button"
                className="filter-tab-pill"
                onClick={() => window.print()}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff" }}
              >
                <PrintOutlinedIcon style={{ fontSize: "1.05rem" }} /> Print Invoice
              </button>
            </div>

            {loading || !order ? (
              <div style={{ padding: "4rem", textAlign: "center" }}>
                <Loader />
              </div>
            ) : (
              <>
                {/* Header Section */}
                <div className="admin-page-header" style={{ marginBottom: "1.5rem" }}>
                  <div className="admin-page-title-wrap">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="admin-page-subtag">Fulfilment Order #{id}</span>
                      <button
                        type="button"
                        onClick={copyOrderId}
                        title="Copy Order ID"
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: copied ? "#059669" : "#71717a",
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <ContentCopyIcon style={{ fontSize: "0.95rem" }} />
                      </button>
                    </div>
                    <h1 className="admin-page-title">Order Processing Console</h1>
                    <span style={{ fontSize: "0.85rem", color: "#71717a" }}>
                      Placed on {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    {currentStatus === "delivered" ? (
                      <span className="status-pill delivered">
                        <span className="status-dot"></span> Delivered
                      </span>
                    ) : currentStatus === "shipped" ? (
                      <span className="status-pill shipped">
                        <span className="status-dot"></span> In Transit (Shipped)
                      </span>
                    ) : (
                      <span className="status-pill processing">
                        <span className="status-dot"></span> Processing
                      </span>
                    )}

                    <span
                      style={{
                        padding: "0.35rem 0.85rem",
                        borderRadius: "20px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        backgroundColor:
                          order.paymentInfo && order.paymentInfo.status === "succeeded"
                            ? "#ecfdf5"
                            : "#fefce8",
                        color:
                          order.paymentInfo && order.paymentInfo.status === "succeeded"
                            ? "#047857"
                            : "#b45309",
                        border:
                          order.paymentInfo && order.paymentInfo.status === "succeeded"
                            ? "1px solid #a7f3d0"
                            : "1px solid #fde68a",
                      }}
                    >
                      {order.paymentInfo && order.paymentInfo.status === "succeeded"
                        ? "PAID (Razorpay)"
                        : "PAYMENT PENDING"}
                    </span>
                  </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="process-order-grid">
                  {/* Left Column: Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Ordered Items */}
                    <div className="process-card">
                      <h3 className="process-card-title">
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                          <Inventory2OutlinedIcon style={{ fontSize: "1.2rem", color: "#c5a880" }} />
                          Ordered Items ({order.orderItems ? order.orderItems.length : 0})
                        </span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#71717a" }}>
                          Total Qty: {order.orderItems ? order.orderItems.reduce((acc, i) => acc + (i.quantity || 1), 0) : 0}
                        </span>
                      </h3>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        {order.orderItems &&
                          order.orderItems.map((item, idx) => (
                            <div key={idx} className="process-item-row">
                              <img
                                src={item.image || "https://placehold.co/100x100?text=Chess"}
                                alt={item.name}
                                className="process-item-thumb"
                                onError={(e) => {
                                  e.target.src = "https://placehold.co/100x100?text=Chess";
                                }}
                              />
                              <div className="process-item-info">
                                <Link
                                  to={`/product/${item.productId || item.product}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="process-item-name"
                                >
                                  {item.name}
                                </Link>
                                <span className="process-item-meta">
                                  Quantity: <strong>{item.quantity}</strong> × ₹{(item.price || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span className="process-item-price">
                                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Customer & Delivery Address Card */}
                    <div className="process-card">
                      <h3 className="process-card-title">
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                          <LocationOnOutlinedIcon style={{ fontSize: "1.2rem", color: "#c5a880" }} />
                          Delivery & Recipient Details
                        </span>
                      </h3>

                      <div className="process-info-grid">
                        <div className="process-info-unit">
                          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                            <PersonOutlineIcon style={{ fontSize: "0.95rem" }} /> Customer Name
                          </label>
                          <span>{(order.user && order.user.name) || "Direct Customer"}</span>
                        </div>

                        <div className="process-info-unit">
                          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                            <EmailOutlinedIcon style={{ fontSize: "0.95rem" }} /> Email Address
                          </label>
                          <span>{(order.user && order.user.email) || "N/A"}</span>
                        </div>

                        <div className="process-info-unit">
                          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                            <PhoneOutlinedIcon style={{ fontSize: "0.95rem" }} /> Contact Phone
                          </label>
                          <span>{(order.shippingInfo && order.shippingInfo.phoneNo) || "N/A"}</span>
                        </div>

                        <div className="process-info-unit">
                          <label>Postal Code / PIN</label>
                          <span>{(order.shippingInfo && order.shippingInfo.pinCode) || "N/A"}</span>
                        </div>

                        <div className="process-info-unit full">
                          <label>Full Delivery Address</label>
                          <span style={{ lineHeight: 1.5 }}>
                            {(order.shippingInfo && order.shippingInfo.address) || ""},{" "}
                            {(order.shippingInfo && order.shippingInfo.city) || ""},{" "}
                            {(order.shippingInfo && order.shippingInfo.state) || ""},{" "}
                            {(order.shippingInfo && order.shippingInfo.country) || "India"} - {(order.shippingInfo && order.shippingInfo.pinCode) || ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="process-card">
                      <h3 className="process-card-title">
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                          <PaymentOutlinedIcon style={{ fontSize: "1.2rem", color: "#c5a880" }} />
                          Financial Breakdown
                        </span>
                      </h3>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#52525b" }}>
                          <span>Items Subtotal</span>
                          <span style={{ fontWeight: 600, color: "#18181b" }}>
                            ₹{order.itemsPrice ? order.itemsPrice.toLocaleString("en-IN") : (order.totalPrice || 0).toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#52525b" }}>
                          <span>White-Glove Shipping</span>
                          <span style={{ fontWeight: 600, color: "#047857" }}>
                            Complimentary
                          </span>
                        </div>

                        {order.taxPrice > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#52525b" }}>
                            <span>GST / Taxes</span>
                            <span style={{ fontWeight: 600, color: "#18181b" }}>
                              ₹{order.taxPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}

                        <div
                          style={{
                            borderTop: "1px solid rgba(0,0,0,0.08)",
                            paddingTop: "0.85rem",
                            marginTop: "0.25rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "1rem", fontWeight: 700, color: "#09090b" }}>
                              Grand Total
                            </span>
                            <p style={{ margin: 0, fontSize: "0.76rem", color: "#71717a" }}>
                              Inclusive of all applicable duties
                            </p>
                          </div>
                          <span style={{ fontFamily: "monospace", fontSize: "1.35rem", fontWeight: 800, color: "#09090b" }}>
                            ₹{(order.totalPrice || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Fulfilment Workflow & Controls */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Visual Lifecycle Stepper */}
                    <div className="process-card">
                      <h3 className="process-card-title">Fulfilment Progress</h3>

                      <div className="workflow-stepper">
                        <div className={`workflow-step-node ${stepIndex >= 0 ? (stepIndex > 0 ? "completed" : "active") : ""}`}>
                          <div className="workflow-node-circle">
                            {stepIndex > 0 ? "✓" : "1"}
                          </div>
                          <span className="workflow-step-label">Placed</span>
                        </div>

                        <div className={`workflow-step-node ${stepIndex >= 1 ? (stepIndex > 1 ? "completed" : "active") : ""}`}>
                          <div className="workflow-node-circle">
                            {stepIndex > 1 ? "✓" : "2"}
                          </div>
                          <span className="workflow-step-label">Processing</span>
                        </div>

                        <div className={`workflow-step-node ${stepIndex >= 2 ? (stepIndex > 2 ? "completed" : "active") : ""}`}>
                          <div className="workflow-node-circle">
                            {stepIndex > 2 ? "✓" : "3"}
                          </div>
                          <span className="workflow-step-label">Shipped</span>
                        </div>

                        <div className={`workflow-step-node ${stepIndex >= 3 ? "completed" : ""}`}>
                          <div className="workflow-node-circle">
                            {stepIndex >= 3 ? "✓" : "4"}
                          </div>
                          <span className="workflow-step-label">Delivered</span>
                        </div>
                      </div>

                      <div style={{ background: "#fafafa", borderRadius: "8px", padding: "0.85rem 1rem", fontSize: "0.82rem", color: "#52525b", border: "1px solid rgba(0,0,0,0.06)" }}>
                        Current status: <strong style={{ textTransform: "capitalize", color: "#09090b" }}>{order.orderStatus}</strong>
                        {order.deliveredAt && (
                          <div style={{ marginTop: "0.25rem", color: "#047857" }}>
                            Delivered at: {formatDate(order.deliveredAt)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fulfilment Status Action Form */}
                    <div className="process-card">
                      <h3 className="process-card-title">Manage Fulfilment</h3>

                      {currentStatus === "delivered" ? (
                        <div
                          style={{
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <CheckCircleIcon style={{ color: "#059669", fontSize: "2.5rem" }} />
                          <h4 style={{ margin: 0, color: "#065f46", fontSize: "1rem" }}>
                            Order Completed
                          </h4>
                          <p style={{ margin: 0, fontSize: "0.82rem", color: "#047857" }}>
                            This order has already been marked as Delivered. No further status changes are required.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={updateOrderSubmitHandler} className="status-update-control-box">
                          <div>
                            <label
                              htmlFor="order-status-select"
                              style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a", marginBottom: "0.45rem" }}
                            >
                              Advance Order To Next Stage
                            </label>
                            <select
                              id="order-status-select"
                              className="status-select-input"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">— Select Target Status —</option>
                              {currentStatus === "processing" && (
                                <>
                                  <option value="Shipped">Shipped (Dispatch Order)</option>
                                  <option value="Delivered">Delivered (Direct Fulfilment)</option>
                                </>
                              )}
                              {currentStatus === "shipped" && (
                                <option value="Delivered">Delivered (Mark as Received)</option>
                              )}
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="status-update-btn"
                            disabled={updateLoading || !status}
                          >
                            <LocalShippingOutlinedIcon style={{ fontSize: "1.1rem" }} />
                            {updateLoading ? "Updating..." : "Update Order Status"}
                          </button>

                          <span style={{ fontSize: "0.75rem", color: "#71717a", textAlign: "center", lineHeight: 1.4 }}>
                            Updating to "Shipped" automatically adjusts warehouse inventory and records shipping timeline.
                          </span>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProcessOrder;
