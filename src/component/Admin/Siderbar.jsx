import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { useSelector } from "react-redux";
import "./Sidebar.css";

function Sidebar() {
  const { user, loading } = useSelector((state) => state.userData);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const navLinks = [
    { label: "Dashboard", to: "/admin/dashboard", icon: <DashboardOutlinedIcon /> },
    { label: "Products", to: "/admin/products", icon: <Inventory2OutlinedIcon /> },
    { label: "Add Product", to: "/admin/new/product", icon: <AddCircleOutlineIcon /> },
    { label: "Categories", to: "/admin/categories", icon: <CategoryOutlinedIcon /> },
    { label: "Orders", to: "/admin/orders", icon: <ReceiptLongOutlinedIcon /> },
    { label: "Inquiries", to: "/admin/inquiries", icon: <EmailOutlinedIcon /> },
    { label: "Reviews", to: "/admin/reviews", icon: <RateReviewOutlinedIcon /> },
    { label: "Users", to: "/admin/users", icon: <PeopleAltOutlinedIcon /> },
  ];

  const storeLinks = [
    { label: "Store Front", to: "/", icon: <StorefrontOutlinedIcon /> },
    { label: "Contact Page", to: "/contact", icon: <EmailOutlinedIcon /> },
  ];

  return (
    <aside className="admin-sidebar">
      {!loading && (
        <>
          <div className="admin-sidebar-profile">
            <div className="admin-sidebar-avatar-wrap">
              <Avatar
                src={user && user.avatar && user.avatar.url}
                alt={user ? user.name : "Admin"}
                className="admin-sidebar-avatar"
              >
                {user && user.name ? user.name[0] : "A"}
              </Avatar>
              <span className="admin-sidebar-online-indicator" title="Active Console" />
            </div>

            <h3 className="admin-sidebar-name" title={user ? user.name : "Admin"}>
              {user ? user.name : "Grandmaster Admin"}
            </h3>

            <p className="admin-sidebar-email" title={user ? user.email : ""}>
              {user ? user.email : "admin@the64squares.com"}
            </p>

            <div className="admin-sidebar-badge">
              <ShieldOutlinedIcon style={{ fontSize: "0.85rem" }} />
              <span>Grandmaster Admin</span>
            </div>
          </div>

          <div className="admin-sidebar-label">Management</div>
          <ul className="admin-sidebar-nav">
            {navLinks.map((item) => {
              const isActive = currentPath === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`admin-sidebar-link ${isActive ? "active" : ""}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="admin-sidebar-divider" />

          <div className="admin-sidebar-label">Shortcuts</div>
          <ul className="admin-sidebar-nav">
            {storeLinks.map((item) => {
              const isActive = currentPath === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`admin-sidebar-link ${isActive ? "active" : ""}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="admin-sidebar-footer">
            <button
              type="button"
              className="admin-sidebar-account-btn"
              onClick={() => navigate("/account")}
            >
              <ManageAccountsOutlinedIcon />
              <span>Admin Profile</span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
