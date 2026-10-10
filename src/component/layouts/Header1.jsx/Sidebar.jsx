import React, { useEffect } from "react";
import { logout } from "../../../actions/userAction";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAlert } from "../../../context/AlertContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import LoginIcon from "@mui/icons-material/Login";
import CurrencySelector from "../CurrencySelector/CurrencySelector";
import "./SideBar.css";

const Sidebar = ({ handleSideBarMenu, isAuthenticated, user }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  // Lock background scroll when drawer is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const logOutHandler = () => {
    dispatch(logout());
    alert.success("Logout Successfully");
  };

  return (
    <div className="sidebar-drawer-root">
      {/* Dimmed backdrop overlay */}
      <div
        className="sidebar-backdrop"
        onClick={handleSideBarMenu}
        aria-hidden="true"
      />

      {/* Slide-out Navigation Drawer */}
      <aside
        className="sidebar-container"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        <div className="sidebar-top-bar">
          <Link to="/" className="sidebar-brand-header" onClick={handleSideBarMenu}>
            <img src="/logo.png" alt="THE64SQUARES Logo" className="sidebar-brand-img" />
            <span className="sidebar-brand-title">THE64SQUARES</span>
          </Link>
          <button
            className="sidebar-close-btn"
            onClick={handleSideBarMenu}
            aria-label="Close navigation menu"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>

        <ul className="sidebar-menu" onClick={handleSideBarMenu}>
          {isAuthenticated && user && user.role === "admin" && (
            <Link to="/admin/dashboard" className="sidebar-link">
              <li className="sidebar-menu-item">
                <DashboardIcon className="sidebar-item-icon" />
                <span className="sidebar-menu-item-text">Dashboard</span>
              </li>
            </Link>
          )}

          <Link to="/" className="sidebar-link">
            <li className="sidebar-menu-item">
              <HomeIcon className="sidebar-item-icon" />
              <span className="sidebar-menu-item-text">Home</span>
            </li>
          </Link>

          <Link to="/products" className="sidebar-link">
            <li className="sidebar-menu-item">
              <Inventory2Icon className="sidebar-item-icon" />
              <span className="sidebar-menu-item-text">Products</span>
            </li>
          </Link>

          <Link to="/about_us" className="sidebar-link">
            <li className="sidebar-menu-item">
              <InfoIcon className="sidebar-item-icon" />
              <span className="sidebar-menu-item-text">Our Story</span>
            </li>
          </Link>

          <Link to="/contact" className="sidebar-link">
            <li className="sidebar-menu-item">
              <ContactPageIcon className="sidebar-item-icon" />
              <span className="sidebar-menu-item-text">Contact</span>
            </li>
          </Link>

          <div className="sidebar-menu-divider" />

          {/* Currency & Region Selector */}
          <div className="sidebar-currency-wrapper" style={{ padding: "8px 20px 14px 20px" }}>
            <span style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, display: "block", marginBottom: "6px" }}>
              Currency & Region
            </span>
            <CurrencySelector variant="sidebar" />
          </div>

          <div className="sidebar-menu-divider" />

          <Link to="/account" className="sidebar-link">
            <li className="sidebar-menu-item">
              <AccountCircleIcon className="sidebar-item-icon" />
              <span className="sidebar-menu-item-text">My Account</span>
            </li>
          </Link>

          {isAuthenticated ? (
            <li className="sidebar-menu-item sidebar-logout-item" onClick={logOutHandler}>
              <ExitToAppIcon className="sidebar-item-icon" />
              <span className="sidebar-menu-item-text">Logout</span>
            </li>
          ) : (
            <Link to="/login" className="sidebar-link">
              <li className="sidebar-menu-item sidebar-login-item">
                <LoginIcon className="sidebar-item-icon" />
                <span className="sidebar-menu-item-text">Sign In / Register</span>
              </li>
            </Link>
          )}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
