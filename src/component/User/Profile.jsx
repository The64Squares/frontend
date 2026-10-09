import React, { useEffect } from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import "./Profile.css";

const ProfilePage = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.userData);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
    navigate("/login");
  };

  const formatJoinedDate = (dateString) => {
    if (!dateString) return "Active Patron";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return "Recent";
    }
  };

  if (loading || !user) {
    return <Loader />;
  }

  const isAdmin = user.role === "admin";

  return (
    <>
      <MetaData title={`${user.name || "Patron"} - Profile | THE64SQUARES`} />

      <div className="profile-root">
        <div className="profile-container">
          {/* Hero Welcome Banner */}
          <section className="profile-hero">
            <div className="profile-hero-left">
              <div className="profile-hero-badge">
                <ShieldOutlinedIcon style={{ fontSize: "0.9rem" }} />
                <span>{isAdmin ? "Chief Administrator" : "Grandmaster Patron"}</span>
              </div>
              <h1 className="profile-hero-title">Account Sanctuary</h1>
              <p className="profile-hero-sub">
                Welcome back, {user.name}. Manage your boutique credentials, orders, and privileges.
              </p>
            </div>

            {isAdmin && (
              <Link to="/admin/dashboard" className="profile-admin-cta">
                <AdminPanelSettingsOutlinedIcon />
                <span>Open Admin Console</span>
              </Link>
            )}
          </section>

          {/* 2-Column Responsive Layout */}
          <div className="profile-grid">
            {/* Left Column: Identity & Navigation */}
            <aside className="profile-identity-card">
              <div className="profile-avatar-wrap">
                <Avatar
                  alt={user.name}
                  src={user.avatar && user.avatar.url}
                  className="profile-avatar-img"
                >
                  {user.name ? user.name[0] : "P"}
                </Avatar>
              </div>

              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>

              <div className="profile-meta-chips">
                <div className="profile-meta-row">
                  <span className="profile-meta-label">Privilege Level</span>
                  <span className="profile-meta-value">
                    {isAdmin ? "Admin" : "Verified Customer"}
                  </span>
                </div>
                <div className="profile-meta-row">
                  <span className="profile-meta-label">Member Since</span>
                  <span className="profile-meta-value">{formatJoinedDate(user.createdAt)}</span>
                </div>
                <div className="profile-meta-row">
                  <span className="profile-meta-label">Account Status</span>
                  <span className="profile-meta-value" style={{ color: "#059669" }}>
                    Verified Active
                  </span>
                </div>
              </div>

              <div className="profile-actions-stack">
                <Link to="/orders" className="profile-orders-btn">
                  <ShoppingBagOutlinedIcon style={{ fontSize: "1.1rem" }} />
                  <span>View Order History</span>
                </Link>

                <button
                  type="button"
                  className="profile-logout-btn"
                  onClick={logoutHandler}
                >
                  <LogoutIcon style={{ fontSize: "1.1rem" }} />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>

            {/* Right Column: Credentials & Security */}
            <main className="profile-main-stack">
              {/* Personal Details Card */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <div>
                    <h2 className="profile-section-title">Personal Credentials</h2>
                    <p className="profile-section-desc">
                      Your identity and contact information for shipping and concierge services.
                    </p>
                  </div>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field-group">
                    <span className="profile-field-label">Full Name</span>
                    <div className="profile-field-value">{user.name || "—"}</div>
                  </div>

                  <div className="profile-field-group">
                    <span className="profile-field-label">Primary Email</span>
                    <div className="profile-field-value">{user.email || "—"}</div>
                  </div>

                  <div className="profile-field-group">
                    <span className="profile-field-label">Account Role</span>
                    <div className="profile-field-value">
                      {isAdmin ? "Administrator" : "Patron Member"}
                    </div>
                  </div>

                  <div className="profile-field-group">
                    <span className="profile-field-label">Authentication ID</span>
                    <div className="profile-field-value" style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {user._id ? `${user._id.substring(0, 10)}...` : "Registered"}
                    </div>
                  </div>
                </div>

                <Link to="/profile/update" className="profile-btn-primary">
                  <EditOutlinedIcon style={{ fontSize: "1rem" }} />
                  <span>Edit Personal Details</span>
                </Link>
              </div>

              {/* Security & Access Card */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <div>
                    <h2 className="profile-section-title">Security & Password</h2>
                    <p className="profile-section-desc">
                      Manage account credentials, passcodes, and multi-device authentication.
                    </p>
                  </div>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field-group">
                    <span className="profile-field-label">Account Password</span>
                    <div className="profile-field-value">••••••••••••••••</div>
                  </div>

                  <div className="profile-field-group">
                    <span className="profile-field-label">Password Health</span>
                    <div className="profile-field-value" style={{ color: "#059669", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <VerifiedUserOutlinedIcon style={{ fontSize: "1rem" }} />
                      <span>Encrypted & Protected</span>
                    </div>
                  </div>
                </div>

                <div className="profile-security-notice">
                  To protect your bespoke chess acquisition orders, we recommend updating your password periodically. Never share your credentials with unauthorized parties.
                </div>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link to="/password/update" className="profile-btn-primary">
                    <LockResetOutlinedIcon style={{ fontSize: "1rem" }} />
                    <span>Change Password</span>
                  </Link>

                  <button
                    type="button"
                    className="profile-btn-secondary"
                    onClick={logoutHandler}
                  >
                    <span>Log Out From All Devices</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
