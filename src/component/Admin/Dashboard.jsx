import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import { getAdminProducts, clearErrors } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "../../context/AlertContext";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import "./Dashboard.css";

Highcharts3D(Highcharts);

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const [toggle, setToggle] = useState(false);

  const { products, loading, error } = useSelector((state) => state.products);
  const { orders, error: ordersError } = useSelector((state) => state.allOrders);
  const { users, error: usersError } = useSelector((state) => state.allUsers);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (usersError) {
      alert.error(usersError);
      dispatch(clearErrors());
    }
    if (ordersError) {
      alert.error(ordersError);
      dispatch(clearErrors());
    }

    dispatch(getAllOrders());
    dispatch(getAllUsers());
    dispatch(getAdminProducts());
  }, [dispatch, error, alert, ordersError, usersError]);

  const toggleHandler = () => {
    setToggle((prev) => !prev);
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

  // Inventory count calculations
  let outOfStockCount = 0;
  if (products && products.length > 0) {
    products.forEach((item) => {
      const stock = item.Stock ?? item.stock ?? 0;
      if (stock === 0) {
        outOfStockCount += 1;
      }
    });
  }
  const totalProductsCount = products ? products.length : 0;
  const inStockCount = Math.max(0, totalProductsCount - outOfStockCount);

  // Total revenue calculation
  let totalRevenue = 0;
  if (orders && orders.length > 0) {
    orders.forEach((item) => {
      totalRevenue += item.totalPrice || 0;
    });
  }

  // Stock Distribution Donut/Pie Chart
  const stockChartOptions = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      style: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: "<b>{point.name}</b>: {point.y} items ({point.percentage:.1f}%)",
      backgroundColor: "#09090b",
      style: { color: "#ffffff" },
      borderRadius: 8,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        depth: 35,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: {
            color: "#27272a",
            fontWeight: "600",
            fontSize: "12px",
          },
        },
      },
    },
    series: [
      {
        name: "Stock Status",
        data: [
          {
            name: "In Stock",
            y: inStockCount,
            color: "#18181b",
          },
          {
            name: "Out of Stock",
            y: outOfStockCount,
            color: "#c5a880",
            sliced: outOfStockCount > 0,
            selected: outOfStockCount > 0,
          },
        ],
      },
    ],
  };

  // Revenue Performance Chart
  const revenueChartOptions = {
    chart: {
      type: "area",
      backgroundColor: "transparent",
      style: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: ["Base", "Current Revenue"],
      lineColor: "#e4e4e7",
      tickColor: "#e4e4e7",
      labels: {
        style: { color: "#71717a", fontWeight: "500" },
      },
    },
    yAxis: {
      title: {
        text: "Revenue (INR)",
        style: { color: "#71717a", fontSize: "11px" },
      },
      gridLineColor: "#f4f4f5",
      labels: {
        style: { color: "#71717a" },
        formatter: function () {
          return "₹" + this.value.toLocaleString("en-IN");
        },
      },
    },
    tooltip: {
      formatter: function () {
        return "<b>" + this.x + "</b><br/>Revenue: ₹" + this.y.toLocaleString("en-IN");
      },
      backgroundColor: "#09090b",
      style: { color: "#ffffff" },
      borderRadius: 8,
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(197, 168, 128, 0.45)"],
            [1, "rgba(197, 168, 128, 0.02)"],
          ],
        },
        marker: {
          radius: 5,
          fillColor: "#c5a880",
          lineWidth: 2,
          lineColor: "#ffffff",
        },
        lineWidth: 3,
        lineColor: "#c5a880",
        states: {
          hover: {
            lineWidth: 3,
          },
        },
        threshold: null,
      },
    },
    series: [
      {
        name: "Gross Sales",
        data: [0, totalRevenue],
      },
    ],
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Admin Command Center - THE64SQUARES" />

          <div className="admin-dashboard-root">
            {/* Sidebar Desktop & Mobile */}
            <div className={!toggle ? "admin-dashboard-sidebar-wrap" : "admin-dashboard-sidebar-toggle"}>
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="admin-dashboard-main">
              <Navbar toggleHandler={toggleHandler} />

              <div className="admin-dashboard-header">
                <div>
                  <h1 className="admin-dashboard-title">Command Center</h1>
                  <p className="admin-dashboard-subtitle">
                    Real-time operational metrics for THE64SQUARES chess boutique.
                  </p>
                </div>
              </div>

              {/* 4 Luxury KPI Cards */}
              <section className="admin-kpi-grid">
                {/* 1. Products */}
                <div
                  className="admin-kpi-card"
                  onClick={() => navigate("/admin/products")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="admin-kpi-card-top">
                    <div className="admin-kpi-icon-wrap">
                      <Inventory2OutlinedIcon />
                    </div>
                    <span className="admin-kpi-badge">Catalog</span>
                  </div>
                  <div>
                    <div className="admin-kpi-label">Total Products</div>
                    <div className="admin-kpi-value">{totalProductsCount}</div>
                    <p className="admin-kpi-subtext">Active chess sets & boards</p>
                  </div>
                </div>

                {/* 2. Orders */}
                <div
                  className="admin-kpi-card"
                  onClick={() => navigate("/admin/orders")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="admin-kpi-card-top">
                    <div className="admin-kpi-icon-wrap">
                      <ReceiptLongOutlinedIcon />
                    </div>
                    <span className="admin-kpi-badge">Orders</span>
                  </div>
                  <div>
                    <div className="admin-kpi-label">Total Orders</div>
                    <div className="admin-kpi-value">{orders ? orders.length : 0}</div>
                    <p className="admin-kpi-subtext">Orders placed across store</p>
                  </div>
                </div>

                {/* 3. Users */}
                <div
                  className="admin-kpi-card"
                  onClick={() => navigate("/admin/users")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="admin-kpi-card-top">
                    <div className="admin-kpi-icon-wrap">
                      <PeopleAltOutlinedIcon />
                    </div>
                    <span className="admin-kpi-badge">Patrons</span>
                  </div>
                  <div>
                    <div className="admin-kpi-label">Registered Users</div>
                    <div className="admin-kpi-value">{users ? users.length : 0}</div>
                    <p className="admin-kpi-subtext">Verified boutique members</p>
                  </div>
                </div>

                {/* 4. Revenue */}
                <div
                  className="admin-kpi-card"
                  onClick={() => navigate("/admin/orders")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="admin-kpi-card-top">
                    <div className="admin-kpi-icon-wrap">
                      <AccountBalanceWalletOutlinedIcon />
                    </div>
                    <span className="admin-kpi-badge">Finance</span>
                  </div>
                  <div>
                    <div className="admin-kpi-label">Gross Revenue</div>
                    <div className="admin-kpi-value">
                      ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="admin-kpi-subtext">All-time sales volume</p>
                  </div>
                </div>
              </section>

              {/* 2 Luxury Analytics Charts */}
              <section className="admin-charts-grid">
                {/* Stock distribution */}
                <div className="admin-chart-card">
                  <div className="admin-chart-header">
                    <h2 className="admin-chart-title">Inventory Stock Status</h2>
                    <p className="admin-chart-subtitle">
                      Active stock ratio between in-stock and depleted products
                    </p>
                  </div>
                  <div className="admin-chart-body">
                    <HighchartsReact highcharts={Highcharts} options={stockChartOptions} />
                  </div>
                </div>

                {/* Revenue trajectory */}
                <div className="admin-chart-card">
                  <div className="admin-chart-header">
                    <h2 className="admin-chart-title">Revenue Trajectory</h2>
                    <p className="admin-chart-subtitle">
                      Cumulative financial volume realized from verified customer orders
                    </p>
                  </div>
                  <div className="admin-chart-body">
                    <HighchartsReact highcharts={Highcharts} options={revenueChartOptions} />
                  </div>
                </div>
              </section>
            </main>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
