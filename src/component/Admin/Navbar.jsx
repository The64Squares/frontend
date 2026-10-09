import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { Link } from "react-router-dom";
import logoImg from "../../Image/logo.png";
import "./Navbar.css";

const Navbar = ({ toggleHandler }) => {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <button
          type="button"
          className="admin-navbar-menu-btn"
          onClick={toggleHandler}
          aria-label="Toggle navigation"
        >
          <MenuIcon fontSize="small" />
        </button>

        <Link to="/admin/dashboard" className="admin-navbar-brand">
          <img
            src={logoImg}
            alt="THE 64 SQUARES"
            className="admin-navbar-logo"
          />
          <span className="admin-navbar-tag">Console</span>
        </Link>
      </div>

      <div className="admin-navbar-right">
        <Link to="/" className="admin-navbar-store-btn">
          <StorefrontOutlinedIcon style={{ fontSize: "1.1rem" }} />
          <span>Live Store</span>
        </Link>
        <Link to="/contact" className="admin-navbar-contact-btn">
          <SupportAgentOutlinedIcon style={{ fontSize: "1.1rem" }} />
          <span>Support</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
