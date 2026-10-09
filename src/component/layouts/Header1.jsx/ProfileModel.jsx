import React, { useEffect, useRef, useState } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar } from "@mui/material";
import "./ProfileModel.css";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import { useDispatch } from "react-redux";
import { logout } from "../../../actions/userAction";

const ProfileModal = ({ user, isAuthenticated }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const logoutUserHandler = () => {
    setIsOpen(false);
    dispatch(logout());
    alert.success("Logout Successfully");
  };

  return (
    <div className="profile-dropdown-wrapper">
      <button
        ref={triggerRef}
        type="button"
        className={`profile-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        {isAuthenticated && user?.avatar?.url ? (
          <Avatar
            src={user.avatar.url}
            alt={user.name || "User Avatar"}
            className="profile-trigger-avatar"
            sx={{ width: 26, height: 26 }}
          />
        ) : (
          <PersonOutlineOutlinedIcon className="profile-trigger-icon" />
        )}
        <KeyboardArrowDownIcon
          className={`profile-trigger-chevron ${isOpen ? "chevron-rotated" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="profile-dropdown-card" ref={dropdownRef} role="menu">
          {!isAuthenticated ? (
            <div className="profile-guest-header">
              <span className="profile-welcome-badge">THE 64 SQUARES</span>
              <h3 className="profile-guest-title">Welcome</h3>
              <p className="profile-guest-desc">
                Sign in to manage orders, wishlist, and artisanal chess pieces.
              </p>
              <button
                type="button"
                className="profile-signin-btn"
                onClick={() => handleNavigate("/login")}
              >
                Sign In / Register
              </button>
            </div>
          ) : (
            <div className="profile-user-card">
              <div className="profile-avatar-wrap">
                <Avatar
                  src={user?.avatar?.url}
                  alt={user?.name || "Avatar"}
                  sx={{ width: 44, height: 44, bgcolor: "#09090B", color: "#FFFFFF" }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </div>
              <div className="profile-user-meta">
                <span className="profile-user-name">{user?.name}</span>
                <span className="profile-user-email">{user?.email}</span>
                <span className="profile-user-role">
                  {user?.role === "admin" ? "Grandmaster (Admin)" : "Member"}
                </span>
              </div>
            </div>
          )}

          <div className="profile-menu-divider" />

          <div className="profile-menu-items">
            {isAuthenticated && user?.role === "admin" && (
              <button
                type="button"
                className="profile-menu-item"
                onClick={() => handleNavigate("/admin/dashboard")}
              >
                <DashboardOutlinedIcon className="profile-menu-icon" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              type="button"
              className="profile-menu-item"
              onClick={() => handleNavigate(isAuthenticated ? "/account" : "/login")}
            >
              <PersonOutlineOutlinedIcon className="profile-menu-icon" />
              <span>{isAuthenticated ? "My Profile" : "Account Overview"}</span>
            </button>

            <button
              type="button"
              className="profile-menu-item"
              onClick={() => handleNavigate(isAuthenticated ? "/orders" : "/login")}
            >
              <ReceiptLongOutlinedIcon className="profile-menu-icon" />
              <span>My Orders</span>
            </button>

            <button
              type="button"
              className="profile-menu-item"
              onClick={() => handleNavigate("/cart")}
            >
              <ShoppingBagOutlinedIcon className="profile-menu-icon" />
              <span>Shopping Cart</span>
            </button>

            <div className="profile-menu-divider-subtle" />

            {!isAuthenticated ? (
              <button
                type="button"
                className="profile-menu-item profile-auth-action"
                onClick={() => handleNavigate("/login")}
              >
                <LoginOutlinedIcon className="profile-menu-icon" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                type="button"
                className="profile-menu-item profile-logout-item"
                onClick={logoutUserHandler}
              >
                <LogoutOutlinedIcon className="profile-menu-icon" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;

