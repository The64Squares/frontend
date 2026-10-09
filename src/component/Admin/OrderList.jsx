import React, { useState, useEffect, useMemo } from "react";
import "./ProductList.css";
import "./AdminOrders.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrders, clearErrors, deleteOrder } from "../../actions/orderAction";
import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { DELETE_ORDER_RESET } from "../../constants/orderConstant";

// Icons
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import LaunchIcon from "@mui/icons-material/Launch";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function OrderList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, loading, orders } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateOrder
  );

  const [toggle, setToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

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
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllOrders());
  }, [dispatch, error, alert, isDeleted, deleteError, navigate]);

  const deleteOrderHandler = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  const copyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    alert.success("Order ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Metrics computation
  const stats = useMemo(() => {
    if (!orders) return { total: 0, processing: 0, shipped: 0, delivered: 0, revenue: 0 };
    let processing = 0;
    let shipped = 0;
    let delivered = 0;
    let revenue = 0;

    orders.forEach((ord) => {
      revenue += ord.totalPrice || 0;
      const st = ord.orderStatus ? ord.orderStatus.toLowerCase() : "";
      if (st === "delivered") delivered++;
      else if (st === "shipped") shipped++;
      else processing++;
    });

    return {
      total: orders.length,
      processing,
      shipped,
      delivered,
      revenue,
    };
  }, [orders]);

  // Filter & Search logic
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      // Tab filter
      const st = (order.orderStatus || "").toUpperCase();
      if (activeTab === "PROCESSING" && st !== "PROCESSING") return false;
      if (activeTab === "SHIPPED" && st !== "SHIPPED") return false;
      if (activeTab === "DELIVERED" && st !== "DELIVERED") return false;

      // Search filter (ID, status, customer name if populated, or address)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const idMatch = order._id.toLowerCase().includes(query);
        const statusMatch = (order.orderStatus || "").toLowerCase().includes(query);
        const nameMatch = (order.user && order.user.name) ? order.user.name.toLowerCase().includes(query) : false;
        const cityMatch = (order.shippingInfo && order.shippingInfo.city) ? order.shippingInfo.city.toLowerCase().includes(query) : false;
        return idMatch || statusMatch || nameMatch || cityMatch;
      }
      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || "Processing").toLowerCase();
    if (s === "delivered") {
      return (
        <span className="status-pill delivered">
          <span className="status-dot"></span> Delivered
        </span>
      );
    }
    if (s === "shipped") {
      return (
        <span className="status-pill shipped">
          <span className="status-dot"></span> Shipped
        </span>
      );
    }
    return (
      <span className="status-pill processing">
        <span className="status-dot"></span> Processing
      </span>
    );
  };

  return (
    <>
      <MetaData title="All Orders Management — Admin Console" />

      <div className="product-list" style={{ marginTop: 0 }}>
        <div className={!toggle ? "listSidebar" : "toggleBox"}>
          <Sidebar />
        </div>

        <div className="list-table">
          <Navbar toggleHandler={toggleHandler} />

          <div className="admin-orders-inner" style={{ padding: "0.5rem 0 3rem" }}>
            {/* Header */}
            <div className="admin-page-header">
              <div className="admin-page-title-wrap">
                <span className="admin-page-subtag">Fulfilment & Operations</span>
                <h1 className="admin-page-title">Orders Management</h1>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="admin-orders-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon-wrap">
                  <ReceiptLongIcon fontSize="small" />
                </div>
                <div className="stat-meta">
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-value">{stats.total}</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap amber">
                  <HourglassTopIcon fontSize="small" />
                </div>
                <div className="stat-meta">
                  <span className="stat-label">Processing</span>
                  <span className="stat-value">{stats.processing}</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap blue">
                  <LocalShippingOutlinedIcon fontSize="small" />
                </div>
                <div className="stat-meta">
                  <span className="stat-label">In Transit</span>
                  <span className="stat-value">{stats.shipped}</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap emerald">
                  <CheckCircleOutlineIcon fontSize="small" />
                </div>
                <div className="stat-meta">
                  <span className="stat-label">Delivered</span>
                  <span className="stat-value">{stats.delivered}</span>
                </div>
              </div>
            </div>

            {/* Toolbar Card */}
            <div className="admin-toolbar-card">
              <div className="filter-tabs-group">
                <button
                  type="button"
                  className={`filter-tab-pill ${activeTab === "ALL" ? "active" : ""}`}
                  onClick={() => setActiveTab("ALL")}
                >
                  All Orders ({stats.total})
                </button>
                <button
                  type="button"
                  className={`filter-tab-pill ${activeTab === "PROCESSING" ? "active" : ""}`}
                  onClick={() => setActiveTab("PROCESSING")}
                >
                  Processing ({stats.processing})
                </button>
                <button
                  type="button"
                  className={`filter-tab-pill ${activeTab === "SHIPPED" ? "active" : ""}`}
                  onClick={() => setActiveTab("SHIPPED")}
                >
                  Shipped ({stats.shipped})
                </button>
                <button
                  type="button"
                  className={`filter-tab-pill ${activeTab === "DELIVERED" ? "active" : ""}`}
                  onClick={() => setActiveTab("DELIVERED")}
                >
                  Delivered ({stats.delivered})
                </button>
              </div>

              <div className="search-input-wrap">
                <SearchIcon style={{ color: "#71717a", fontSize: "1.1rem" }} />
                <input
                  type="text"
                  placeholder="Search by Order ID, City, Status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Orders Table */}
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <Loader />
              </div>
            ) : (
              <div className="admin-table-card">
                {filteredOrders.length === 0 ? (
                  <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#71717a" }}>
                    <ReceiptLongIcon style={{ fontSize: "3rem", color: "#d4d4d8", marginBottom: "0.5rem" }} />
                    <h3 style={{ margin: "0.25rem 0", color: "#18181b", fontWeight: 600 }}>No orders found</h3>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      {searchQuery
                        ? `No orders matching "${searchQuery}"`
                        : "There are currently no orders in this category."}
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="admin-orders-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date Placed</th>
                          <th>Destination</th>
                          <th>Items</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => {
                          const itemsCount = order.orderItems ? order.orderItems.length : 0;
                          const totalItemsQty = order.orderItems
                            ? order.orderItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
                            : 0;

                          return (
                            <tr key={order._id}>
                              {/* Order ID Pill */}
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <Link
                                    to={`/admin/order/${order._id}`}
                                    className="order-id-link"
                                    title="View & Process Order"
                                  >
                                    #{order._id.substring(0, 8)}...
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => copyOrderId(order._id)}
                                    title="Copy full Order ID"
                                    style={{
                                      border: "none",
                                      background: "none",
                                      cursor: "pointer",
                                      color: copiedId === order._id ? "#059669" : "#a1a1aa",
                                      padding: "2px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <ContentCopyIcon style={{ fontSize: "0.95rem" }} />
                                  </button>
                                </div>
                              </td>

                              {/* Date */}
                              <td style={{ color: "#52525b", fontSize: "0.84rem" }}>
                                {formatDate(order.createdAt)}
                              </td>

                              {/* Destination */}
                              <td>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontWeight: 600, color: "#18181b", fontSize: "0.85rem" }}>
                                    {(order.shippingInfo && order.shippingInfo.city) || "Direct"}, {(order.shippingInfo && order.shippingInfo.state) || ""}
                                  </span>
                                  <span style={{ fontSize: "0.76rem", color: "#71717a" }}>
                                    PIN: {(order.shippingInfo && order.shippingInfo.pinCode) || "N/A"}
                                  </span>
                                </div>
                              </td>

                              {/* Items */}
                              <td>
                                <span style={{ fontWeight: 600, color: "#18181b", fontSize: "0.86rem" }}>
                                  {itemsCount} {itemsCount === 1 ? "Product" : "Products"}
                                </span>
                                <span style={{ fontSize: "0.78rem", color: "#71717a", marginLeft: "0.3rem" }}>
                                  ({totalItemsQty} qty)
                                </span>
                              </td>

                              {/* Amount */}
                              <td>
                                <span style={{ fontWeight: 700, color: "#09090b", fontSize: "0.94rem" }}>
                                  ₹{(order.totalPrice || 0).toLocaleString("en-IN")}
                                </span>
                              </td>

                              {/* Status */}
                              <td>{getStatusBadge(order.orderStatus)}</td>

                              {/* Actions */}
                              <td>
                                <div className="order-table-actions" style={{ justifyContent: "flex-end" }}>
                                  <Link
                                    to={`/admin/order/${order._id}`}
                                    className="order-table-btn"
                                    title="Process & Manage Order"
                                  >
                                    <LaunchIcon style={{ fontSize: "1rem" }} />
                                  </Link>
                                  <button
                                    type="button"
                                    className="order-table-btn delete"
                                    onClick={() => deleteOrderHandler(order._id)}
                                    title="Delete Order"
                                  >
                                    <DeleteOutlineIcon style={{ fontSize: "1.1rem" }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderList;
